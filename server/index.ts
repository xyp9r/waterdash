import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'; // Импортируем Присму
import bcrypt from 'bcryptjs'; // Хеширование
import jwt from 'jsonwebtoken'; 
import { authenticateToken } from './middleware/auth';

const app = express();
const prisma = new PrismaClient(); // Создаем умного переводчика
const PORT = 3000;

app.use(cors());
app.use(express.json());

// НАШ СТАРЫЙ РОУТ (проверка связи)
app.get('/api/status', (req: Request, res: Response) => {
	res.json({
		status: "success",
		message: "WaterDash Backend is alive and kicking!"
	});
});

// ==========================================
// НОВЫЙ РОУТ: Сохраняем выпитый стакан в базу
// ==========================================

app.post('/api/logs', authenticateToken, async (req: Request, res: Response) => {
	try {
			// Официант принес заказ (данные от юзера лежат в req.body)
		const { amount, name, icon } = req.body;

		// Достаем НАСТОЯЩИЙ ID юзера, который охранник вытащил из токена
		const userId = (req as any).user.userId;

		// Говорим Присме: "Создай новую запись в таблице waterLog"
		// await означает "подожди, пока база сохранит, это занимает время"
		const newLog = await prisma.waterLog.create({
			data: {
						amount: amount,
						name: name,
						icon: icon,
						userId: userId
			}
		});

		console.log("✅ Успешно сохранено в базу:", newLog);

		// Отвечаем фронтенду, что всё прошло супер, и отдаем сохраненный лог
		res.json({ success: true, data: newLog });

	} catch (error) {
		console.error("❌ Ошибка базы данных:", error);
		res.status(500).json({ success: false, error: "Не удалось сохранить воду" });
	}
});

// ==========================================
// ЧИТАЕМ ИЗ БАЗЫ: Отдаем все выпитые стаканы
// ==========================================

app.get('/api/logs', authenticateToken, async (req: Request, res: Response): Promise<any> => {
	try {
			const userId = (req as any).user.userId; // Достаем ID из бейджика

			const userLogs = await prisma.waterLog.findMany({
					where: { userId: userId }, // Ищем только свои стаканы
					orderBy: { createdAt: 'desc' }
			});

			console.log(`📡 Отправили юзеру ${userLogs.length} его личных записей!`);
			res.json({ success: true, data: userLogs });

	} catch (error) {
			console.error("❌ Ошибка причтении из базы:", error);
			res.status(500).json({ success: false, error: "Не удалось получить данные" });
	}

});

// ==========================================
// УДАЛЯЕМ ИЗ БАЗЫ: Сносим стакан навсегда
// ==========================================
// Обрати внимание на ":id" в ссылке. Это переменная!

app.delete('/api/logs/:id', authenticateToken, async (req: Request, res: Response): Promise<any> => {
	try {
			const logId = req.params.id as string;
			const userId = (req as any).user.userId; // Кто пытается удалить?

			// Сначала проверяем, существует ли стакан и принадлежит ли он этому пользователю
			const log = await prisma.waterLog.findUnique({ where: { id: logId, } });

			if (!log) return res.status(404).json({ success: false, error: "Стакан не найден" });
			if (log.userId !== userId) return res.status(403).json({ success: false, error: "Ахтунг! Попытка удалить чужой стакан!" });

			// Если все ок - удаляем
			await prisma.waterLog.delete({ where: { id: logId } });

			console.log(`🗑️ Юзер удалил свой стакан с ID: ${logId}`);
			res.json({ success: true, message: "Запись стерта из истории!" });

	} catch (error) {
			console.error("❌ Ошибка при удалении:", error);
			res.status(500).json({ success: false, error: "Не удалось удалить данные" });
	}

});

// ==========================================
// ПРОФИЛЬ ЮЗЕРА: Отдаем норму воды при загрузке Дашборда
// ==========================================

app.get('/api/users/me', authenticateToken, async (req: Request, res: Response): Promise<any> => {
	try {
			const userId = (req as any).user.userId;

			const user = await prisma.user.findUnique({
						where: { id: userId },
						select: { email: true, name: true, dailyGoal: true } // select: true позволяем НЕ отдавать хеш пароля хакерам!
			});

			if (!user) return res.status(404).json({ success: false, error: "Юзер не найден" });

			res.json({ success: true, user: user });

	} catch (error) {
			console.error("❌ Ошибка при загрузке профиля:", error);
			res.status(500).json({ success: false, error: "Ошибка сервера" });
	}

});

