import { useState } from 'react';

// Описываем какие данные мы ждем от Дашборда
interface SettingsTabProps {
	currentGoal: number;
	onUpdateGoal: (newGoal: number) => void;
	profile: {
		name: string;
		email: string;
		gender: string | null;
		weight: number | null;
		height: number | null;
		activity: string | null;
		weather: string | null
	} | null;
}

// Тип для наших выезжающих шторок
type ModalType = 'goal' | 'gender' | 'weight' | 'height' | 'activity' | 'weather' | null;

export default function SettingsTab({ currentGoal, profile, onUpdateGoal }: SettingsTabProps) {
	// Состояние: какая шторка сейчас открыта? (null = никакая)
	const [activeModal, setActiveModal] = useState<ModalType>(null);

	// Если профиль ещё не подгрузился, показываем загрузку
	if (!profile) {
		return <div className="flex justify-center items-center h-full text-slate-500">Loading profile...</div>;
	}

	return (
		<div className="space-y-6 relative h-full">
			<h2 className="text-2xl font-bold text-white mb-6">Profile & Settings</h2>

			{/* БЛОК - ИНФОРМАЦИЯ ОБ АККАУНТЕ */}
			<div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
				<div className="flex items-center gap-4 mb-2">
					<div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xl font-bold">
						{profile.name.charAt(0).toUpperCase()}
					</div>
					<div>
						<h3 className="text-white font-medium">{profile.name}</h3>
						<p className="text-slate-400 text-sm">{profile.email}</p>
					</div>
				</div>
			</div>

			{/* БЛОК ФИЗИЧЕСКИЕ ПАРАМЕТРЫ */}
			<div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 flex flex-col">
				
				{/* Кнопка пол */}
				<button 
					onClick={() => setActiveModal('gender')} 
					className="flex justify-between items-center p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50"
				>
					<span className="text-slate-300">Gender</span>
					<span className="text-slate-400 font-medium"
						>
							{profile.gender === 'male' ? 'Male' : profile.gender === 'female' ? 'Female' : 'Not set' } 
						 {' ➔'}
					</span>
				</button>

				{/* Кнопка вес */}
				<button
					onClick={() => setActiveModal('weight')}
					className="flex justify-between items-center p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50"
				>
					<span className="text-slate-300">Weight</span>
					<span className="text-slate-400 font-medium"
						>
							{profile.weight ? `${profile.weight} kg` : 'Not set'}
						 {' ➔'}
					</span>
				</button>

				{/* Кнопка рост */}
				<button
					onClick={() => setActiveModal('height')}
					className="flex justify-between items-center p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50"
				>
					<span className="text-slate-300">Height</span>
					<span className="text-slate-400 font-medium"
						>
							{profile.height ? `${profile.height} cm` : 'Not set'}
						 {' ➔'}
					</span>
				</button>

				{/* Кнопка цель воды */}
				<button
					onClick={() => setActiveModal('goal')}
					className="flex justify-between items-center p-4 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50"
				>
					<span className="text-slate-300">Water Goal</span>
					<span className="text-slate-400 font-medium"
						>
							{currentGoal} ml
						 {' ➔'}
					</span>
				</button>

			</div>

			{/* МАГИЯ ШТОРКИ (Появляется только если activeModal не null) */}
			{activeModal && (
				<>
				{/* Темный фон (блюр), при клике на который шторка закроется */}
				<div
					className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
					onClick={() => setActiveModal(null)}
				/>

				{/* Сама выезжающая панель */}
				<div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 rounded-t-[2.5rem] p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 border-t border-slate-700 animate-slide-up">
					
					<div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" /> {/* Маленькая полоска как в айос */}

					<h3 className="text-white text-2xl font-bold text-center mb-6 capitalize">
						Update {activeModal}
					</h3>

					<div className="text-center text-slate-400 py-10">
						Тут скоро будет интерфейс для {activeModal}
					</div>

					<button
						onClick={() => setActiveModal(null)}
						className="w-full mt-4 bg-slate-800 text-slate-300 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
					>
						Cancel
					</button>
				</div>
			</>
			)}
		</div>
	);
}