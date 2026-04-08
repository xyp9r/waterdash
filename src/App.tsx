import { useState, useEffect } from 'react';
import HomeTab from './components/HomeTab';

// 1. строго описываем наши 4 главные вкладки
type Tab = 'home' | 'history' | 'drinks' | 'settings';

export interface WaterLog {
  id: string;
  amount: number;
  timestamp: string;
}

export default function App() {
  // 2. Cтейт для переключения вкладок (по умолчания открыт Home)
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // --- ПЕРЕЕЗД ПАМЯТИ СЮДА ---
  const [currentWater, setCurrentWater] = useState(() => {
    const saved = localStorage.getItem('waterDash_current');
    return saved ? Number(saved) : 0;
  });

  const goalWater = 2000; 

  useEffect(() => {
    localStorage.setItem('waterDash_current', currentWater.toString());
  }, [currentWater]);

  const handleAddWater = () => {
    setCurrentWater(prev => prev + 250);
  };

  return (
    // Главный фон на десктопе (очень темный синий)
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center font-sans">
      {/* Контейнер в виде экрана телефона */}
      <div className="w-full max-w-md bg-slate-900 h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {/* ШАПКА */}
        <header className="p-6 pb-2">
          <h1 className="text-2xl font-bold text-blue-400">WaterDash 💧</h1>
          <p className="text-sm text-slate-400">Stay hydrated, stay sharp</p>
        </header>

        {/* Главный экран (меняется в зависимости от вкладки) */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'home' && (
              <HomeTab 
                currentWater={currentWater}
                goalWater={goalWater}
                onAddWater={handleAddWater}
                />
            )}
          {activeTab === 'history' && (
              <div className="text-slate-400">
                <h2 className="text-xl text-white mb-4">Today's Logs</h2>
                [ Список выпитого за сегодня ]
              </div>
            )}
          {activeTab === 'drinks' && (
              <div className="text-slate-400">
                <h2 className="text-xl text-white mb-4">My Drinks</h2>
                [ Каталог напитков и кнопка добавления ]
              </div>
            )}
          {activeTab === 'settings' && (
              <div className="text-slate-400">
                <h2 className="text-xl text-white mb-4">Settings</h2>
                [ Переключатель тем и норма воды ]
              </div>
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