// ==========================================
// РЕГИСТРАЦИЯ (Создаем нового юзера)
// ==========================================

app.post('/api/auth/register', async (req: Request, res: Response): Promise<any> => {
		try {
				// Достаем данные из посылки
				const { email, password, name } = req.body;

				// Проверяем, нет ли уже такого юзера (защита от дублей)
				const existingUser = await prisma.user.findUnique({
						where: { email: email }
				});

				if (existingUser) {
						return res.status(400).json({ success: false, error: "Этот email уже занят!" });
				}

				// Хешируем пароль (магия криптографии)
				// 10 - это "соль", стандартный уровень сложности шифрования
				const hashedPassword = await bcrypt.hash(password, 10);

				// Создаем юзера в базе, сохраняя ЗАШИФРОВАННЫЙ пароль
				const newUser = await prisma.user.create({
						data: {
									email: email,
									name: name,
									password: hashedPassword
						}
				});

				// Автологин - печатаем бейджик прямо тут!
				const token = jwt.sign(
										{ userId: newUser.id },
										process.env.JWT_SECRET as string,
										{ expiresIn: '7d' }
					);

				console.log(`👤 Зарегестрирован новый юзер: ${newUser.email}`);

				// Отвечаем фронтенду успехом. ВАЖНО: Пароль обратно не отдаем! И отдаем токен
				res.json({
								success: true,
								data: { id: newUser.id, email: newUser.email, name: newUser.name },
								token: token
				});

		} catch (error) {
				console.error("❌ Ошибка при регистрации:", error);
				res.status(500).json({ success: false, error: "Ошибка сервера при регистрации" })
		}
});

// ==========================================
// ОБНОВЛЕНИЕ ЦЕЛИ ВОДЫ (Только для авторизованных)
// ==========================================

app.post('/api/users/goal', authenticateToken, async (req: Request, res: Response): Promise<any> => {
		try {
				// Достаем новую цель из посылки от фронтенда
				const { goal } = req.body;

				// Охранник уже проверил бейджик и положил ID юзера в req.user
				const userId = (req as any).user.userId;

				if (!goal) {
						return res.status(400).json({ success: false, error: "Не передана цель воды" });
				}

				// Просим присму найти юзера по его ID и переписать колонку dailyGoal
				const updatedUser = await prisma.user.update({
							where: { id: userId },
							data: { dailyGoal: goal }
				});

				console.log(`🎯 Юзер ${updatedUser.email} обновил цель на: ${goal} мл`);

				// Отвечаем фронтенду, что всё супер
				res.json({
								success: true,
								message: "Цель успешно обновлена!",
								user: { email: updatedUser.email, dailyGoal: updatedUser.dailyGoal }
				});

		} catch (error) {
						console.error("❌ Ошибка при обновлении цели:", error);
						res.status(500).json({ success: false, error: "Ошибка сервера при сохранении цели" });
		}
});

// ==========================================
// ЛОГИН (Выдаем JWT бейджик)
// ==========================================

app.post('/api/auth/login', async (req: Request, res: Response): Promise<any> => {
		try {
				const { email, password } = req.body;

				// Ищем юзера по почте
				const user = await prisma.user.findUnique({ where: { email } });

				// Если юзерра нет, выдаем ошибку 401 (Unauthorized)
				if (!user) {
						return res.status(401).json({ success: false, error: "Неверный email или пароль" });
				}

				// Сравниваем пароль (bcrypt сам возьмет хэш из базы и проверит, подходит ли к нему пароль)
				const isPasswordValid = await bcrypt.compare(password, user.password);

				if (!isPasswordValid) {
					return res.status(401).json({ success: false, error: "Неверный email или пароль" });
				}

				// Пароль подошел! Печатаем бейджик (JWT)
				const token = jwt.sign(
						{ userId: user.id }, // Прячем ID юзера прямо ВНУТРЬ бейджика
						process.env.JWT_SECRET as string, // Ставим секретную печать
						{ expiresIn: '7d' } // Бейджик сгорит через 7 дней
				);

				console.log(`🔐 Юзер вошел в систему: ${user.email}`);

				// Отдаем бейджик фронтенду!
				res.json({
								success: true,
								token: token, // Сам пропуск
								user: { id: user.id, email: user.email, name: user.name }
				});

		} catch (error) {
					console.error("❌ Ошибка при логине:", error);
					res.status(500).json({ success: false, error: "Ошибка сервера при логине" });
		}
});

// Запуск
app.listen(PORT, () => {
				console.log(`🚀 Бэкенд WaterDash успешно запущен на http://localhost:${PORT}`);
});