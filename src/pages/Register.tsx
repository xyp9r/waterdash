import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Красивые алерты импорт
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// функция сама sweetalert
const MySwal = withReactContent(Swal);

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
					
					// Прячем токен в надежный сейф браузера
					localStorage.setItem('waterDashToken', result.token);

					// Телепортация на расчет воды
					navigate('/onboarding');

				} else {
					MySwal.fire({
				        icon: "error",
				        title: "Registration error",
				        text: result.error || "Error with registration!",
				        confirmButtonColor: '#3b82f6' // покрасим кнопку в синий цвет Tailwind
				    });
				}

		}	catch (error) {
			console.error("Ошибка при регистрации:", error);
			MySwal.fire({
				        icon: "error",
				        title: "Network error",
				        text: "Unable to connect to the server. Please check your internet connection or try again later.",
				        confirmButtonColor: '#3b82f6' // покрасим кнопку в синий цвет Tailwind
				    });
		}
	};

	return (
			<div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
				<div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
					
					<h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">Register 💧</h2>

					<form onSubmit={handleRegister} className="space-y-4">
						{/* ПОЛЕ ИМЯ */}
						<div>
							<label className="block text-slate-400 text-sm mb-2">Your Name</label>
							<input 
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full bg-white border border-slate-100 shadow-sm text-slate-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-slate-400"
								placeholder="John"
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
								className="w-full bg-white border border-slate-100 shadow-sm text-slate-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-slate-400"
								placeholder="water@gmail.com"
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
								className="w-full bg-white border border-slate-100 shadow-sm text-slate-800 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-slate-400"
								placeholder="••••••••"
								required
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 transition-colors"
						>
							Create account
						</button>
					</form>

					<p className="mt-6 text-center text-slate-400 text-sm">
						Have an account?{' '}
						<Link to="/login" className="text-blue-400 hover:underline">
							Log In
						</Link>
					</p>

				</div>
			</div>
	);
}