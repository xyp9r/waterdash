import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate();

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
				// Стучимся на роут регистрации нашего бэкенда
				const response = await fetch('http://localhost:3000/api/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name, email, password })
				});

				const result = await response.json();

				if (result.success) {
					console.log("✅ Регистрация успешна!")
					// После успешной регистрации логично отправить юзера залогиться
					// (пока оставляю алерт, чтобы потом его заменить)
					alert("Успешная регистрация! Теперь войдите в систему.")
					navigate('/login');
				} else {
					alert("❌ Ошибка: " + result.error);
				}

		}	catch (error) {
			console.error("Ошибка при регистрации:", error);
			alert("Не удалось подключиться к серверу.");
		}
	};

	return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
				<div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
					
					<h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Новый Хакер 💧</h2>

					<form onSubmit={handleRegister} className="space-y-4">
						{/* ПОЛЕ ИМЯ */}
						<div>
							<label className="block text-slate-400 text-sm mb-2">Ваше имя</label>
							<input 
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full bg-slate-800 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
								placeholder="Neo"
								required
							/>
						</div>

						{/* ПОЛЕ EMAIL */}
						<div>
							<label className="block text-slate-400 text-sm mb-2">Email</label>
							<input 
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full bg-slate-800 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
								placeholder="neo@matrix.com"
								required
							/>
						</div>

						{/* ПОЛЕ ПАРОЛЬ */}
						<div>
							<label className="block text-slate-400 text-sm mb-2">Пароль</label>
							<input 
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full bg-slate-800 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
								placeholder="••••••••"
								required
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors"
						>
							Создать аккаунт
						</button>
					</form>

					<p className="mt-6 text-center text-slate-400 text-sm">
						Уже в системе?{' '}
						<Link to="/login" className="text-blue-400 hover:underline">
							Войти
						</Link>
					</p>

				</div>
			</div>
	);
}