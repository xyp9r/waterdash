import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Подключаем комнаты
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';

// ==========================================
// 🛡️ ОХРАННИК (PROTECTED ROUTE)
// ==========================================
// Это специальный компонент-обертка. Он принимает внутрь себя другой компонент (children).
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	// 1. Охранник проверяет, есть ли бейджик в кармане
	const token = localStorage.getItem('waterDashToken');

	// 2. Если бейджика нет — даем пинка и принудительно кидаем на страницу входа
	if (!token) {
		return <Navigate to="/login" replace />;
	}

	// 3. Если всё ок — открываем дверь (рендерим то, что внутри)
	return children;
};

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				
				{/* Если юзер просто зашел на сайт ("/") - перенаправляем на Дашборд */}
				<Route path="/" element={<Navigate to="/dashboard" replace />} />

				{/* ОТКРЫТЫЕ КОМНАТЫ (Сюда может зайти кто угодно без бейджика) */}
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/onboarding" element={<Onboarding />} />

				{/* 🔒 ЗАЩИЩЕННАЯ КОМНАТА (Дашборд) */}
				<Route 
					path="/dashboard" 
					element={
						// Заворачиваем наш Дашборд в Охранника
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					} 
				/>

			</Routes>
		</BrowserRouter>
	);
}