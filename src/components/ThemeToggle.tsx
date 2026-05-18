// Импортируем кастомный хук темы
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

export default function ThemeToggle() {
	// Достаем хук
	const {theme, toggleTheme} = useTheme();

	// Локация, чтобы можно было убрать переключатель тем из дашборда
	const location = useLocation();

	const allowedPaths = ['/onboarding', '/register', '/login'];

	const showComponent = allowedPaths.includes(location.pathname);

	if (showComponent === false) return null;

	return (
			<button
				onClick={() => toggleTheme()}
				className="
				bg-white text-slate-700 border border-slate-100 rounded-3xl fixed bottom-4 right-4 p-3
				dark:bg-slate-800 dark:text-white dark:border dark:border-slate-700
				">
					{theme === 'light' ? '☀️ ' : '🌙'}
				</button>
		);
}