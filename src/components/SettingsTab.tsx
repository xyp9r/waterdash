import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SettingsTabProps {
	currentGoal: number;
	profile: any; // Мы уже знаем структуру из Дашборда
	onUpdateProfile: (data: any) => Promise<void>;
}

type ModalType = 'goal' | 'gender' | 'weight' | 'height' | 'activity' | 'weather' | null;

export default function SettingsTab({ currentGoal, profile, onUpdateProfile }: SettingsTabProps) {
	const [activeModal, setActiveModal] = useState<ModalType>(null);

	const navigate = useNavigate();

	const handleLogout = () => {

		// Удаляем токен из памяти
		localStorage.removeItem('waterDashToken');

		// Выкидываем на страницу логина
		navigate('/login');
	};

	// Временное состояние для ввода в шторке
	const [tempValue, setTempValue] = useState<string | number>('');

	// Когда открываем шторку, подтягиваем текущее значение из профиля
	useEffect(() => {
		if (!activeModal) return;
		if (activeModal === 'weight') setTempValue(profile.weight || '');
		if (activeModal === 'height') setTempValue(profile.height || '');
		if (activeModal === 'goal') setTempValue(currentGoal);
	}, [activeModal, profile, currentGoal]);

	if (!profile) return <div className="p-6 text-slate-500">Loading...</div>;

	const handleSave = async (valueOverride?: any) => {
		// 1. Исправили temoValue на tempValue
		let valueToSave = valueOverride !== undefined ? valueOverride : tempValue;

		// 2. Железобетонно превращаем текст из инпута в числа!
		if (activeModal === 'weight' || activeModal === 'height' || activeModal === 'goal') {
			valueToSave = Number(valueToSave);
		}

		// Формируем объект для отправки
		const key = activeModal === 'goal' ? 'goal' : activeModal;

		await onUpdateProfile({ [key as string]: valueToSave });

		setActiveModal(null); // Закрываем шторку
	};

	return (
		<div className="space-y-6 relative h-full">
			<h2 className="text-2xl font-bold text-white mb-6 px-2">Profile & Settings</h2>

			{/* Карточка юзера */}
			<div className="bg-slate-800/40 rounded-3xl p-5 border border-slate-700/50 backdrop-blur-md">
				<div className="flex items-center gap-4">
					<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
						{profile.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<h3 className="text-white text-lg font-bold">{profile.name}</h3>
					<p className="text-slate-400 text-sm">{profile.email}</p>
				</div>
			</div>
		</div>

		{/* СПИСОК НАСТРОЕК */}
		<div className="bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-700/50 backdrop-blur-md">
			<SettingItem label="Gender" value={profile.gender === 'male' ? 'Male' : profile.gender === 'female' ? 'Female' : 'Set'}
				onClick={() => setActiveModal('gender')} />
			<SettingItem label="Weight" value={profile.weight ? `${profile.weight} kg` : 'Set'} onClick={() => setActiveModal('weight')} />
			<SettingItem label="Height" value={profile.height ? `${profile.height} cm` : 'Set'} onClick={() => setActiveModal('height')} />
			<SettingItem label="Daily Goal" value={`${currentGoal} ml`} onClick={() => setActiveModal('goal')} highlight />
		</div>

		{/* КНОПКА ВЫХОДА */}
		<button
			onClick={handleLogout}
			className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-3xl transition-colors border border-red-500/20 mt-4"
		>
			Log Out
		</button>

		{/* МОДАЛЬНАЯ ШТОРКА */}
		{activeModal && (
				<>
					<div 
						className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
						onClick={() => setActiveModal(null)}
					/>
					<div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 rounded-t-[3rem] p-8 shadow-2xl z-50 border-t border-slate-800 animate-slide-up">
						<div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-8" />

						<h3 className="text-white text-2xl font-bold text-center mb-8 capitalize">Update {activeModal}</h3>

						{/* Интерфейс для пола */}
						{activeModal === 'gender' && (
								<div className="grid grid-cols-2 gap-4 mb-8">
									<button 
										onClick={() => handleSave('male')}
										className={`py-4 rounded-2xl font-bold transition-all
										${profile.gender === 'male' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400'}`}
									>
										Male
									</button>
									<button
										onClick={() => handleSave('female')}
										className={`py-4 rounded-2xl font-bold transition-all
										${profile.gender === 'female' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400'}`}
									>
										Female
									</button>
								</div>
							)}

						{/* ИНТЕРФЕЙС ДЛЯ ЧИСЕЛ (Вес, Рост, Цель) */}
						{(activeModal === 'weight' || activeModal === 'height' || activeModal === 'goal') && (
								<div className="space-y-6">
									<input 
										type="number"
										autoFocus
										value={tempValue}
										onChange={(e) => setTempValue(e.target.value)}
										className="w-full bg-slate-950 text-white text-4xl font-bold text-center py-6 rounded-3xl border-2 border-slate-800 focus:border-blue-500 outline-none transition-all"
									/>
									<button
										onClick={() => handleSave()}
										className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
									>
										Save Changes
									</button>
								</div>
							)}

						<button
							onClick={() => setActiveModal(null)}
							className="w-full mt-4 text-slate-500 font-medium py-2"
						>
							Cancel
						</button>
					</div>
				</>	
			)}
		</div>
	);
}

// Вспомогательный компонент для строк настроек
function SettingItem({ label, value, onClick, highlight = false }: any) {
	return (
		<button
			onClick={onClick}
			className="flex justify-between items-center w-full p-5 hover:bg-slate-700/30 transition-colors border-b border-slate-700/30 last:border-0">
				<span className="text-slate-300 font-medium">{label}</span>
				<span className={`${highlight ? 'text-blue-400 font-bold' : 'text-slate-500 font-medium'}`}>
					{value} <span className="ml-1 opacity-30">{`➔`}</span>
				</span>
			</button>
	);
}