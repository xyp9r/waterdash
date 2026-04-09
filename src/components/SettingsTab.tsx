import { useState } from 'react';

// Описываем, какие провода ждем сверху
interface SettingsTabProps {
	currentGoal: number;
	onUpdateGoal: (goal: number) => void;
}

export default function SettingsTab({ currentGoal, onUpdateGoal }: SettingsTabProps) {

	// Локальная память для поля ввода (изначально равна текущей цели)
	const [goalInput, setGoalInput] = useState(currentGoal.toString());

	const handleSave = () => {
		// Превращаем текст из инпута в нормальное число
		const newGoal = parseInt(goalInput, 10);

		// Защита от дурака, проверяем что ввели число и оно больше нуля
		if (!isNaN(newGoal) && newGoal > 0) {
			onUpdateGoal(newGoal);
		}
	};

	return (
				<div className="flex flex-col h-full">
					<h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

					{/* Карточка настройки цели */}
					<div className="bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-700/50">
						<label className="block text-slate-400 text-sm font-medium mb-3">
							Daily Water Goal (ml)
						</label>

						<div className="flex gap-3">
							<input 
								type="number"
								value={goalInput}
								onChange={(e) => setGoalInput(e.target.value)}
								className="flex-1 bg-slate-900 text-shite px-4 py-3 rounded-xl border border-slate-700 focus:border-blue-500 outline-none transition-colors"
								placeholder="e.g. 2000"
							/>
							<button
								onClick={handleSave} 
								className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
							>
								Save
							</button>
						</div>
						<p className="text-slate-500 text-xs mt-3">
							Adjust your daily hydration target. The progress ring will update automatically.
						</p>
					</div>
				</div>
	);
}