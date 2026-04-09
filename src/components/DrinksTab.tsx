const DRINK_TYPES = [
	{ id: 'water', name: 'Water', icon: '💧', color: 'bg-blue-500/20 text-blue-500', defaultAmount: 250 },
	{ id: 'coffee', name: 'Coffee', icon: '☕', color: 'bg-amber-700/20 text-amber-500', defaultAmount: 200 },
  	{ id: 'tea', name: 'Tea', icon: '🍵', color: 'bg-green-500/20 text-green-500', defaultAmount: 300 },
  	{ id: 'juice', name: 'Juice', icon: '🧃', color: 'bg-orange-500/20 text-orange-500', defaultAmount: 250 },
  	{ id: 'soda', name: 'Soda', icon: '🥤', color: 'bg-red-500/20 text-red-500', defaultAmount: 330 },
  	{ id: 'energy', name: 'Energy', icon: '⚡', color: 'bg-yellow-400/20 text-yellow-400', defaultAmount: 500 },
];

// Описываю провода , которые ждем от App.tsx
interface DrinksTabProps {
	onAddDrink: (amount: number, name: string, icon: string) => void;
}

// Принимаем запрос в пропсах
export default function DrinksTab({ onAddDrink }: DrinksTabProps) {
	return (
		<div className="flex flex-col h-full">
			<h2 className="text-2xl font-bold text-white mb-6">Choose a Drink</h2>
		
		{/* Магия сетки (grid) - выстраиваем карточки в 2 колонки */}
			<div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 pb-6 no-scrollbar">
				
				{/* пробегаемся по нашему списку и для каждого напитка рисуем кнопку */}
				{DRINK_TYPES.map((drink) => (
					<button
						key={drink.id}
						// Вешаем клик
						onClick={() => onAddDrink(drink.defaultAmount, drink.name, drink.icon)}
						className="bg-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-slate-700/50 hover:border-slate-500 transition-all active:scale-95"
					>
							{/* Круглый фон для иконки с уникальным цветом */}
						<div className={`text-4xl p-4 rounded-full ${drink.color}`}>
							{drink.icon}
						</div>

						{/* Название и миллилитры */}
						<div className="flex flex-col items-center">
							<span className="text-white font-bold">{drink.name}</span>
							<span className="text-slate-400 text-xs">{drink.defaultAmount} ml</span>
						</div>
						</button>
				))}
			</div>
		</div>
	);
}