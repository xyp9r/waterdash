import { useMemo, useState } from 'react';
import type { WaterLog } from '../hooks/useWaterData';
// Импортируем нужные детали конструктора для графика из библиотеки recharts
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HistoryTabProps {
	logs: WaterLog[]; // Сегодняшие выпитые стаканы
	onDeleteLog: (id: string) => void; // Функция удаления стакана
	historyData?: Record<string, WaterLog[]>; // Архив прошлых дней
}

export default function HistoryTab({ logs, onDeleteLog, historyData = {} }: HistoryTabProps) {
	// Память компонента хранит текущий режим графика, по умолчанию неделя
	const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

	// Берем все даты из архива historyData и сортируем их от новых к старым
	// Для этого переводим дату в миллисекунды (getTime) и вычитаем одно из другого
	const sortedHistoryDates = Object.keys(historyData).sort((a, b) => {
		return new Date(b).getTime() - new Date(a).getTime();
	});

	// useMemo запоминает результат вычислений, он пересчитает этот массив только
	// измениться logs, historyData или timeframe. Это будет экономить ресурсы телефона
	const chartData = useMemo(() => {
		const data = [];
		const today = new Date();

		// Смотрим в стейт - сколько дней нам нужно отмотать назад?
		const daysCount = timeframe === 'week' ? 7 : 30;

		// Цикл идем задом наперед - от (daysCount - 1) до 0
		// Если это неделя, то i будет: 6, 5, 4, 3, 2, 1, 0 (где 0 - это сегодня)
		for (let i = daysCount - 1; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(d.getDate() - i); // Отматываем дату на i дней назад

			// Превращаем отмотанную дату в строку формата "YYYY-MM-DD", чтобы искать её в архиве
			// padStart(2, '0') делает так, чтобы месяц "4" стал "04".
			const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

			// Форматирование подписи под столбиком
			// Если режим 'week' , пишем короткий день недели (пн, ср, пт)
			// Если режим 'month' , пишем чисто месяца (1, 15, 29).
			// toString() превращает число в текст
			const label = timeframe === 'week'
				? d.toLocaleDateString('en-US', { weekday: 'short' })
				: d.getDate().toString();

			let dayTotal = 0; // Переменная для суммы воды за конкретный день
			
			if (i === 0) {
				// Если i === 0 , это значит сегодня, ищем сумму в массиве logs (сегодняшние стаканы)
				// reduce берет каждый стакан и прибавляет его к amount к общей сумме (sum)
				dayTotal = logs.reduce((sum, log) => sum + log.amount, 0);
			} else {
				// Если это не сегодня, ищем дату в архиве historyData
				if (historyData[dateStr]) {
					dayTotal = historyData[dateStr].reduce((sum, log) => sum + log.amount, 0);
				}
			}

			// Кладем готовый столбик (день + сумма) в наш массив данных для графика
			data.push({
						day: label,
						amount: dayTotal
			});
		}
		return data; // Отдаем готовый массив в Recharts
	}, [logs, historyData, timeframe]); // Массив зависимостей useMemo

	// Вспомогательная функция для верстки -
	// чтобы не писать один и тот же html код дважды (для сегодня и для архива)
	// я вынес отрисовку карточки стакана в отдельную функцию
	const renderLogCard = (log: WaterLog, canDelete: boolean) => (
			<div
					key={log.id}
					className="p-4 rounded-xl flex items-center justify-between bg-white border border-slate-100 shadow-sm hover:border-blue-500/30 transition-colors mb-3
					dark:bg-slate-800/30 dark:border-slate-900
					">
					<div className="flex items-center gap-4">
						<div className="bg-slate-100 p-2 rounded-lg dark:bg-slate-800/50">
							<span className="text-xl">{log.icon}</span>
						</div>
						<div className="flex flex-col">
							<span className="text-slate-500 font-bold dark:text-slate-300">{log.amount} ml</span>
							<span className="text-slate-400 text-xs">{log.name}</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-md dark:bg-slate-900/60">
							{log.timestamp}
						</span>
						{/* Кнопка удаления показывается только если canDelete === true */}
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

	// Главный рендер (верстка компонента)
	return (
			<div className="flex flex-col h-full">

			<div className="mb-10 bg-slate-300/40 p-5 rounded-3xl border border-slate-300/50 dark:bg-slate-700/10 dark:border-slate-900">
				
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analytics</h3>

					{/* Переключатель месяц/неделя */}
					<div className="flex bg-slate-400/80 p-1 rounded-lg border border-slate-200 dark:bg-slate-800/30 dark:border-slate-700">
						{/* При клике меняем стейт на 'week' useMemo это заметит и пересчитает график на 7 дней */}
						<button
							onClick={() => setTimeframe('week')}
							className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${timeframe === 'week' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-200 hover:text-slate-300'}`}
						>
							W
						</button>
						{/* Теперь все тоже самое но для 30 дней (месяц) */}
						<button
							onClick={() => setTimeframe('month')}
							className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${timeframe === 'month' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
						>
							M
						</button>
					</div>
				</div>

				{/* Контейнер графика */}
				<div className="h-48 w-full pb-2">
					{/* ResponsiveContainer делает так чтобы график сам подстраивался под ширину телефона */}
					<ResponsiveContainer width="99%" height="99%">
						<BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
							
							{/* Ось X (подписи дней) */}
							<XAxis 
								dataKey="day" // Берем текст из свойства day нашего массива
								stroke="#64748b"
								fontSize={11}
								tickLine={false}
								axisLine={false}
								dy={10}
								// Магия интервала -
								// Если смотрим месяц то показываем каждую 6 пропись
								// Если смотрим неделю, interval={0} означает показывать все подписи
								interval={timeframe === 'month' ? 6 : 0}
							/>

							{/* Всплывающая подсказка при наведении/нажатии */}
							<Tooltip 
								cursor={{ fill: '#334155', opacity: 0.3 }}
								contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }}
								itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
								formatter={(value: number) => [`${value} ml`, 'Drank']}
							/>

							{/* Сами столбики */}
							<Bar
								dataKey="amount" // Высота столбика зависит от количества выпитой воды
								radius={[4, 4, 4, 4]} // Закругляем углы столбиков
								// Магия ширины: если месяц - столбики тонкие, а если неделя то толстые (6px, 24px)
								barSize={timeframe === 'week' ? 24 : 6}
							>
								{/* Проходимся по каждому столбику и красим его
								Последний столбик (сегодняший день) красим в яркий синий, остальные в тусклый */}
								{chartData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : '#1e3a8a'} />
									))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* СЕГОДНЯШИЕ ЛОГИ */}
			<div className="flex flex-col">
				<h2 className="text-2xl font-bold text-slate-600 mb-6 shrink-0 dark:text-slate-100">Today's Logs</h2>

				{logs.length === 0 ? (
						<div className="flex flex-col items-center justify-center text-slate-500 gap-3 py-6">
							<span className="text-5xl opacity-50">🏜️</span>
							<p className="dark:text-slate-500">No water logget yet today</p>
						</div>
					) : (
						<div className="overflow-y-auto pr-2 no-scrollbar mb-3">
							{/* Рендерим сегодняшие логи, true - означает что кнопку удаления показывать нужно */}
							{[...logs].map((log) => renderLogCard(log, true))}
						</div>
					)}
			</div>

			{/* АРХИВ ПРОШЛЫХ ДНЕЙ */}
			{/* Показываем этот блок если в архиве есть хотя бы один день */}
			{sortedHistoryDates.length > 0 && (
					<div>
						<h2 className="text-2xl font-bold text-slate-500 mb-6 dark:text-slate-300">Past Days</h2>
						<div className="space-y-8 pr-2">
							
							{/* Проходимся по каждой дате из архива */}
							{sortedHistoryDates.map((date) => {
								// Считаем общую сумму выпитого за этот конкретный день
								const dayTotal = historyData[date].reduce((sum, l) => sum + l.amount, 0);

								return (
										<div key={date} className="flex flex-col">
											{/* Заголовок дня (дата + общая сумма) */}
											<div className="flex items-center justify-between mb-4 border-b border-slate-400 pb-2">
												<svg className="text-slate-600 dark:text-slate-400" width="23px" height="23px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M3 9H21M7 3V5M17 3V5M7 13H17V17H7V13ZM6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
												<span className="text-slate-600 font-medium flex justify-start gap-2 pr-44 dark:text-slate-400">
													{date}
												</span>
												<span className="text-blue-400 font-bold text-sm">
													{dayTotal} ml Total
												</span>
											</div>
											{/* Список выпитых стаканов за этот день 
											false означает что кнопку удаления показывать не нужно (архив нельзя удалить) */}
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