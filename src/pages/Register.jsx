import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { setAccessToken } from '../utils/authHelper';

const Register = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		role: 'job-seeker',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const isStrongPassword = (password) => {
		return (
			password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (!isStrongPassword(form.password)) {
			setError(
				'Password must be at least 6 characters, include a capital letter and a number.'
			);
			return;
		}

		try {
			setLoading(true);
			await api.post('/auth/register', form);
			const res = await api.post('/auth/login', {
				email: form.email,
				password: form.password,
			});
			const accessToken = res.data.accessToken;
			setAccessToken(accessToken);
			navigate('/');
		} catch (err) {
			setError(err.response?.data?.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-4">
			<div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 sm:p-10">
				<h2 className="text-3xl sm:text-4xl font-extrabold text-center text-[#1d4ed8] mb-6">
					Create an Account
				</h2>
				{error && (
					<p className="text-center text-red-500 font-medium mb-4">{error}</p>
				)}
				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Full Name
						</label>
						<input
							name="name"
							id="name"
							type="text"
							placeholder="Your name"
							value={form.name}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
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
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label
							htmlFor="role"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Registering As
						</label>
						<select
							name="role"
							id="role"
							value={form.role}
							onChange={handleChange}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="job-seeker">Job Seeker</option>
							<option value="recruiter">Recruiter</option>
						</select>
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
						{loading ? 'Registering...' : 'Register'}
					</button>
				</form>

				<div className="text-sm text-center text-gray-600 mt-6">
					Already have an account?{' '}
					<span
						onClick={() => navigate('/login')}
						className="text-[#1d4ed8] hover:underline font-medium cursor-pointer"
					>
						Login here
					</span>
				</div>
			</div>
		</div>
	);
};

export default Register;
