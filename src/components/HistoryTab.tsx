import { useMemo } from 'react';
import type { WaterLog } from '../App';
// Импортируем компоненты для графика
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HistoryTabProps {
	logs: WaterLog[];
	onDeleteLog: (id: string) => void;
	historyData?: Record<string, WaterLog[]>;
}

export default function HistoryTab({ logs, onDeleteLog, historyData = {} }: HistoryTabProps) {

	// Сначало даты от новый к старым для архива
	const sortedHistoryDates = Object.keys(historyData).sort((a,b) => {
		return new Date(b).getTime() - new Date(a).getTime();
	});

	// Магия графика - собираем данные за последние 7 дней
	const chartData = useMemo(() => {
		const data = [];
		const today = new Date();

		// Отматываем цикл на 7 дней
		for (let i = 6; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(d.getDate() - i);

			// Собираем дату в форме YYYY-MM-DD для поиска истории
			const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

			// Получаем короткое название для недели
			const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });

			let dayTotal = 0;

			// Если это сегодняшний день (i === 0) - берем сумму из текущих логов
			if (i === 0) {
								dayTotal = logs.reduce((sum, log) => sum + log.amount, 0);
			} else {
						// Если прошлый день - ищем в архиве
						if (historyData[dateStr]) {
						dayTotal = historyData[dateStr].reduce((sum, log) => sum + log.amount, 0);
			}
		}

		// Готовим столбик в массив
		data.push({
				day: shortDay,
				amount: dayTotal
			});
		}
		return data;
	}, [logs, historyData]); // Пересчитываем только если логи обновились

	// Вспомогательная функция - рисует красивую карточку напитка
	const renderLogCard = (log: WaterLog, canDelete: boolean) => (
			<div
					key={log.id}
					className="bg-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm border border-slate-700/50 hover:border-blue-500/30 transition-colors mb-3"
				>
					<div className="flex items-center gap-4">
						<div className="bg-blue-700/50 p-2 rounded-lg">
							<span className="text-xl">{log.icon}</span>
						</div>
						<div className="flex flex-col">
							<span className="text-white font-bold">{log.amount} ml</span>
							<span className="text-slate-400 text-xs">{log.name}</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-slate-500 text-sm font-medium bg-slate-900 px-3 py-1 rounded-md">
							{log.timestamp}
						</span>
						{canDelete && (
								<button
										onClick={() => onDeleteLog(log.id)}
										className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors active:scale-90"
										title="Delete Log"
									>
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
												<path d="M3 6h18"></path>
												<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
												<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
											</svg>
									</button>
							)}
					</div>
				</div>
		);

	return (
			<div className="flex flex-col h-full">

				{/* Секция 1.5 - наш новый график */}
				<div className="mb-10 bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50">
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Last 7 Days</h3>
					<div className="h-48 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={chartData}>
								{/* Ось Х с днями недели */}
								<XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />

								{/* Красивый всплывающий тултип при наведении */}
								<Tooltip 
									cursor={{ fill: '#334155', opacity: 0.3 }}
									contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
									itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
									formatter={(value: number) => [`${value} ml`, 'Drank']}
								/>

								{/* Сами столбики */}
								<Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={24}>
									{/* Окрашиваем сегодняшний день в яркий синий (последний столбик) */}
									{chartData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : '#1e3a8a'} />
										))}	
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
				
				{/* Секция 1 - сегодняшие логи */}
				<div className="flex flex-col mb-10">
					<h2 className="text-2xl font-bold text-white mb-6 shrink-0">Today's Logs</h2>

					{logs.length === 0 ? (
							<div className="flex flex-col items-center justify-center text-slate-500 gap-3 py-6">
								<span className="text-5xl opacity-50">🏜️</span>
								<p>No water logged yet today</p>
							</div>
						) : (
								<div className="overflow-y-auto pr-2 no-scrollbar max-h-[35vh]">
									{[...logs].map((log) => renderLogCard(log, true))}
								</div>
						)}
				</div>


				{/* Секция 2 - Архив прошлых дней */}
				{sortedHistoryDates.length > 0 && (
						<div>
							<h2 className="text-2xl font-bold text-white mb-6">Past Days</h2>
							<div className="space-y-8 pr-2">
								{sortedHistoryDates.map((date) => {
									const dayTotal = historyData[date].reduce((sum, l) => sum + l.amount, 0);

									return (
											<div key={date} className="flex flex-col">
												<div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
													<span className="text-slate-300 font-medium flex items-center gap-2">
														<span>📅</span> {date}
													</span>
													<span className="text-blue-400 font-bold text-sm">
														{dayTotal} ml Total
													</span>
												</div>
												<div className="flex flex-col">
													{[...historyData[date]].map(log => renderLogCard(log, false))}
												</div>
											</div>
										);
								})}
							</div>
						</div>
					)}
			</div>
		);
}