import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
	const [weight, setWeight] = useState('');
	const [height, setHeight] = useState('');
	const [activity, setActivity] = useState<'low' | 'medium' | 'high'>('low');

	const navigate = useNavigate();

	const handleCalculate = async () => {

		let weightNum = parseFloat(weight);
		let heightNum = parseFloat(height);

		// Защита от дурака
		if (isNaN(weightNum) || weightNum <= 0) return;
		if (isNaN(heightNum) || heightNum <= 0) heightNum = 170; // Дефолтный рост если ввели фигню

		if (weightNum > 300) weightNum = 300;

		// Базовая формула: 30мл на 1кг веса
		let goal = weightNum * 30;

		// Если человек выше 180, накидываем ещё воды
		if (heightNum > 180) {
			goal += 300;
		}

		// Накидываем за активность
		if (activity === 'medium') goal += 400;
		if (activity === 'high') goal += 800;

		// Округляем и лимитируем
		goal = Math.round(goal);
		if (goal > 10000) goal = 10000;

		console.log("Рассчитаная цель:", goal);

		try {
				// Достаем бейджик из сейфа браузера
				const token = localStorage.getItem('waterDashToken');

				if (!token) {
					alert("Ошибка: Вы не авторизованы! Пожалуйста войдите в систему заново.");
					navigate('/login');
					return;
				}

				// Отправляем цель на наш новый серверный роут
				const response = await fetch('http://localhost:3000/api/users/goal', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`, // Показываем бейджик охраннику
					},
					body: JSON.stringify({ goal: goal }) // Отправляем саму цифру
				});

				const result = await response.json();

				if (result.success) {
					console.log("✅ Сервер успешно сохранил цель:", result.user);
					navigate('/dashboard'); // Летим в дашборд!
				} else {
					alert("❌ Ошибка сервера: " + result.error);
				}

		} catch (error) {
			console.error("Ошибка при сохранении цели:", error);
			alert("Не удалось подключиться к серверу.");
		}
	};

	return (
			<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
				<div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
					
					<div className="text-center mb-8">
						<span className="text-6xp mb-4 block">💧</span>
						<span className="text-3xl font-bold text-white mb-2">Welcome to WaterDash</span>
						<p className="text-slate-400">Let's calculate your daily hydration goal!</p>
					</div>

					<div className="space-y-6">
						{/* БЛОК ПАРАМЕТРОВ (ВЕС И РОСТ РЯДОМ) */}
						<div className="flex gap-4">
							{/* ПОЛЕ ДЛЯ ВЕСА */}
							<div className="flex-1">
								<label className="block text-slate-400 text-sm font-medium mb-2">
									Weight (kg)
								</label>
								<input 
									type="number"
									value={weight}
									onChange={(e) => setWeight(e.target.value)}
									className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition-colors"
									placeholder="e.g 70"
								/>
							</div>

							{/* ПОЛЕ ДЛЯ РОСТА */}
							<div className="flex-1">
								<label className="block text-slate-400 text-sm font-medium mb-2">
									Height (cm)
								</label>
								<input 
									type="number"
									value={height}
									onChange={(e) => setHeight(e.target.value)}
									className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition-colors"
									placeholder="e.g 175"
								/>
							</div>
						</div>

						{/* Выбор активности */}
						<div>
							<label className="block text-slate-400 text-sm font-medium mb-2">
								Activity Level
							</label>
							<div className="grid grid-cols-3 gap-2">
								<button
									onClick={() => setActivity('low')}
									className={`py-2 rounded-xl text-sm font-medium transition-colors ${
										activity === 'low' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
									}`}
								>
									Low
								</button>
								<button
									onClick={() => setActivity('medium')}
									className={`py-2 rounded-xl text-sm font-medium transition-colors ${
										activity === 'medium' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
									}`}
								>
									Medium
								</button>
								<button
									onClick={() => setActivity('high')}
									className={`py-2 rounded-xl text-sm font-medium transition-colors ${
										activity === 'high' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
									}`}
								>
									High
								</button>
							</div>
						</div>

						<button
							onClick={handleCalculate}
							disabled={!weight || !height}
							className="w-full bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:shadow-none mt-4" 
						>
							Calculate Goal
						</button>
					</div>
				</div>
			</div>
	);
}