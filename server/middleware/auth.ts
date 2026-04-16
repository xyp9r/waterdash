import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Функция-охранник
export const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
	// Ищем бейджик в заголовках (обычно он передаётся как "Bearer eyJbg...")
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	// Если бейджика вообще нет - разворачиваем
	if (!token) {
			return res.status(401).json({ success: false, error: "Нет доступа (нет токена)" });
	}

	// Проверяем подлинность бейджика нашей секретной печатью
	jwt.verify(token, process.env.JWT_SECRET as string, (err, decodedUser) => {
		if (err) {
			return res.status(403).json({ success: false, error: "Токен поддельный или просрочен" });
		}

		// Бенджик настоящий! Достаем из него данные юзера (ID) и приклеиваем к запросу
		(req as any).user = decodedUser;

		// Открываем дверь
		next();
	});
};