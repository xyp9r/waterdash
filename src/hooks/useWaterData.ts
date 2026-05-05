import { useState, useEffect } from 'react';

// ==========================================
// 🏗️ ИНТЕРФЕЙСЫ (ЧЕРТЕЖИ ДАННЫХ)
// ==========================================

// Этот интерфейс объясняет TypeScript'у, из каких деталей состоит один выпитый стакан воды.
export interface WaterLog {
  id: string;        // Уникальный ID из базы данных (чтобы знать, что именно удалять)
  amount: number;    // Сколько миллилитров выпито
  timestamp: string; // Время в формате "14:30"
  name: string;      // Название напитка ("Вода", "Кофе" и т.д.)
  icon: string;      // Иконка (смайлик или класс иконки)
}

// Чертеж для избранных напитков (пресетов), которые юзер сохранил со звездочкой ⭐
export interface FavoriteDrink {
  id: string;
  amount: number;
  name: string;
  icon: string;
}

// Главный чертеж всей "памяти" нашего приложения. Здесь описано всё, что мы храним.
export interface AppState {
  currentDate: string; // Текущая дата (нужна, чтобы понимать, когда наступила полночь и нужно сбросить счетчик)
  todayLogs: WaterLog[]; // Массив стаканов, выпитых СЕГОДНЯ
  goalWater: number; // Дневная норма воды
  isFirstLaunch: boolean; // Флаг: первый ли это заход юзера (чтобы показывать онбординг)
  historyData: Record<string, WaterLog[]>; // Архив: Ключ - дата (напр. "2026-05-04"), Значение - массив стаканов за тот день
  favoriteDrinks: FavoriteDrink[]; // Список сохраненных пресетов
  profile: { // Данные профиля, нужные для расчета нормы воды
    name: string,
    email: string,
    gender: string | null;
    weight: number | null;
    height: number | null;
    activity: string | null;
    weather: string | null;
  } | null;
}


// ==========================================
// 🧠 ГЛАВНЫЙ ХУК - НАШ "МОЗГ"
// ==========================================

