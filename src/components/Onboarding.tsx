import { useState } from 'react';

interface OnboardingProps {
	onComplete: (calculatedGoal: number) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
	const [weight, setWeight] = useState('');
	const [activity, setActivity] = useState<'low' | 'medium' | 'high'>('low');

	const handleCalculate = () => {
		let weightNum = parseFloat(weight);

		// Если вес не ввели или ввели фигню - ничего не делаем
		if (isNaN(weightNum) || weightNum <= 0) return;

		// Защита от дурака
		if (weightNum > 300) {
			weightNum = 300;
		}

		// Базовая формула: 30мл на 1 кг века
		let goal = weightNum * 30;

		// Накидываем за активность
		if (activity === 'medium') goal += 400;
		if (activity === 'high') goal += 800;

		// Округляем и не даем уйти за 10л
		goal = Math.round(goal);
		if (goal > 10000) goal = 10000;

		// Отправляем готовую цифру в App.tsx
		onComplete(goal);
	};

	return (
				<div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
					<div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-800">
						
						<div className="text-center mb-8">
							<span className="text-6xl mb-4 block">💧</span>
							<span className="text-3xl font-bold text-white mb-2">Welcome to WaterDash</span>
							<p className="text-slate-400">Let's calculate your daily hydration goal!</p>
						</div>

						<div className="space-y-6">
							{/* Поле для веса */}
							<div>
								<label className="block text-slate-400 text-sm font-medium mb-2">
									Your Weight (kg)
								</label>
								<input 
 									type="number"
 									max="300"
 									maxLength={3}
 									value={weight}
 									onChange={(e) => setWeight(e.target.value)}
 									className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition-colors"
 									placeholder="e.g 70"
								/>
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
								disabled={!weight} // кнопка неактивна пока не введут вес
								className="w-full bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 rounded-xl font-bold hover:bg-blue-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:shadow-none mt-4"
							>
								Calculate Goal
							</button>
						</div>
					</div>
				</div>
		);
}