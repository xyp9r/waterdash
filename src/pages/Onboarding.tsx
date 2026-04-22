import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
	// Вся память профиля
	const [gender, setGender] = useState<'male' | 'female' | ''>('');
	const [weight, setWeight] = useState('');
	const [height, setHeight] = useState('');
	const [activity, setActivity] = useState<'low' | 'medium' | 'high'>('low');
	const [weather, setWeather] = useState<'cold' | 'temperate' | 'hot'>('temperate');

	const navigate = useNavigate();

	const handleCalculate = async () => {
		let weightNum = parseFloat(weight);
		let heightNum = parseFloat(height);

		// Защита от дурака
		if (isNaN(weightNum) || weightNum <= 0) return;
		if (isNaN(heightNum) || heightNum <= 0) heightNum = 170; // Средний рост
		if (weightNum > 300) weightNum = 300; // Максимальный вес человека если обурмалдел пользователь

		// Базовая формула воды на вес тела
		let goal = weightNum * 30;

		// Надбавки
		if (heightNum > 180) goal += 300;
		if (gender === 'male') goal += 300; // Мужчинам нужно больше воды

		if (activity === 'medium') goal += 400;
		if (activity === 'high') goal += 800;

		if (weather === 'hot') goal += 500; // В жару пьем больше
		if (weather === 'cold') goal -= 200; // В холодных регионах пьем меньше

		// Округляем и лимитируем
		goal = Math.round(goal);
		if (goal > 10000) goal = 10000;

		try {
				const token = localStorage.getItem('waterDashToken');

				if (!token) {
					alert("Ошибка: Вы не авторизованы!");
					navigate('/login');
					return;
				}

				// Отправляем ВСЕ данные на сервер
				const response = await fetch('http://localhost:3000/api/users/goal', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify({
								goal: goal,
								gender: gender,
								weight: weightNum,
								height: heightNum,
								activity: activity,
								weather: weather
					})
				});

				const result = await response.json();

				if (result.success) {
						console.log("✅ Профиль успешно сохранен в базу:", result.user);
						navigate('/dashboard');
				} else {
					alert("‼️ Ошибка сервера: " + result.error);
				}

		} catch (error) {
						console.error("Ошибка при сохранении профиля:", error);
						alert("Не удалось подключиться к серверу.");
		}
	};

	return (
			<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
				<div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
					
					<div className="text-center mb-8">
						<span className="text-6xl mb-4 block">💧</span>
						<span className="text-3xl font-bold text-white mb-2">Build Profile</span>
						<p className="text-slate-400">Pure logic. Design comes in Phase 4.</p>
					</div>

					<div className="space-y-6">
						{/* ПОЛ */}
						<div>
							<label className="block text-slate-400 text-sm font-medium mb-2">Gender</label>
							<div className="grid grid-cols-2 gap-2">
								<button onClick={() => setGender('male')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${gender === 'male' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Male</button>
								<button onClick={() => setGender('female')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${gender === 'female' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Female</button>
							</div>
						</div>

						{/* ВЕС И РОСТ */}
						<div className="flex gap-4">
							<div className="flex-1">
								<label 
									className="block text-slate-400 text-sm font-medium mb-2"
								>
									Weight (kg)
								</label>
								<input 
									type="number" 
									value={weight} 
									onChange={(e) => setWeight(e.target.value)}
									className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 outline-none"
									placeholder="70"
								/>
							</div>
							<div className="flex-1">
								<label
									className="block text-slate-400 text-sm font-medium mb-2"
								>
									Height (cm)
								</label>
								<input 
									type="number"
									value={height}
									onChange={(e) => setHeight(e.target.value)}
									className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 outline-none"
									placeholder="175"
								/>
							</div>
						</div>

						{/* АКТИВНОСТЬ */}
						<div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">Activity Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setActivity('low')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${activity === 'low' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Low</button>
                            <button onClick={() => setActivity('medium')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${activity === 'medium' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Medium</button>
                            <button onClick={() => setActivity('high')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${activity === 'high' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>High</button>
                        </div>
                    </div>

                    {/* ПОГОДА */}
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">Weather</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setWeather('cold')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${weather === 'cold' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Cold</button>
                            <button onClick={() => setWeather('temperate')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${weather === 'temperate' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Temperate</button>
                            <button onClick={() => setWeather('hot')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${weather === 'hot' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>Hot</button>
                        </div>
                    </div>

                    <button 
                        onClick={handleCalculate} 
                        disabled={!weight || !height || !gender} // Кнопка не нажмется, пока не заполнят базу!
                        className="w-full bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-bold mt-4 transition-all"
                    >
                        Save Profile
                    </button>
					</div>
				</div>
			</div>
	);
}