export const useWaterData = () => {
  
  // 💾 СОСТОЯНИЕ (ЛОКАЛЬНАЯ ПАМЯТЬ)
  // Мы используем коллбэк () => внутри useState. Это "ленивая инициализация".
  // Она гарантирует, что мы будем читать localStorage только ОДИН раз при старте, а не при каждом рендере.
  const [appData, setAppData] = useState<AppState>(() => {
    const saved = localStorage.getItem('waterDash_data'); // Пытаемся достать старые данные
    const today = new Date().toISOString().split('T')[0]; // Получаем сегодняшнюю дату в формате "YYYY-MM-DD"

    if (saved) {
      const parsed = JSON.parse(saved); // Распаковываем текст обратно в JavaScript-объект

      // 🌙 МАГИЯ АВТОСБРОСА: Если дата в памяти не совпадает с реальной датой (наступило завтра)
      if (parsed.currentDate !== today) {
        const oldHistory = parsed.historyData || {};

        // Если "вчера" мы что-то пили, берем эти стаканы и аккуратно складываем в архив (historyData)
        if (parsed.todayLogs && parsed.todayLogs.length > 0 && parsed.currentDate) {
          oldHistory[parsed.currentDate] = parsed.todayLogs;
        }

        // Начинаем новый день: обнуляем todayLogs, обновляем дату, но сохраняем архив, цель и пресеты
        return {
          currentDate: today,
          todayLogs: [], // 👈 Вот тут происходит сброс счетчика!
          goalWater: parsed.goalWater || 2000,
          isFirstLaunch: parsed.isFirstLaunch ?? false,
          historyData: oldHistory, // 👈 Передаем архив с сохраненным "вчера"
          profile: parsed.profile || null,
          favoriteDrinks: parsed.favoriteDrinks || []
        };
      }

      // Если день тот же самый (юзер просто обновил страницу), отдаем всё как было
      return {
        ...parsed,
        goalWater: parsed.goalWater || 2000,
        isFirstLaunch: parsed.isFirstLaunch ?? false,
        historyData: parsed.historyData || {},
        profile: parsed.profile || null,
        favoriteDrinks: parsed.favoriteDrinks || []
      };
    }

    // Самый первый запуск приложения: отдаем чистый шаблон
    return { 
      currentDate: today, 
      todayLogs: [], 
      goalWater: 2000,
      isFirstLaunch: true, 
      historyData: {}, 
      profile: null,
      favoriteDrinks: []
    };
  });

  // 📊 ВЫЧИСЛЯЕМЫЕ ДАННЫЕ (ДЕРЖИМ В УМЕ)
  // Метод reduce пробегается по массиву todayLogs и складывает поле amount каждого стакана в общую сумму
  const currentWater = appData.todayLogs.reduce((sum, log) => sum + log.amount, 0);
  const goalWater = appData.goalWater;


  // 🧮 УНИВЕРСАЛЬНЫЙ КАЛЬКУЛЯТОР НОРМЫ ВОДЫ
  // Просто функция, которая принимает параметры тела и возвращает цифру (норму)
  const calculateHydrationGoal = (weight: number, gender: string, height: number, activity: string, weather: string) => {
    	let base = gender === 'male' ? weight * 35 : weight * 31; // База от веса
    	if (height > 180) base += 300;     // Бонус высоким
    	if (activity === 'low') base += 300;
    	if (activity === 'medium') base += 600;
    	if (activity === 'high') base += 1000; // Бонус за спорт
    	if (weather === 'warm') base += 300;
    	if (weather === 'hot') base += 600; // Бонус за жару
    	return Math.round(base / 50) * 50 // Округляем до 50, чтобы не было кривых цифр
	};

	// Обновление профиля
	const handleUpdateProfile = async (newData: any) => {
		const token = localStorage.getItem('waterDashToken');
		if (!token) return; // Если нет ключа авторизации - ничего не делаем

		try {
			// Смешиваем текущий профиль с стеми данными, которые мы хотим изменить
			const updatedProfile = { ...appData.profile, ...newData };
			let finalData = { ...newData };

			// Если изменилось что-то, влияющее на формулы воды -> вызваем наш калькулятор
			if (newData.weight || newData.gender || newData.height || newData.activity || newData.weather) {
				const newGoal = calculateHydrationGoal(
						Number(updatedProfile.weight) || 70,
						updatedProfile.gender || 'male',
						Number(updatedProfile.height) || 175,
						updatedProfile.activity || 'low',
						updatedProfile.weather || 'temperate'
					);

				finalData.goal = newGoal; // Выкладывем новую цель в посылку для отправки
			}

			// Стучимся на сервер, чтобы он сохранил обновления в базу
			const response = await fetch('http://localhost:3000/api/users/goal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(finalData)
			});

			const result = await response.json();

			// Если сервер ответил успехом, обновляем локальную память (чтобы UI перерисовался)
			if (result.success) {
				setAppData(prev => ({
					...prev,
					goalWater: result.user.dailyGoal,
					profile: result.user
				}));
			}
		} catch (error) {
			console.error("❌ Ошибка обновления:", error);
		}
	};

	// ЗАГРУЗКА ДАННЫХ ПРИ ЗАПУСКЕ
	// useEffect с пустым массивом зависимостей [] означает - "Выполни этот код ровно ОДИН раз, когда хук просыпается"
	useEffect(() => {
		const token = localStorage.getItem('waterDashToken');
		if (!token) return;

		// 1. Узнаем наш профиль и цель у сервера
		fetch('http://localhost:3000/api/users/me', {
			headers: { 'Authorization': `Bearer ${token}` }
		})
		.then(res => res.json())
		.then(data => {
			if (data.success) {
				setAppData(prev => ({
					...prev,
					goalWater: data.user.dailyGoal,
					profile: data.user
				}));
			}
		});

		// 2. Скачиваем вообще всю историю выпитой воды
		fetch('http://localhost:3000/api/logs', {
			headers: { 'Authorization': `Bearer ${token}` }
		})
		.then((res) => res.json())
		.then((response) => {
			if (response.success) {
				const todayDate = new Date();
				const todayStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;

				const sortedTodayLogs: WaterLog[] = [];
				const sortedHistory: Record<string, WaterLog[]> = {};

				// Перебираем все стаканы пришедные с бэкенда
				response.data.forEach((log: any) => {
					const logDateObj = new Date(log.createdAt);
					const logDateStr = `${logDateObj.getFullYear()}-${String(logDateObj.getMonth() + 1).padStart(2, '0')}-${String(logDateObj.getDate()).padStart(2, '0')}`;

					const formattedLog: WaterLog = {
						id: log.id,
						amount: log.amount,
						name: log.name,
						icon: log.icon,
						timestamp: logDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
					};

					// Сортировка
					if (logDateStr === todayStr) {
						// Если выпито сегодня - кладем в стопку "Сегодня"
						sortedTodayLogs.push(formattedLog);
					} else {
						// Если в другой день - кладем на соответствующую полку в "Архив"
						if (!sortedHistory[logDateStr]) {
							sortedHistory[logDateStr] = [];
						}
						sortedHistory[logDateStr].push(formattedLog);
					}
				});

				// Записываем отсортированное в память
				setAppData(prev => ({
					...prev,
					todayLogs: sortedTodayLogs,
					historyData: sortedHistory
				}));
			}
		})
		.catch((error) => console.error("❌ Ошибка загрузки логов:", error));

		// Скачиваем пресеты
		fetch('http://localhost:3000/api/favorites', {
			headers: { 'Authorization': `Bearer ${token}` }
		})
		.then(res => res.json())
		.then(response => {
			if (response.success) {
				setAppData(prev => ({
					...prev,
					favoriteDrinks: response.data
				}));
			}
		})
		.catch(error => console.error("❌ Ошибка загрузки избранного:", error));
	}, []);

	// 💧 Добавление стакана
	const handleAddDrink = async (amount: number, name: string, icon: string) => {
		const token = localStorage.getItem('waterDashToken');
		try {
				const response = await fetch('http://localhost:3000/api/logs', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({ amount, name, icon }) // Переводим данные в строку JSON
				});

				const result = await response.json();

				if (result.success) {
					// Мы берем ответ сервера (в нем лежит настоящий ID из базы) и создаем объект стакана
					const newLogFromServer = result.data;
					const newFrontendLog: WaterLog = {
						id: newLogFromServer.id,
						amount: newLogFromServer.amount,
						name: newLogFromServer.name,
						icon: newLogFromServer.icon,
						timestamp: new Date(newLogFromServer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
					};

					// Вставляем новый стакан в САМОЕ НАЧАЛО массива
					setAppData(prev => ({
						...prev,
						todayLogs: [newFrontendLog, ...prev.todayLogs]
					}));
				}
		} catch (error) {
			console.error("❌ Ошибка при сохранении:", error);
		}
	};

	// ⭐ Сохранение пресета
	const handleSaveFavorite = async (amount: number, name: string, icon: string) => {
		const token = localStorage.getItem('waterDashToken');
		try {
			const response = await fetch('http://localhost:3000/api/favorites', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ amount, name, icon })
			});

			const result = await response.json();

			if (result.success) {
				// Сохраняем созданный пресет в конец массива
				setAppData(prev => ({
					...prev,
					favoriteDrinks: [...prev.favoriteDrinks, result.data]
				}));
			}
		} catch (error) {
			console.error("❌ Ошибка при сохранении пресета:", error);
		}
	};

	// 🗑️ Удаление стакана из истории
	const handleDeleteLog = async (idToRemove: string) => {
		const token = localStorage.getItem('waterDashToken');
		try {
				// Отправялем DELETE запрос с ID стакана прямо в адресе (URL)
				const response = await fetch(`http://localhost:3000/api/logs/${idToRemove}`, {
					method: 'DELETE',
					headers: { 'Authorization': `Bearer ${token}` }
				});

				const result = await response.json();

				if (result.success) {
					// Метод .filter оставляем в массив только те элементы, у которых ID не совпадает с удаленным
					setAppData(prev => ({
						...prev,
						todayLogs: prev.todayLogs.filter(log => log.id !== idToRemove)
					}));
				}
		} catch (error) {
			console.error("❌ Ошибка при удалении:", error);
		}
	};

	// 🗑️ Удаление пресета
	const handleDeleteFavorite = async (idToRemove: string) => {
		const token = localStorage.getItem('waterDashToken');
		try {
				const response = await fetch(`http://localhost:3000/api/favorites/${idToRemove}`, {
					method: 'DELETE',
					headers: { 'Authorization': `Bearer ${token}` }
				});

				const result = await response.json();

				if (result.success) {
					setAppData(prev => ({
						...prev,
						favoriteDrinks: prev.favoriteDrinks.filter(drink => drink.id !== idToRemove)
					}));
				}
		} catch (error) {
			console.error("❌ Ошибка при удалении пресета:", error);
		}
	};

	// ==========================================
  // 🔌 "HDMI КАБЕЛЬ" (ЭКСПОРТ ДАННЫХ)
  // ==========================================
  // Этот return отдает наружу функции и переменные. 
  // Любой компонент (например Dashboard.tsx) может вызвать этот хук и получить всё это добро.

	return {
		appData,
		currentWater,
		goalWater,
		handleUpdateProfile,
		handleAddDrink,
		handleSaveFavorite,
		handleDeleteLog,
		handleDeleteFavorite
	};
};