import { useState } from 'react';

// Импортируем чертеж для фаворитных напитков
import type { FavoriteDrink } from '../pages/Dashboard';

interface DrinksTabProps {
	onAddDrink: (amount: number, name: string, icon: string) => void;
	favoriteDrinks: FavoriteDrink[];
	onSaveFavorite: (amount: number, name: string, icon: string) => void;
}

const DRINK_TYPES = [
  { id: 'water', name: 'Water', icon: '💧', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'tea', name: 'Tea', icon: '🍵', color: 'bg-green-500/20 text-green-400' },
  { id: 'coffee', name: 'Coffee', icon: '☕', color: 'bg-amber-700/20 text-amber-500' },
  { id: 'soda', name: 'Soda', icon: '🥤', color: 'bg-red-500/20 text-red-400' },
  { id: 'juice', name: 'Juice', icon: '🧃', color: 'bg-orange-500/20 text-orange-400' },
  { id: 'milk', name: 'Milk', icon: '🥛', color: 'bg-slate-200/20 text-slate-200' },
];

export default function DrinksTab({ onAddDrink, favoriteDrinks, onSaveFavorite }: DrinksTabProps) {
	const [selectedDrink, setSelectedDrink] = useState<{name: string, icon: string} | null>(null);
	const [amountStr, setAmountStr] = useState('');

	const handleNumpad = (val: string) => {
		if (amountStr.length >= 4) return;
		if (val === '00' && amountStr === '') return;
		if (val === '0' && amountStr === '') return;
		setAmountStr(prev => prev + val);
	};

	const handleDelete = () => {
		setAmountStr(prev => prev.slice(0, -1));
	};

	const handleSubmit = () => {
		const finalAmount = parseInt(amountStr, 10);
		if (!isNaN(finalAmount) && finalAmount > 0 && selectedDrink) {
			onAddDrink(finalAmount, selectedDrink.name, selectedDrink.icon);
			setSelectedDrink(null);
			setAmountStr('');
		}
	};

	const handleSaveAsFavorite = () => {
		const finalAmount = parseInt(amountStr, 10);
		if (!isNaN(finalAmount) && finalAmount > 0 && selectedDrink) {
					onSaveFavorite(finalAmount, selectedDrink.name, selectedDrink.icon);
					setSelectedDrink(null); // Закрываем шторку после сохранения
					setAmountStr('');
		}
	};

	return (
		// УБРАЛИ класс 'relative' отсюда, чтобы блюр мог растянуться на весь телефон
		<div className="flex flex-col h-full">
			<h2 className="text-2xl font-bold text-white mb-6">Choose a Drink</h2>

			<div className="flex flex-col gap-3 overflow-y-auto pb-24 no-scrollbar">
				{DRINK_TYPES.map((drink) => (
					<button
						key={drink.id}
						onClick={() => {
							setSelectedDrink({ name: drink.name, icon: drink.icon });
							setAmountStr('');
						}}
						className="bg-slate-800 p-5 rounded-2xl flex items-center gap-5 shadow-sm border border-slate-700/50 hover:border-slate-500 transition-all active:scale-95"
					>

						<div className={`text-3xl p-3 rounded-full ${drink.color}`}>
							{drink.icon}
						</div>
						<span className="text-white font-bold text-xl">{drink.name}</span>
					</button>
				))}
			</div>

			{/* ШТОРКА С НУМПАДОМ */}
			{selectedDrink && (
				<>
					{/* Исправленный Бэкдроп: теперь он прилипает к самому телефону */}
					<div 
						className="absolute top-0 left-0 right-0 bottom-0 bg-slate-950/70 backdrop-blur-sm z-40"
						onClick={() => setSelectedDrink(null)}
					/>

					{/* Сама шторка */}
					<div className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-[2.5rem] p-6 shadow-[0_-15px_40px_rgba(59,130,246,0.5)] z-50 flex flex-col">
						
						{/* 🎯 ПРАВИЛЬНАЯ ШАПКА: relative обертка на всю ширину */}
						<div className="relative w-full flex justify-center mb-6 pt-2">
							
							{/* Центральный блок с иконкой и текстом */}
							<div className="text-center">
								<span className="text-4xl block mb-2">{selectedDrink.icon}</span>
								<h3 className="text-white font-bold text-2xl">{selectedDrink.name}</h3>
							</div>

							{/* Крестик: абсолют ОТНОСИТЕЛЬНО этой шапки. */}
							{/* top-1/2 и -translate-y-1/2 ставят его ИДЕАЛЬНО по вертикальному центру этого блока! */}
							<button
								onClick={() => setSelectedDrink(null)}
								className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-blue-600/50 p-2 rounded-full active:scale-90 transition-colors"
							>
									{/* ИДЕАЛЬНО РОВНЫЙ КРЕСТИК */}
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<line x1="18" y1="6" x2="6" y2="18"></line>
										<line x1="6" y1="6" x2="18" y2="18"></line>
									</svg>							
								</button>

						</div>

						{/* Экран для ввода цифр */}
						<div className="w-full flex justify-center items-center min-h-[60px] mb-6">
							
							{/* Обертка, которая держит ТОЛЬКО цифры. Flexbox центрирует только её! */}
							<div className="relative flex items-center">
								
								{/* Сама цифра всегда железно по центру */}
								<span className="text-white font-bold text-6xl tracking-tight">
									{amountStr || '0'}
								</span>

								{/* "Прицеп" с ML и кнопкой удаления */}
								{/* absolute left-full выкидывает этот блок за правый край цифры */}
								{/* ml-3 дает отступ от самой цифры */}
								<div className="absolute left-full ml-3 flex items-center gap-3">
									
									<span className="text-blue-200 text-sm uppercase font-bold tracking-wider mt-2">ml</span>
									
									{/* Кнопка удаления появляется только если есть цифры */}
									{amountStr && (
										<button onClick={handleDelete} className="text-blue-200 hover:text-white active:scale-90 transition-colors mt-1">
											<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
										</button>
									)}
								</div>

							</div>
						</div>

						{/* ГЛАВНАЯ СЕТКА НА 4 КОЛОНКИ */}
						<div className="grid grid-cols-4 gap-2">
							
							{/* Левая колонка со звездочкой (занимает 1 из 4) */}
							<div className="col-span-1 flex flex-col gap-2">
								<button
									onClick={handleSaveAsFavorite}
									disabled={!amountStr}
									className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 disabled:opacity-30 flex-1 rounded-2xl flex flex-col items-center justify-center transition-colors border border-amber-500/20"
								>
									<span className="text-2xl mb-1">⭐️</span>
									<span className="text-[10px] font-bold uppercase tracking-wider">Save</span>
								</button>
							</div>

							{/* Основной нумпад (занимает 3 из 4 колонок) */}
							<div className="col-span-3 grid grid-cols-3 gap-2">
								{['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
									<button
										key={num}
										onClick={() => handleNumpad(num)}
										className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-2xl h-14 rounded-2xl transition-colors"
									>
										{num}
									</button>
								))}

								<button
									onClick={() => handleNumpad('00')}
									className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-xl h-14 rounded-2xl transition-colors"
								>
									00
								</button>

								<button
									onClick={() => handleNumpad('0')}
									className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-2xl h-14 rounded-2xl transition-colors"
								>
									0
								</button>

								{/* Кнопка отправить */}
								<button
									onClick={handleSubmit}
									disabled={!amountStr}
									className="bg-white text-blue-500 disabled:bg-white/50 disabled:text-blue-500/50 flex items-center justify-center h-14 rounded-2xl transition-all active:scale-95 shadow-lg"
								>
									<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
								</button>
							</div>
						</div>
				</div>
				</>
			)}
		</div>
	);
}