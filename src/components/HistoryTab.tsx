import type { WaterLog } from '../App';

// Добавляю новую функцию в ожидаемые пропсы
interface HistoryTabProps {
	logs: WaterLog[];
	onDeleteLog: (id: string) => void;
}

// Принимаем onDeletelog в скобках
export default function HistoryTab({ logs, onDeleteLog }: HistoryTabProps) {
	return (
		<div className="flex flex-col h-full">
			<h2 className="text-2xl font-bold text-white mb-6">Today's Logs</h2>

			{/* Проверка - если список пустой, показываем красивую заглушку */}
			{logs.length === 0 ? (
				<div className="flex-1 flex flex col items-center justify-center text-slate-500 gap-3">
					<span className="text-5xl opacity-50">🏜️</span>
					<p>No water logged yet today</p>
				</div>
				) : (
				/* Если логи есть - рисуем их списком */
				<div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
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
									<span className="text-slate-500 text-sm font-medium bg-slate-900 px-3 py-1 rounded-md">
										{log.timestamp}
									</span>

									{/* Кнопка удаления! Передаем ID конкретного лога при клике */}
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
	);
}