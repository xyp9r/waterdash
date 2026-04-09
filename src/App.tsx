import { useState, useEffect } from 'react';
import HomeTab from './components/HomeTab';
import HistoryTab from './components/HistoryTab';
import DrinksTab from './components/DrinksTab';
import SettingsTab from './components/SettingsTab';
import Onboarding from './components/Onboarding';

// 1. строго описываем наши 4 главные вкладки
type Tab = 'home' | 'history' | 'drinks' | 'settings';

export interface WaterLog {
  id: string;
  amount: number;
  timestamp: string;
  // ДОБАВИЛ НОВЫЕ СТРОЧКИ
  name: string;
  icon: string;
}

// Описываем структуру умной памяти
interface AppState {
  currentDate: string;
  todayLogs: WaterLog[];
  goalWater: number; // <--- Новая ячейка памяти для гола воды
  isFirstFaunch: boolean; // ДОБАВИЛ ФЛАГ ДЛЯ ПЕРВОГО ЗАПУСКА
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // ЭВОЛЮЦИЯ ПАМЯТИ
  const [appData, setAppData] = useState<AppState>(() => {
    const saved = localStorage.getItem('waterDash_data');
    const today = new Date().toISOString().split('T')[0]; // Получаем дату типа "2026-04-08"

    if (saved) {
      const parsed = JSON.parse(saved);
      // МАГИЯ АВТОСБРОСА - Если дата в памяти не совпадает с сегодняшней
      if (parsed.currentDate !== today) {
        // Если новый день - сбрасываем логи, но сохраняем цель
        return { currentDate: today, todayLogs: [], goalWater: parsed.goalWater || 2000, isFirstFaunch: parsed.isFirstFaunch ?? false };
      }
      return { ...parsed, goalWater: parsed.goalWater || 2000 }; // Если день тот же, загружаем наши логи, Если цели раньше не было - ставим 2000
    }

    // Если пользователь зашел в приложение в самый первый раз
    return { currentDate: today, todayLogs: [], goalWater: 2000, isFirstFaunch: true };
  });

  // Высчитываем воду на лету: просто складываем все выпитые стаканы за день
  const currentWater = appData.todayLogs.reduce((sum, log) => sum + log.amount, 0);
  // Теперь цель береться из памяти а не из хардкора!
  const goalWater = appData.goalWater;

  // Функция для обновления цели
  const handleUpdateGoal = (newGoal: number) => {
    setAppData(prev => ({ ...prev, goalWater: newGoal}));
    setActiveTab('home'); // сразу перекидываем на главную чтобы увидеть результат
  };

  const handleOnboardingComplete = (calculatedGoal: number) => {
    setAppData(prev => ({
      ...prev,
      goalWater: calculatedGoal,
      isFirstFaunch: false // Выключаем приветственный экран навсегда
    }));
  };

  // Шпион следит за объектом appData и сохраняет его как JSON
  useEffect(() => {
    localStorage.setItem('waterDash_data', JSON.stringify(appData));
  }, [appData]);

  // Теперь кнопка добавляем не просто цифру а подробную запись ( лог )
  const handleAddDrink = (amount: number, name: string, icon: string) => {
     // Магия UX: после добавления напитска сразу перекидываем юзера на главный экран
    setActiveTab('home');

    // Задержка в 100мс
    setTimeout(() => {
    const newLog: WaterLog = {
    id: Date.now().toString(), // Генерируем уникальный ID
    amount: 250,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Время типа "14:30"
    name: name,
    icon: icon
  };

  // Обновляем стейт: берем старые данные и дописываем новый лог
  setAppData(prev => ({
    ...prev,
    todayLogs: [...prev.todayLogs, newLog]
  }));
}, 100);
};

// Функция удаления лога по его уникальному ID
const handleDeleteLog = (idToRemove: string) => {
  setAppData(prev => ({
    ...prev,
    // filter оставляет только те логи, ID которых НЕ совпадает с тем что мы удаляем
    todayLogs: prev.todayLogs.filter(log => log.id !== idToRemove)
  }));
};

// Если первый запуск - показываем приветствие и ничо не рисуем
if (appData.isFirstFaunch) {
  return <Onboarding onComplete={handleOnboardingComplete} />;
}

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
        <main className="flex-1 overflow-y-auto px-6 pt-6 pb-2 no-scrollbar">
          {activeTab === 'home' && (
              <HomeTab 
                currentWater={currentWater}
                goalWater={goalWater}
                // Передаем дефолтную воду для главной кнопки:
                onAddWater={() => handleAddDrink(250, 'Water', '💧')}
                />
            )}
          {activeTab === 'history' && (
              <HistoryTab 
                logs={appData.todayLogs} 
                onDeleteLog={handleDeleteLog} // провод удаления
                />
            )}
          {activeTab === 'drinks' && (
            // Прокидываем нашу новую функцию во вкладку напитков:
              <DrinksTab onAddDrink={handleAddDrink}/>
            )}
          {activeTab === 'settings' && (
              <SettingsTab 
                currentGoal={goalWater}
                onUpdateGoal={handleUpdateGoal}
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