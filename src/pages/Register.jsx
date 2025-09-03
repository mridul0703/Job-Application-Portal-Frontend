import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		role: 'job-seeker',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const isStrongPassword = (password) => {
		return (
			password.length >= 6 && /[A-Z]/.test(password) && /\d/.test(password)
		);
	};

	const getPasswordStrength = (password) => {
		let strength = 0;
		if (password.length >= 6) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/\d/.test(password)) strength++;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
		return strength;
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
			const res = await api.post('/auth/register', form);
			const accessToken = res.data?.accessToken;
			if (accessToken) {
				login(accessToken);
				navigate('/');
				return;
			}

			// Fallback: if backend didn't return accessToken for some reason
			setError('Registration succeeded but no access token returned. Please log in.');
			navigate('/login');
		} catch (err) {
			setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	const passwordStrength = getPasswordStrength(form.password);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<Link to="/" className="inline-flex items-center mb-8">
						<div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
							<span className="text-white font-bold text-xl">J</span>
						</div>
						<span className="ml-3 text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
							JobPortal
						</span>
					</Link>
					<h2 className="text-4xl font-bold text-gray-900 mb-2">
						Create your account
					</h2>
					<p className="text-gray-600">
						Join thousands of professionals finding their dream jobs
					</p>
				</div>

				{/* Form */}
				<div className="card p-8">
					{error && (
						<div className="message-error mb-6">
							{error}
						</div>
					)}
					
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="name" className="form-label">
								Full Name
							</label>
							<div className="relative">
								<input
									name="name"
									id="name"
									type="text"
									placeholder="Enter your full name"
									value={form.name}
									onChange={handleChange}
									required
									className="input-field pl-10"
								/>
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="form-label">
								Email address
							</label>
							<div className="relative">
								<input
									type="email"
									name="email"
									id="email"
									placeholder="Enter your email"
									value={form.email}
									onChange={handleChange}
									required
									className="input-field pl-10"
								/>
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
									</svg>
								</div>
							</div>
						</div>

						<div>
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? 'text' : 'password'}
									name="password"
									id="password"
									placeholder="Create a strong password"
									value={form.password}
									onChange={handleChange}
									required
									className="input-field pl-10 pr-10"
								/>
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
										</svg>
									) : (
										<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
										</svg>
									)}
								</button>
							</div>
							
							{/* Password Strength Indicator */}
							{form.password && (
								<div className="mt-2">
									<div className="flex space-x-1">
										{[1, 2, 3, 4].map((level) => (
											<div
												key={level}
												className={`h-1 flex-1 rounded ${
													level <= passwordStrength
														? passwordStrength <= 2
															? 'bg-red-500'
															: passwordStrength === 3
															? 'bg-yellow-500'
															: 'bg-green-500'
														: 'bg-gray-200'
												}`}
											/>
										))}
									</div>
									<p className="text-xs text-gray-500 mt-1">
										{passwordStrength <= 2 && 'Weak password'}
										{passwordStrength === 3 && 'Good password'}
										{passwordStrength === 4 && 'Strong password'}
									</p>
								</div>
							)}
						</div>

						<div>
							<label htmlFor="role" className="form-label">
								I am a
							</label>
							<div className="grid grid-cols-2 gap-3">
								<label className={`relative flex cursor-pointer rounded-lg p-4 border-2 ${
									form.role === 'job-seeker' 
										? 'border-blue-500 bg-blue-50' 
										: 'border-gray-200 bg-white hover:border-gray-300'
								} transition-all`}>
									<input
										type="radio"
										name="role"
										value="job-seeker"
										checked={form.role === 'job-seeker'}
										onChange={handleChange}
										className="sr-only"
									/>
									<div className="flex items-center">
										<div className="text-2xl mr-3">👤</div>
										<div>
											<div className="font-medium text-gray-900">Job Seeker</div>
											<div className="text-sm text-gray-500">Looking for opportunities</div>
										</div>
									</div>
								</label>

								<label className={`relative flex cursor-pointer rounded-lg p-4 border-2 ${
									form.role === 'recruiter' 
										? 'border-blue-500 bg-blue-50' 
										: 'border-gray-200 bg-white hover:border-gray-300'
								} transition-all`}>
									<input
										type="radio"
										name="role"
										value="recruiter"
										checked={form.role === 'recruiter'}
										onChange={handleChange}
										className="sr-only"
									/>
									<div className="flex items-center">
										<div className="text-2xl mr-3">🏢</div>
										<div>
											<div className="font-medium text-gray-900">Recruiter</div>
											<div className="text-sm text-gray-500">Hiring talent</div>
										</div>
									</div>
								</label>
							</div>
						</div>

						<div className="flex items-center">
							<input
								id="terms"
								name="terms"
								type="checkbox"
								required
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
							/>
							<label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
								I agree to the{' '}
								<a href="#" className="text-blue-600 hover:text-blue-500">
									Terms of Service
								</a>{' '}
								and{' '}
								<a href="#" className="text-blue-600 hover:text-blue-500">
									Privacy Policy
								</a>
							</label>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
						>
							{loading ? (
								<div className="flex items-center justify-center">
									<div className="loading-spinner mr-2"></div>
									Creating account...
								</div>
							) : (
								'Create account'
							)}
						</button>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">Or continue with</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
								<svg className="w-5 h-5" viewBox="0 0 24 24">
									<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
									<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
									<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
									<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
								</svg>
								<span className="ml-2">Google</span>
							</button>

							<button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
								</svg>
								<span className="ml-2">Twitter</span>
							</button>
						</div>
					</div>

					<div className="text-center mt-6">
						<p className="text-gray-600">
							Already have an account?{' '}
							<Link
								to="/login"
								className="font-medium text-blue-600 hover:text-blue-500"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
