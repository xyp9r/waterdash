import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Подключаем комнаты
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
	return (
				// BrowserRouner - это оболочка, которая включает магию ссылок
		<BrowserRouter>
			{/* Routes - это место, где переключаются экраны */}
			<Routes>
				
				{/* Если юзер просто зашел на сайт ("/") - кидаем его в Дашборд */}

				<Route path="/" element={<Navigate to="/dashboard" replace />} />

				{/* Прописываем пути к нашим страницам */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register  />} />
				<Route path="/dashboard" element={<Dashboard />} />

			</Routes>
		</BrowserRouter>
	);
}