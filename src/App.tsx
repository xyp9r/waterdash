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
  isFirstLaunch: boolean; // ДОБАВИЛ ФЛАГ ДЛЯ ПЕРВОГО ЗАПУСКА
  historyData: Record<string, WaterLog[]>; // Память для архива (дата - напиток - миллилитры)
}

export default function App() {
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
          historyData: oldHistory
        };
      }

      // Если день тот же самый, грузим всё как есть
      return {
        ...parsed,
        goalWater: parsed.goalWater || 2000,
        isFirstLaunch: parsed.isFirstLaunch ?? false,
        historyData: parsed.historyData || {}
      };
  }

  // Если пользователь зашел в приложение в первый раз
  return { currentDate: today, todayLogs: [], goalWater: 2000, isFirstLaunch: true, historyData: {} };
});

  // Загружаем данные из базы при старте
  useEffect(() => {
              // Стучимся на наш новый роут
              fetch('http://localhost:3000/api/logs')
              .then((res) => res.json())
              .then((response) => {
                if (response.success) {
                  console.log("📥 Данные из базы получены:", response.data);

                  // Сервер отдает время в формате ISO (createdAt)
                  // А нашему фронтенду нужен красивый timestamp ("14:30"). Переводим:
                  const serverLogs = response.data.map((log: any) => ({
                    id: log.id,
                    amount: log.amount,
                    name: log.name,
                    icon: log.icon,
                    timestamp: new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }));

                  // Обновляем состояние React: заменяем пустые логи на те, что пришли из базы!
                  setAppData(prev => ({ ...prev, todayLogs: serverLogs }));
                }
              })
              .catch((error) => {
                console.error("❌ Ошибка загрузки логов из базы:", error);
              });
  }, []);

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
      isFirstLaunch: false // Выключаем приветственный экран навсегда
    }));
  };

  // Шпион следит за объектом appData и сохраняет его как JSON
  useEffect(() => {
    localStorage.setItem('waterDash_data', JSON.stringify(appData));
  }, [appData]);

 // НАСТОЯЩЕЕ СОХРАНЕНИЕ НА СЕРВЕР
  const handleAddDrink = async (amount: number, name: string, icon: string) => {
    setActiveTab('home');

    try {
            // Отправляем данные на сервер ( наш POST-запрос )
            const response = await fetch('http://localhost:3000/api/logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount, name, icon })
            });

            const result = await response.json();

            // Если сервер ответил "Успешно сохранено"
            if (result.success) {
              const newLogFromServer = result.data;

              // Адаптируем данные сервера для нашего интерфейса
              const newFrontendLog: WaterLog = {
                id: newLogFromServer.id, // Берем настоящий длинный ID из базы!
                amount: newLogFromServer.amount,
                name: newLogFromServer.name,
                icon: newLogFromServer.icon,
                timestamp: new Date(newLogFromServer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };

              // Добавляем новый стакан в НАЧАЛО списка на экране
              setAppData(prev => ({
                ...prev,
                todayLogs: [newFrontendLog, ...prev.todayLogs]
              }));
            }
    } catch (error) {
      console.error("❌ Ошибка при сохранении напитка на сервер:", error);
    }
  };

  // НАСТОЯЩЕЕ УДАЛЕНИЕ С СЕРВЕРА
  const handleDeleteLog = async (idToRemove: string) => {
    try {
            // Отправляем приказ на сервер (Метод DELETE)
            // ID вклеивается прямо в конец ссылки!
            const response = await fetch(`http://localhost:3000/api/logs/${idToRemove}`, {
              method: 'DELETE',
            });

            const result = await response.json();

            // Если сервер сказал "успешно" - стираем стакан с экрана
            if (result.success) {
              setAppData(prev => ({
                ...prev,
                todayLogs: prev.todayLogs.filter(log => log.id !== idToRemove)
              }));
            }
    } catch (error) {
          console.error("❌ Ошибка при удалении напитка:", error);
    }
  };

// Если первый запуск - показываем приветствие и ничо не рисуем
if (appData.isFirstLaunch) {
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