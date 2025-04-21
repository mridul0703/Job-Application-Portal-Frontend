import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
	const { user, login } = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const res = await api.post('/auth/login', form);
			const { accessToken, refreshToken } = res.data;
			login(accessToken, refreshToken);
		} catch (err) {
			setError(err.response?.data?.message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) navigate('/');
	}, [user, navigate]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-4">
			<div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 sm:p-10">
				<h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#1d4ed8] mb-6">
					Login to JobPortal
				</h2>
				{error && (
					<p className="text-center text-red-500 font-medium mb-4">{error}</p>
				)}
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email
						</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="you@example.com"
							value={form.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							value={form.password}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						disabled={loading}
						className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-lg transition shadow-md ${loading
							? 'bg-blue-400 cursor-not-allowed'
							: 'bg-[#1d4ed8] hover:bg-[#1e40af]'
							}`}
					>
						{loading && (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						)}
						{loading ? 'Logging in...' : 'Login'}
					</button>
				</form>

				<div className="text-sm text-center text-gray-600 mt-6">
					Don't have an account?{' '}
					<span
						onClick={() => navigate('/register')}
						className="text-[#1d4ed8] hover:underline font-medium cursor-pointer"
					>
						Register here
					</span>
				</div>
			</div>
		</div>
	);
};

export default Login;
