const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 1. НАШИ ВЫШИБАЛЫ (Middleware)
app.use(cors()); // Разрешаем любые запросы (пока мы на локалке)
app.use(express.json()); // Учим сервер понимать JSON, который будет присылать фронтенд

// 2. НАШ ПЕРВЫЙ МАРШРУТ
// Когда кто-то стучится по адресу http://localhost:3000/api/status мы отвечаем -
app.get('/api/status', (req, res) => {
	console.log("Кто-то проверил статус сервера!");
	res.json({
					status: "success",
					message: "WaterDash Backend is alive and kicking! 💧"
	});
});

// 3. Запуск сервера

app.listen(PORT, () => {
			console.log(`🚀 Бэкенд WaterDash успешно запущен на http://localhost:${PORT}`);
})