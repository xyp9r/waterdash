import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Вышибалы
app.use(cors());
app.use(express.json());

// Наш первый маршрут
app.get('/api/status', (req: Request, res: Response) => {
	console.log("Кто-то проверил статус сервера!");
	res.json({
		status: "success",
		message: "WaterDash Backend is alive and kicking! 💧 (Now with TypeScript!)"
	});
});

// Запуск сервера
app.listen(PORT, () => {
	console.log(`Бэкенд WaterDash (TS) Успешно запущен на http://localhost:${PORT}`);
})