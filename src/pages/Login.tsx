import { useState } from 'react';
// Нам понадобяться эти инструменты для переходов между страницами
import { useNavigate, Link } from 'react-router-dom';
// Красивые алерты импорт
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Login() {

	// Память для того что юзер вводит в поля
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate(); // Штука, чтобы программно перекидывать юзера

	// Функция, которая сработает при нажатии на кнопку "Войти"
	const handleLogin = async (e: React.FormEvent) => {
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
					console.log("✅ Successful logn! I have a token.");

					// Прячем токен в надежный сейф браузера (localStorage)
					localStorage.setItem('waterDashToken', result.token);

					// Магия Роутера: мгновенно телепортируем юзера в Дашборд!
					navigate('/dashboard');
				} else {
				    MySwal.fire({
				        icon: "error",
				        title: "Login error",
				        text: result.error || "Incorrect email address or password!",
				        confirmButtonColor: '#3b82f6' // покрасим кнопку в синий цвет Tailwind
				    });
				}

		} catch (error) {
			console.error("Login error:", error);
			MySwal.fire({
				        icon: "error",
				        title: "Network error",
				        text: "Unable to connect to the server. Please check your internet connection or try again later.",
				        confirmButtonColor: '#3b82f6' // покрасим кнопку в синий цвет Tailwind
				    });
		}
	};

	return (
			<div className="
				min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans
				dark:bg-slate-900 
				">
				<div className="
					w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100
					dark:bg-slate-800 dark:border dark:border-slate-700
					">
					
					<h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Welcome back! 💧</h2>

					<form onSubmit={handleLogin} className="space-y-4">
						{/* ПОЛЕ EMAIL */}
						<div>
							<label className="
								block text-slate-400 text-sm mb-2
								dark:text-slate-100
								">Email</label>
							<input 
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="
									w-full bg-white border border-slate-100 shadow-sm text-slate-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-slate-400
									dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-300 dark:focus:ring-slate-700
									"
									placeholder="water@gmail.com"
									required
							/>
						</div>

						{/* ПОЛЕ ПАРОЛЬ */}
						<div>
							<label className="
								block text-slate-400 text-sm mb-2
								dark:text-slate-100
								">Password</label>
							<input 
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="
									w-full text-slate-800 bg-white border border-slate-100 shadow-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-slate-400
									dark:bg-slate-900 dark:border dark:border-slate-700 dark:text-slate-300 dark:focus:ring-slate-700
									"
									placeholder="••••••••"
									required
							/>
						</div>

						{/* КНОПКА */}
						<button
							type="submit"
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors"
						>
							Log In
						</button>
					</form>

					{/* ССЫЛКА НА РЕГИСТРАЦИЮ */}
					<p className="mt-6 text-center text-slate-400 text-sm">
						Don't have an account?{' '}
						<Link to="/register" className="text-blue-400 hover:underline">
							Register
						</Link>
					</p>

				</div>
			</div>
	);
}