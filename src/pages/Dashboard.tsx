import { useState } from 'react';
import HomeTab from '../components/HomeTab';
import HistoryTab from '../components/HistoryTab';
import DrinksTab from '../components/DrinksTab';
import SettingsTab from '../components/SettingsTab';
// Подлючаем кабель хука
import { useWaterData } from '../hooks/useWaterData';

type Tab = 'home' | 'history' | 'drinks' | 'settings';

export default function Dashboard() {
  // Это единственное состояние которое осталось в самом компоненте (переключение вкладок)
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // Достаем все из хука
  const {
    appData,
    currentWater,
    goalWater,
    handleUpdateProfile,
    handleAddDrink,
    handleSaveFavorite,
    handleDeleteLog,
    handleDeleteFavorite
  } = useWaterData();

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center font-sans">
        <div className="w-full max-w-md bg-slate-900 h-screen relative shadow-2xl overflow-hidden flex flex-col">
          
          {/* Шапка */}
          <header className="p-6 pb-2">
            <h1 className="text-2xl font-bold text-blue-400">WaterDash 💧</h1>
            <p className="text-sm text-slate-400">Stay hydrated, stay sharp</p>
          </header>

          {/* Главный экран (ТАБЫ) */}
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

          {/* НИЖНЯЯ НАВИГАЦИЯ */}
          <nav className="bg-slate-800 border-t border-slate-700 flex justify-around p-4 pb-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center transition-colors ${activeTab === 'history' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`} 
          >
            <span className="text-2xl mb-1">📜</span>
            <span className="text-xs font-medium">History</span>
          </button>

          <button
            onClick={() => setActiveTab('drinks')}
            className={`flex flex-col items-center transition-colors ${activeTab === 'drinks' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`} 
          >
            <span className="text-2xl mb-1">🍹</span>
            <span className="text-xs font-medium">Drinks</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center transition-colors ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-2xl mb-1">⚙️</span>
            <span className="text-xs font-medium">Settings</span>
          </button>
          </nav>
        </div>
      </div>
    );
}