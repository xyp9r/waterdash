import { useState } from 'react';

// Обновляем пропсы
interface HomeTabProps {
	currentWater: number;
	goalWater: number;
	onAddWater: (amount: number, name: string, icon: string) => void;
}

export default function HomeTab({ currentWater, goalWater, onAddWater }: HomeTabProps) {
	// НОВАЯ ПАМЯТЬ: Для шторки и цифр
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [amountStr, setAmountStr] = useState('');

	const percentage = Math.min((currentWater / goalWater) * 100, 100);
	const radius = 120;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	// ЛОГИКА НУМПАДА (как в DrinksTab)
	const handleNumpad = (val: string) => {
		if (amountStr.length >= 4) return;
		if (val === '00' && amountStr === '') return;
		if (val === '0' && amountStr === '') return;
		setAmountStr(prev => prev + val);
	};

	const handleDelete = () => setAmountStr(prev => prev.slice(0, -1));

	const handleSubmit = () => {
		const finalAmount = parseInt(amountStr, 10);
		if (!isNaN(finalAmount) && finalAmount > 0) {
			// Быстрое добавление с главной - это всегда вода
			onAddWater(finalAmount, 'Water', '💧');
			setIsModalOpen(false);
			setAmountStr('');
		}
	};

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

            {/* БЛОК: QUICK ADD */}
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

                {/* НОВАЯ КНОПКА: КАСТОМНЫЙ ОБЪЕМ */}
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 border border-slate-700/50"
                >
                    <span>➕ Custom Amount</span>
                </button>
            </div>

            {/* ВЫЕЗЖАЮЩАЯ ШТОРКА С НУМПАДОМ */}
            {isModalOpen && (
                <>
                    {/* Затемнение фона */}
                    <div 
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => {
                            setIsModalOpen(false);
                            setAmountStr('');
                        }}
                    />

                    {/* Сама шторка */}
                    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-blue-600 rounded-t-[2.5rem] p-6 shadow-[0_-15px_40px_rgba(59,130,246,0.3)] z-50 flex flex-col animate-slide-up">
                        
                        {/* Шапка шторки */}
                        <div className="relative w-full flex justify-center mb-6 pt-2">
                            <div className="text-center">
                                <span className="text-4xl block mb-2">💧</span>
                                <h3 className="text-white font-bold text-2xl">Custom Water</h3>
                            </div>

                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setAmountStr('');
                                }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-blue-700/50 p-2 rounded-full active:scale-90 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>                            
                            </button>
                        </div>

                        {/* Экран для ввода цифр */}
                        <div className="w-full flex justify-center items-center min-h-[60px] mb-6">
                            <div className="relative flex items-center">
                                <span className="text-white font-bold text-6xl tracking-tight">
                                    {amountStr || '0'}
                                </span>

                                <div className="absolute left-full ml-3 flex items-center gap-3">
                                    <span className="text-blue-200 text-sm uppercase font-bold tracking-wider mt-2">ml</span>
                                    {amountStr && (
                                        <button onClick={handleDelete} className="text-blue-200 hover:text-white active:scale-90 transition-colors mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Сетка кнопок клавиатуры */}
                        <div className="grid grid-cols-3 gap-2">
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
                            <button
                                onClick={handleSubmit}
                                disabled={!amountStr}
                                className="bg-white text-blue-600 disabled:bg-white/50 disabled:text-blue-600/50 flex items-center justify-center h-14 rounded-2xl transition-all active:scale-95 shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}