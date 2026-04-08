// Описываем какие провода (пропсы) мы ждем от главного app.tsx
interface HomeTabProps {
	currentWater: number;
	goalWater: number;
	onAddWater: () => void;
}

export default function HomeTab({currentWater, goalWater, onAddWater}: HomeTabProps) {

	// Математика для круга
	const percentage = Math.min((currentWater / goalWater) * 100, 100);
	const radius = 120; // Радиус круга
	const circumference = 2 * Math.PI * radius; // Длина окружности
	const offset = circumference - (percentage / 100) * circumference; // Насколько круг заполнен

	return (
		<div className="flex flex-col items-center justify-center h-full pb-10">
			
			{/* Контейнер для круга */}
			<div className="relative flex items-center justify-center">
				
				{/* Сам круг (SVG рисунок) */}
				<svg className="transform -rotate-90 w-72 h-72">
					{/* Фоновый (пустой) круг */}
					<circle 
						cx="144" cy="144" r={radius}
						stroke="currentColor"
						strokeWidth="20"
						fill="transparent"
						className="text-slate-800"
					/>

					{/* Синий круг (заполненный) */}
					<circle 
						cx="144" cy="144" r={radius}
						stroke="currentColor"
						strokeWidth="20"
						fill="transparent"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						strokeLinecap="round"
						className="text-blue-500 transition-all duration-1000 ease-out"
					/>
				</svg>

				{/* Текст внутри круга */}
				<div className="absolute flex flex-col items-center">
					<span className="text-5xl font-bold text-white drop-shadow-lg">
						{currentWater}
					</span>
					<span className="text-lg text-slate-400 mt-1">
						/ {goalWater} ml
					</span>
				</div>

			</div>

			{/* кнопка быстрого добавления (ЗАГЛУШКА НА БУДУЩЕЕ) */}
			<button 
				onClick={onAddWater}
				className="mt-12 bg-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)]"
			>
				+ Add 250 ml
			</button>

		</div>
	);
}