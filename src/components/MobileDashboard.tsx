import { useState } from 'react';
import HomeTab from './HomeTab';
import HistoryTab from './HistoryTab';
import DrinksTab from './DrinksTab';
import SettingsTab from './SettingsTab';
// Импортируем чертежи данных из нашего мозга, чтобы правильно назвать провода
import type { FavoriteDrink } from '../hooks/useWaterData';

type Tab = 'home' | 'history' | 'drinks' | 'settings';

// Интерфейс пропсов (кабели)
// Говорим компоненту ты тупой у тебя нет своей памяти
// Жди пока в тебя воткнут эти данные и функции снаружи
interface MobileDashboardProps {
	appData: AppState;
	currentWater: number;
	goalWater: number;
	handleUpdateProfile: (newData: any) => Promise<void>;
	handleAddDrink: (amount: number, name: string, icon: string) => Promise<void>;
	handleSaveFavorite: (amount: number, name: string, icon: string) => Promise<void>;
	handleDeleteLog: (idToRemove: string) => Promise<void>;
	handleDeleteFavorite: (idToRemove: string) => Promise<void>;
}

export default function MobileDashboard({
	appData,
	currentWater,
	goalWater,
	handleUpdateProfile,
	handleAddDrink,
	handleSaveFavorite,
	handleDeleteLog,
	handleDeleteFavorite
}: MobileDashboardProps) {

	// Память о том, какая вкладка открыта, живет здесь,
	// так как переключение меню - это сугубо визуальная (мобильная) штука
	const [activeTab, setActiveTab] = useState<Tab>('home');

	return (
			// Главный фон светлый (slate-50) а для ночно темы закладываем (dark:bg-slate-950)
			// transition-colors используется для плавного перетекания света в тьму при смене темы
			<div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex justify-center font-sans transition-colors duration-300">
				
				{/* Экран телефона - чисто белый (bg-white) */}
				<div className="w-full max-w-md bg-white dark:bg-slate-900 h-screen relative shadow-xl overflow-hidden flex flex-col transition-colors duration-300">
					
					{/* Шапка - светлая и чистая */}
					<header className="p-6 pb-2">
						{/* Синий цвет сделал более мягким (blue-500) как в waterminder */}
						<h1 className="text-2xl font-bold text-blue-500 dark:text-blue-400">WaterDash 💧</h1>
						<p className="text-sm text-slate-500 dark:text-slate-400">Stay hydrated, stay sharp</p>
					</header>

					{/* Контент (Вкладки) */}
					{/* ВАЖНО: Сами компоненты табов мы пока не переписывали, они будут темными, это нормально! */}
					<main className="flex-1 overflow-y-auto px-6 pt-6 pb-2 no-scrollbar">
						{activeTab === 'home' && (
								<HomeTab 
										currentWater={currentWater}
										goalWater={goalWater}
										onAddWater={handleAddDrink}
										favoriteDrinks={appData.favoriteDrinks}
										onSaveFavorite={handleSaveFavorite}
									/>
							)}

						{activeTab === 'history' && (
									<HistoryTab 
											logs={appData.todayLogs}
											onDeleteLog={handleDeleteLog}
											historyData={appData.historyData}
										/>
							)}

						{activeTab === 'drinks' && (
									<DrinksTab 
											onAddDrink={handleAddDrink}
											favoriteDrinks={appData.favoriteDrinks}
											onSaveFavorite={handleSaveFavorite}
										/>
							)}

						{activeTab === 'settings' && (
									<SettingsTab 
											currentGoal={goalWater}
											profile={appData.profile}
											onUpdateProfile={handleUpdateProfile}
											favoriteDrinks={appData.favoriteDrinks}
											onDeleteFavorite={handleDeleteFavorite}
										/>
							)}
					</main>

					{/* Нижняя навигация: светлый бар (bg-white) с легкой верхней границей (border-slate-100) */}
					<nav className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around p-4 pb-6 transition-colors duration-300">
						
						<button
							onClick={() => setActiveTab('home')}
							className={`flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
						>
							<span className="text-2xl mb-1">🏠</span>
							<span className="text-xs font-medium">Home</span>
						</button>

						<button
							onClick={() => setActiveTab('history')}
							className={`flex flex-col items-center transition-colors ${activeTab === 'history' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
						>
							<span className="text-2xl mb-1">📜</span>
							<span className="text-xs font-medium">History</span>
						</button>

						<button
							onClick={() => setActiveTab('drinks')}
							className={`flex flex-col items-center transition-colors ${activeTab === 'drinks' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
						>
							<span className="text-2xl mb-1">🍹</span>
							<span className="text-xs font-medium">Drinks</span>
						</button>

						<button
							onClick={() => setActiveTab('settings')}
							className={`flex flex-col items-center transition-colors ${activeTab === 'settings' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
						>
							<span className="text-2xl mb-1">⚙️</span>
							<span className="text-xs font-medium">Settings</span>
						</button>
					</nav>
				</div>
			</div>
		);
}