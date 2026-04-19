import { useState } from 'react';
// Нам понадобяться эти инструменты для переходов между страницами
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {

	// Память для того что юзер вводит в поля
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate(); // Штука, чтобы программно перекидывать юзера

	// Функция, которая сработает при нажатии на кнопку "Войти"
	const handleLogin = async (e: React.FromEvent) => {
		e.preventDefault(); // Останавливаем стандартную перезагрузку страницы браузером

		try {
				// Стучимся на наш сервер (как делали в консоли)
				const response = await fetch('http://localhost:3000/api/auth/login', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password })
				});

				const result = await response.json();

				// Если сервер сказал "Успешно"
				if (result.success) {
					console.log("✅ Успешный вход! Токен получен.");

					// Прячем токен в надежный сейф браузера (localStorage)
					localStorage.setItem('waterDashToken', result.token);

					// Магия Роутера: мгновенно телепортируем юзера в Дашборд!
					navigate('/dashboard');
				} else {
					// Если пароль неверный или юзера нет - выдаём ошибку сервера
					alert("❌ Ошибка: " + result.error);
				}

		} catch (error) {
			console.error("Ошибка при входе:", error);
			alert("Не удалось подключиться к серверу. Бэкенд запущен?");
		}
	};

	return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
				<div className="w-full max-w-md bg-stale-900 rounded-2xl shadow-2xl p-8 border border-slate-800">
					
					<h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">C возвращением! 💧</h2>

					<form onSubmit={handleLogin} className="space-y-4">
						{/* ПОЛЕ EMAIL */}
						<div>
							<label className="block text-slate-400 text-sm mb-2">Email</label>
							<input 
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full bg-slate-800 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
									placeholder="hacker@waterdash.com"
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
									className="w-full bg-slate-800 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-blie-500 transition-all"
									placeholder="••••••••"
									required
							/>
						</div>

						{/* КНОПКА */}
						<button
							tyle="submit"
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors"
						>
							Войти в матрицу
						</button>
					</form>

					{/* ССЫЛКА НА РЕГИСТРАЦИЮ */}
					<p className="mt-6 text-center text-slate-400 text-sm">
						Еще нет аккаунта?{' '}
						<Link to="/register" className="text-blue-400 hover:underline">
							Зарегестрироваться
						</Link>
					</p>

				</div>
			</div>
	);
}