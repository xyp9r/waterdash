import { useState, useEffect } from 'react';
// ИЗМЕНИЛИ ПУТИ: добавили ../ так как мы теперь находимся внутри папки pages
import HomeTab from '../components/HomeTab';
import HistoryTab from '../components/HistoryTab';
import DrinksTab from '../components/DrinksTab';
import SettingsTab from '../components/SettingsTab';

type Tab = 'home' | 'history' | 'drinks' | 'settings';

export interface WaterLog {
  id: string;
  amount: number;
  timestamp: string;
  name: string;
  icon: string;
}

interface AppState {
  currentDate: string;
  todayLogs: WaterLog[];
  goalWater: number;
  isFirstLaunch: boolean;
  historyData: Record<string, WaterLog[]>;

  // Добавляем новую память для профиля
  profile: {
    name: string,
    email: string,
    gender: string | null;
    weight: number | null;
    height: number | null;
    activity: string | null;
    weather: string | null;
  } | null;
}

// ПЕРЕИМЕНОВАЛИ В Dashboard
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // ЭВОЛЮЦИЯ ПАМЯТИ
  const [appData, setAppData] = useState<AppState>(() => {
    const saved = localStorage.getItem('waterDash_data');
    const today = new Date().toISOString().split('T')[0]; // Получаем дату типа "2026-04-08"

    if (saved) {
      const parsed = JSON.parse(saved);

      // МАГИЯ АВТОСБРОСА И АРХИВАЦИИ
      if (parsed.currentDate !== today) {

        // 1. Считаем, сколько воды было выпито "вчера" (или в последний день захода)
        const yesterdayTotal = parsed.todayLogs ? parsed.todayLogs.reduce((sum: number, log: WaterLog) => sum + log.amount, 0) : 0;

        // 2. Достаем старых архив (если он есть) или создаем пустой
        const oldHistory = parsed.historyData || {};

        // Если "вчера" были хоть какие-то логи, берем ВЕСЬ массив и кладем в архив под старой датой
        if (parsed.todayLogs && parsed.todayLogs.length > 0 && parsed.currentDate) {
          oldHistory[parsed.currentDate] = parsed.todayLogs;
        }

        // 4. Начинаем новый день с чистым todayLogs, но сохраняем архив
        return {
          currentDate: today,
          todayLogs: [],
          goalWater: parsed.goalWater || 2000,
          isFirstLaunch: parsed.isFirstLaunch ?? false,
          historyData: oldHistory,
          profile: parsed.profile || null
        };
      }

      // Если день тот же самый, грузим всё как есть
      return {
        ...parsed,
        goalWater: parsed.goalWater || 2000,
        isFirstLaunch: parsed.isFirstLaunch ?? false,
        historyData: parsed.historyData || {},
        profile: parsed.profile || null
      };
  }

  // Если пользователь зашел в приложение в первый раз
  return { 
    currentDate: today, 
    todayLogs: [], 
    goalWater: 2000,
    isFirstLaunch: true, 
    historyData: {}, 
    profile: null
  };
});

  // Высчитываем воду на лету: просто складываем все выпитые стаканы за день
  const currentWater = appData.todayLogs.reduce((sum, log) => sum + log.amount, 0);
  // Теперь цель береться из памяти а не из хардкора!
  const goalWater = appData.goalWater;

  // Универсальная функция обновления профиля
  const handleUpdateProfile = async (newData: Partial<AppState['profile'] & { goal?: number }>) => {
    const token = localStorage.getItem('waterDashToken');
    if (!token) return;

    try {
            // Отправляем на сервер только то что изменилось
            const response = await fetch('http://localhost:3000/api/users/goal', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(newData)
            });

            const result = await response.json();

            if (result.success) {
              // Если все ок - обновляем состояние Дашборда
              setAppData(prev => ({
                ...prev,
                goalWater: result.user.dailyGoal,
                profile: result.user
              }));

              console.log("✅ Профиль синхронизирован с сервером");
            }

    } catch (error) {
        console.error("❌ Ошибка при обновлении профиля:", error);
    }
  };

// Загружаем ВСË из базы при старте
  useEffect(() => {
    // Достае бейджик из сейфа
    const token = localStorage.getItem('waterDashToken');
    if (!token) return;

    // A) Узнаем нашу цель воды у сервера
    fetch('http://localhost:3000/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
            setAppData(prev => ({ 
              ...prev,
               goalWater: data.user.dailyGoal,
               profile: data.user // Сохраняем ВЕСЬ профиль целяком
             }));
      }
    });

    // Б) Скачиваем наши личные стаканы
    fetch('http://localhost:3000/api/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((res) => res.json())
    .then((response) => {
      if (response.success) {
        const serverLogs = response.data.map((log: any) => ({
            id: log.id,
            amount: log.amount,
            name: log.name,
            icon: log.icon,
            timestamp: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setAppData(prev => ({ ...prev, todayLogs: serverLogs }));
      }
    })
    .catch((error) => console.error("❌ Ошибка загрузки логов:", error));
  }, []);

  // НАСТОЯЩЕЕ СОХРАНЕНИЕ НА СЕРВЕР (С ТОКЕНОМ)
  const handleAddDrink = async (amount: number, name: string, icon: string) => {
    const token = localStorage.getItem('waterDashToken');
    setActiveTab('home');

    try {
            const response = await fetch('http://localhost:3000/api/logs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ amount, name, icon })
            });

            const result = await response.json();

            if (result.success) {
              const newLogFromServer = result.data;
              const newFrontendLog: WaterLog = {
                id: newLogFromServer.id,
                amount: newLogFromServer.amount,
                name: newLogFromServer.name,
                icon: newLogFromServer.icon,
                timestamp: new Date(newLogFromServer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };

              setAppData(prev => ({
                ...prev,
                todayLogs: [newFrontendLog, ...prev.todayLogs]
              }));
            }

    } catch (error) {
        console.error("❌ Ошибка при сохранении:", error);
    }
  };

  // НАСТОЯЩЕЕ УДАЛЕНИЕ (С ТОКЕНОМ)
  const handleDeleteLog = async (idToRemove: string) => {
    const token = localStorage.getItem('waterDashToken');

    try {
            const response = await fetch(`http://localhost:3000/api/logs/${idToRemove}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();

            if (result.success) {
              setAppData(prev => ({
                ...prev,
                todayLogs: prev.todayLogs.filter(log => log.id !== idToRemove)
              }));
            }

    } catch (error) {
          console.error("❌ Ошибка при удалении:", error)
    }
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
                historyData={appData.historyData} // Подключил историю того что мы пили
                />
            )}
          {activeTab === 'drinks' && (
            // Прокидываем нашу новую функцию во вкладку напитков:
              <DrinksTab onAddDrink={handleAddDrink}/>
            )}
          {activeTab === 'settings' && (
              <SettingsTab 
                currentGoal={goalWater}
                profile={appData.profile} // Передаем профиль в настройки!
                onUpdateGoal={handleUpdateProfile}
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