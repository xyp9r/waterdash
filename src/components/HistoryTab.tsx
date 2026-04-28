import type { WaterLog } from '../App';

interface HistoryTabProps {
				logs: WaterLog[];
				onDeleteLog: (id: string) => void;
				// ВАЖНО: Теперь мы ждём не просто number, а массив логов WaterLog[]
				historyData?: Record<string, WaterLog[]>;
}

export default function HistoryTab({ logs, onDeleteLog, historyData = {} }: HistoryTabProps) {

	// Сортируем даты от новых к старым
	const sortedHistoryDates = Object.keys(historyData).sort((a, b) => {
		return new Date(b).getTime() - new Date(a).getTime();
	});

	// Вспомогательная функция: рисует красивую карточку напитка
	// Мы передаём в неё сам напиток (log) и флаг canDelete (можно ли его удалить)
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
							{/* Показываем кнопку удаления только для сегодняшних логов */}
							{canDelete && (
										<button
															onClick={() => onDeleteLog(log.id)}
															className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors active:scale-90"
															title="Delete log"
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
					
					{/* СЕКЦИЯ 1: СЕГОДНЯШНИЕ ЛОГИ */}
					{/* Если история есть - даем отступ mb-10. Если истории нет - растягиваем на всё свободное место (flex-1) */}
					<div className={`flex flex-col ${sortedHistoryDates.length > 0 ? 'mb-10' : 'flex-1 min-h-0'}`}>
						<h2 className="text-2xl font-bold text-white mb-6 shrink-0">Today's Logs</h2>

						{logs.length === 0 ? (
											<div className="flex flex-col items-center justify-center text-slate-500 gap-3 py-10">
														<span className="text-5xl opacity-50">🏜️</span>
														<p>No water logged yet today</p>
											</div>
									) : (		
											// Тут та же логика: есть история - жмем до 40vh. Нет истории - растягиваем на весь экран (flex-1)
											<div className={`overflow-y-auto pr-2 no-scrollbar ${sortedHistoryDates.length > 0 ? 'max-h-[40vh]' : 'flex-1 min-h-0'}`}>
													{[...logs].map((log) => renderLogCard(log, true))}
											</div>
							)}
					</div>

					{/* СЕКЦИЯ 2: АРХИВ ПРОШЛЫХ ДНЕЙ */}
					{sortedHistoryDates.length > 0 && (
								<div>
											<h2 className="text-2xl font-bold text-white mb-6">Past Days</h2>
											<div className="space-y-8 pr-2">
												
												{/* Перебираем все прошлые даты */}
												{sortedHistoryDates.map((date) => {
													// Считаем общую сумма выпитого за этот конкретный день
													const dayTotal = historyData[date].reduce((sum, l) => sum + l.amount, 0);

													return (
																<div key={date} className="flex flex-col">
																	
																	{/* Заголовок дня: Дата и общая сумма справа */}
																	<div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
																				<span className="text-slate-300 font-medium flex items-center gap-2">
																					<span>📅</span> {date}
																				</span>
																				<span className="text-blue-400 font-bold text-sm">
																					{dayTotal} ml Total
																				</span>
																	</div>

																	{/* Список всех напитков за этот день. canDelete = false */}
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