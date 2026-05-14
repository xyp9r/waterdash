import { createContext, useContext, useState, useEffect } from 'react';

// 1. Описываем, что вообще будет лежать в нашем куполе
type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void; // Функция переключатель
}

// 2. Создаем сам контекст (пока пустой)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Создаем Провайдер - компонент-обертку, который мы наденем на всё приложение
export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// Ищем тему в localStorage. Если там пусто - ставим 'light' по умолчанию
	const [theme, setTheme] = useState<Theme>(() => {
		const savedTheme = localStorage.getItem('waterDashTheme');
		return (savedTheme as Theme) || 'light';
	});

	// ЭФФЕКТ: Срабатывает каждый раз, когда меняется стейт `theme`
	useEffect(() => {
		// Тот самый тег <html>
		const root = document.documentElement;

		// Тот самый if о котором я говорил с ИИ
		if (theme === 'dark') {
			root.classList.add('dark');
			root.classList.remove('light');
		} else {
			root.classList.remove('dark');
			root.classList.add('light');
		}

		// Незабываем сохранить выбор юзера в блокнот localStorage
		localStorage.setItem('waterDashTheme', theme);
	}, [theme]); // <-- Массив зависимостей. Эффект следит за переменной theme

	// Функция, которую будет вызывать кнопка в настройках
	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
	};

	return (
			// Раздаем данные (theme и toggleTheme) всем дочерним элементам (children)
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
		);
}

// 4. Делаем удобный кастомный хук, чтобы компоненты могли легко брать тему
export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}