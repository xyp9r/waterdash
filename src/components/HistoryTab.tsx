import type { WaterLog } from '../App';

// Добавляю новую функцию в ожидаемые пропсы
interface HistoryTabProps {
	logs: WaterLog[];
	onDeleteLog: (id: string) => void;
	historyData?: Record<string, number>; // ? Означает что пропс может быть пустым
}

// Принимаем onDeletelog в скобках
export default function HistoryTab({ logs, onDeleteLog, historyData }: HistoryTabProps) {

	// Магия сортировки: берем все даты из архива и сортируем их от новых к старым
	const sortedHistoryDates = Object.keys(historyData).sort((a, b) => {
		return new Date(b).getTime() - new Date(a).getTime();
	});

	return (
		<div className="flex flex-col h-full pb-20">

			{/* СЕКЦИЯ 1: СЕГОДНЯШНИЕ ЛОГИ */}
			<div className="mb-10">
				
					<h2 className="text-2xl font-bold text-white mb-6">Today's Logs</h2>

					{logs.length === 0 ? (
							<div className="flex flex-col items-center justify-content text-slate-500 gap-3 py-10">
								<span className="text-5xl opacity-50">🏜️</span>
								<p>No water logged yet today</p>
							</div>
					) : (
							<div className="overflow-y-auto pr-2 space-y-3 no-scrollbar max-h-[40vh]">
								{[...logs].reverse().map((log) => (
									<div
											key={log.id}
											className="bg-slate-800 p-4 rounded-xl flex items-center justify-between shadow-sm border border-slate-700/50 hover:border-blue-500/30 transition-colors"
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
													<span className="texl-slate-500 text-sm font-medium bg-slate-900 px-3 py-1 rounded-md">
														{log.timestamp}
													</span>

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
										</div>
									</div>
								))}
							</div>		
					)}
			</div>

			{/* СЕКЦИЯ 2: АРХИВ (показываем только если есть записи) */}
			{sortedHistoryDates.length > 0 && (
				<div>
							<h2 className="text-2xl font-bold text-white mb-6">Past Days</h2>
							<div className="space-y-3 pr-2">
								{sortedHistoryDates.map((date) => (
											<div
													key={date}
													className="bg-slate-900/80 p-4 rounded-xl flex items-center justify-between border border-slate-800"
											>
													<div className="flex items-center gap-4">
																<div className="bg-slate-800 p-2 rounded-lg">
																	<span className="text-xl">📅</span>
																</div>
																<span className="text-slate-300 font-medium">{date} </span>
													</div>
													<div className="flex items-baseline gap-1">
														<span className="text-blue-400 font-bold text-lg">{historyData[date]}</span>
														<span className="text-state-500 text-sm">ml</span>
													</div>
											</div>
									))}
							</div>
				</div>
			)}
		</div>	
	);
}