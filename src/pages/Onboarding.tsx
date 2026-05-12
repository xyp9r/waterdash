import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Красивые алерты импорт
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// функция сама sweetalert
const MySwal = withReactContent(Swal);

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
					MySwal.fire({
				        icon: "error",
				        title: "Authorization error",
				        text: "You are not logged in!",
				        confirmButtonColor: '#3b82f6' // покрасим кнопку в синий цвет Tailwind
				    });
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

					MySwal.fire({
				        icon: "error",
				        title: "Server error",
				        text: result.error || "Error creating profile",
				        confirmButtonColor: '#3b82f6' // покрасим кнопку в синий цвет Tailwind

				    });
				}

		} catch (error) {
						console.error("Ошибка при сохранении профиля:", error);

						MySwal.fire({
				        icon: "error",
				        title: "Server error",
				        text: "Error to connect server",
				        confirmButtonColor: '#3b82f6' // покрасим кнопку в синий цвет Tailwind
				    });
		}
	};

	return (
			<div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
				<div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
					
					<div className="text-center mb-8">
						<span className="text-6xl mb-4 block">💧</span>
						<span className="text-3xl font-bold text-slate-600 mb-2">Build Profile</span>
						<p className="text-slate-500">Let's see how much water you need</p>
					</div>

					<div className="space-y-6">
						{/* ПОЛ */}
						<div>
							<label className="block text-slate-400 text-sm font-medium mb-2">Gender</label>
							<div className="grid grid-cols-2 gap-2">
								<button onClick={() => setGender('male')} className={`py-4 rounded-2xl font-bold transition-all ${gender === 'male' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>Male</button>
								<button onClick={() => setGender('female')} className={`py-4 rounded-2xl font-bold transition-all ${gender === 'female' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>Female</button>
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
									className="w-full bg-white text-slate-600 font-bold px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-blue-400 outline-none transition-all"
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
									className="w-full bg-white text-slate-600 font-bold px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-blue-400 outline-none transition-all"
									placeholder="175"
								/>
							</div>
						</div>

						{/* АКТИВНОСТЬ */}
						<div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">Activity Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setActivity('low')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${activity === 'low' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>Low</button>
                            <button onClick={() => setActivity('medium')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${activity === 'medium' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>Medium</button>
                            <button onClick={() => setActivity('high')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${activity === 'high' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>High</button>
                        </div>
                    </div>

                    {/* ПОГОДА */}
                    <div>
                        <label className="block text-slate-400 text-sm font-medium mb-2">Weather</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setWeather('cold')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${weather === 'cold' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>Cold</button>
                            <button onClick={() => setWeather('temperate')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${weather === 'temperate' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>Temperate</button>
                            <button onClick={() => setWeather('hot')} className={`py-2 rounded-xl text-sm font-medium transition-colors ${weather === 'hot' ? 'bg-white text-slate-400 shadow-lg shadow-blue-500/30 border border-slate-400' : 'bg-blue-100 text-slate-400 border border-slate-300'}`}>Hot</button>
                        </div>
                    </div>

                    <button 
                        onClick={handleCalculate} 
                        disabled={!weight || !height || !gender} // Кнопка не нажмется, пока не заполнят базу!
                        className="w-full bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl font-bold mt-4 transition-all"
                    >
                        Save Profile
                    </button>
					</div>
				</div>
			</div>
	);
}