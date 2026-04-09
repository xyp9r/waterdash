import type { WaterLog } from '../App';

interface HistoryTabProps {
	logs: WaterLog[];
}

export default function HistoryTab({ logs }: HistoryTabProps) {
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
									<span className="text-slate-500 text-sm font-medium bg-slate-900 px-3 py-1 rounded-md">
										{log.timestamp}
									</span>
								</div>
						))}
				</div>
			)}
		</div>
	);
}