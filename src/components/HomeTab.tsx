// Обновляем пропсы - теперь мы требуем передавать количество, название и иконку
interface HomeTabProps {
		currentWater: number;
		goalWater: number;
		onAddWater: (amount: number, name: string, icon: string) => void;
}

export default function HomeTab({ currentWater, goalWater, onAddWater }: HomeTabProps) {

	const percentage = Math.min((currentWater / goalWater) * 100, 100);
	const radius = 120;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<div className="flex flex-col items-center justify-center h-full pb-10">
			
			{/* Контейнер для круга */}
			<div className="relative flex items-center justify-center">
				<svg className="transform -rotate-90 w-72 h-72">
					<circle 
						cx="144" cy="144" r={radius}
						stroke="currentColor" strokeWidth="20" fill="transparent"
						className="text-slate-800"
					/>
					<circle 
						cx="144" cy="144" r={radius}
						stroke="currentColor" strokeWidth="20" fill="transparent"
						strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
						className="text-blue-500 transition-all duration-1000 ease-out"
					/>
				</svg>

				<div className="absolute flex flex-col items-center">
					<span className="text-5xl font-bold text-white drop-shadow-lg">
						{currentWater}
					</span>
					<span className="text-lg text-slate-400 mt-1">
						/ {goalWater} ml
					</span>
				</div>
			</div>

			{/* НОВЫЙ БЛОК: QUICK ADD */}
			<div className="mt-12 w-full max-w-xs space-y-4">
                <h3 className="text-slate-400 text-sm font-medium text-center uppercase tracking-widest mb-4">Quick Add</h3>
                
                {/* Кнопка Вода */}
                <button 
                    onClick={() => onAddWater(250, 'Water', '💧')}
                    className="w-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 border border-blue-500/30"
                >
                    <span className="flex items-center gap-3"><span className="text-2xl">💧</span> Water</span>
                    <span>250 ml</span>
                </button>

                {/* Кнопка Кофе */}
                <button 
                    onClick={() => onAddWater(150, 'Coffee', '☕')}
                    className="w-full bg-amber-700/10 text-amber-500 hover:bg-amber-700/20 flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 border border-amber-700/30"
                >
                    <span className="flex items-center gap-3"><span className="text-2xl">☕</span> Coffee</span>
                    <span>150 ml</span>
                </button>
            </div>

		</div>
	);
}