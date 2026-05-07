import { useState, useEffect } from 'react';
import  { useNavigate } from 'react-router-dom';
import type { FavoriteDrink } from '../pages/Dashboard';

interface SettingsTabProps {
		currentGoal: number;
		profile: any;
		onUpdateProfile: (data: any) => Promise<void>;
		favoriteDrinks: FavoriteDrink[];
		onDeleteFavorite: (id: string) => void;
}

type ModalType = 'goal' | 'gender' | 'weight' | 'height' | 'activity' | 'weather' | null;

export default function SettingsTab({ currentGoal, profile, onUpdateProfile, favoriteDrinks, onDeleteFavorite }: SettingsTabProps) {
	const [activeModal, setActiveModal] = useState<ModalType>(null);
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem('waterDashToken');
		navigate('/login');
	};

	const [tempValue, setTempValue] = useState<string | number>('');

	useEffect(() => {
			if (!activeModal) return;
			if (activeModal === 'weight') setTempValue(profile.weight || '');
			if (activeModal === 'height') setTempValue(profile.height || '');
			if (activeModal === 'goal') setTempValue(currentGoal);
	}, [activeModal, profile, currentGoal]);

	if (!profile) return <div className="p-6 text-slate-500">Loading...</div>

	const handleSave = async (valueOverride?: any) => {
		let valueToSave = valueOverride !== undefined ? valueOverride : tempValue;
		if (activeModal === 'weight' || activeModal === 'height' || activeModal === 'goal') {
					valueToSave = Number(valueToSave);
		}
		const key = activeModal === 'goal' ? 'goal' : activeModal;
		await onUpdateProfile({ [key as string]: valueToSave });
		setActiveModal(null);
	};

	return (
		<div className="space-y-6 relavite h-full pb-20">
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

			{/* Список настроек */}
			<div className="bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-700/50 backdrop-blur-md">
				<SettingItem label="Gender" value={profile.gender === 'male' ? 'Male' : profile.gender === 'female' ? 'Female' : 'Set'} onClick={() => setActiveModal('gender')} />
				<SettingItem label="Weight" value={profile.weight ? `${profile.weight} kg` : 'Set'} onClick={() => setActiveModal('weight')} />
				<SettingItem label="Height" value={profile.height ? `${profile.height} cm` : 'Set'} onClick={() => setActiveModal('height')} />
				<SettingItem label="Daily Goal" value={`${currentGoal} ml`} onClick={() => setActiveModal('goal')} highlight />
			</div>

			{/* БЛОК - ИЗБРАННЫЕ НАПИТКИ */}
			{favoriteDrinks.length > 0 && (
					<div className="bg-slate-800/40 rounded-3xl p-5 border border-slate-700/50 backdrop-blur-md">
						<h3 className="text-slate-400 font-medium mb-4 px-2">Saved Presets</h3>
						<div className="grid grid-cols-2 gap-3">
							{favoriteDrinks.map(drink => (
									<div key={drink.id} className="bg-slate-900/50 rounded-2xl py-3 flex items-center justify-between border border-slate-700/50">
										<div className="flex items-center gap-3">
											<span className="text-2xl">{drink.icon}</span>
											<div className="flex flex-col">
												<span className="text-white font-bold text-sm">{drink.amount} ml</span>
												<span className="text-slate-500 text-sm">{drink.name}</span>
											</div>
										</div>
										<button
											onClick={() => onDeleteFavorite(drink.id)}
											className="text-slate-600 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
										</button>
									</div>
								))}
						</div>
					</div>
				)}

			{/* Кнопка выхода */}
			<button
				onClick={handleLogout}
				className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bld py-4 rounded-3xl transition-colors border border-red-500/20 mt-4"
			>
				Log Out
			</button>

			{/* Модальная шторка (без изменений) */}
			{activeModal && (
				<>
					<div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity" onClick={() => setActiveModal(null)} />
					<div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 rounded-t-[3rem] p-8 shadow-2xl z-50 border-t border-slate-800 animate-slide-up">
						<div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-8" />
						<h3 className="text-white text-2xl font-bold text-center mb-8 capitalize">Update {activeModal}</h3>
						{activeModal === 'gender' && (
								<div className="grid grid-cols-2 gap-4 mb-8">
									<button onClick={() => handleSave('male')} className={`py-4 rounded-2xl font-bold transition-all ${profile.gender === 'male' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400'}`}>Male</button>
									<button onClick={() => handleSave('female')} className={`py-4 rounded-2xl font-bold transition-all ${profile.gender === 'female' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-400'}`}>Female</button>
								</div>
							)}
						{(activeModal === 'weight' || activeModal === 'height' || activeModal === 'goal') && (
								<div className="space-y-6">
										<input type="number" autoFocus value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-full bg-slate-950 text-white text-4xl font-bold text-center py-6 rounded-3xl border-2 border-slate-800 focus:border-blue-500 outline-none transition-all" />
										<button onClick={() => handleSave()} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Save Changes</button>
								</div>
							)}
						<button onClick={() => setActiveModal(null)} className="w-full mt-4 text-slate-500 font-medium py-2">Cancel</button>
					</div>
				</>
				)}
		</div>
	);
}

function SettingItem({ label, value, onClick, highlight = false }: any) {
	return (
			<button onClick={onClick} className="flex justify-between items-center w-full p-5 hover:bg-slate-700/30 transition-colors border-b border-slate-700/30 last:border-0">
				<span className="text-slate-300 font-medium">{label}</span>
				<span className={`${highlight ? 'text-blue-400 font-bold' : 'text-slate-500 font-medium'}`}>
					{value} <span className="ml-1 opacity-30">{`➔`}</span>
				</span>
			</button>
		);
}