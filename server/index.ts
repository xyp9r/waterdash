import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'; // Импортируем Присму

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

app.post('/api/logs', async (req: Request, res: Response) => {
	try {
			// Официант принес заказ (данные от юзера лежат в req.body)
		const { amount, name, icon } = req.body;

		// Говорим Присме: "Создай новую запись в таблице waterLog"
		// await означает "подожди, пока база сохранит, это занимает время"
		const newLog = await prisma.waterLog.create({
			data: {
						amount: amount,
						name: name,
						icon: icon
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

app.get('/api/logs', async (req: Request, res: Response) => {
	try {
			// Говорим Присме: "Достань ВООБЩЕ ВСЕ записи из таблицы waterLog"
			// orderBy: { createdAt: 'desc' } означает "сортируй по времени, сначало новые"
			const allLogs = await prisma.waterLog.findMany({
					orderBy: {
									createdAt: 'desc'
					}
			});

			console.log(`📡 Отправили фронтенду ${allLogs.length} записей!`);

			// Отдаем массив с данными обратно в браузер
			res.json({ success: true, data: allLogs });

	} catch (error) {
		console.error("❌ Ошибка при чтении из базы:", error);
		res.status(500).json({ success: false, error: "Не удалось получить данные" });
	}
});

// ==========================================
// УДАЛЯЕМ ИЗ БАЗЫ: Сносим стакан навсегда
// ==========================================
// Обрати внимание на ":id" в ссылке. Это переменная!

app.delete('/api/logs/:id', async (req: Request, res: Response) => {
	try {
			// Достаем ID прямо из ссылки браузера
			const logId = req.params.id as string;

			// Говорим Присме: "Найди запись с этим ID и уничтожь её"
			await prisma.waterLog.delete({
				where: {
					id: logId
				}
			});

			console.log(`🗑️ Успешно удалили запись с ID: ${logId}`);
			res.json({ success: true, message: "Запись стерта из истории!" });

	} catch (error) {
			console.error("❌ Ошибка при удалении из базы:", error);
			res.status(500).json({ success: false, error: "Не удалось удалить данные" });
	}
});

// Запуск
app.listen(PORT, () => {
				console.log(`🚀 Бэкенд WaterDash успешно запущен на http://localhost:${PORT}`);
});