import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const { user, logout } = useAuth();
	const [loading, setLoading] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const navigate = useNavigate();

	const handleLogout = () => {
		setLoading(true);
		logout();
		navigate("/");
		setLoading(false);
		setMenuOpen(false);
	};

	const getDashboardRoute = () => {
		if (!user) return "/";
		switch (user.role) {
			case "admin":
				return "/admin/dashboard";
			case "recruiter":
				return "/recruiter/dashboard";
			case "job-seeker":
				return "/user/dashboard";
			default:
				return "/";
		}
	};

	const getProfileRoute = () => {
		if (!user || user.role === "admin") return null;
		return "/profile";
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<nav className="bg-white shadow-xl border-b border-gray-100 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex-shrink-0 flex items-center group">
							<div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
								<span className="text-white font-bold text-lg">J</span>
							</div>
							<span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
								JobPortal
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						<Link
							to="/jobs"
							className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
						>
							Jobs
						</Link>

						{user ? (
							<>
								<Link
									to={getDashboardRoute()}
									className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
								>
									Dashboard
								</Link>

								{getProfileRoute() && (
									<Link
										to={getProfileRoute()}
										className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
									>
										Profile
									</Link>
								)}

								<div className="flex items-center space-x-2">
									<div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
										<span className="text-blue-600 font-semibold text-sm">
											{user.name?.charAt(0).toUpperCase()}
										</span>
									</div>
									<span className="text-gray-700 font-medium text-sm">
										{user.name}
									</span>
								</div>
								<button
									onClick={handleLogout}
									className="btn-primary text-sm"
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-50"
								>
									Login
								</Link>
								<Link
									to="/register"
									className="btn-primary text-sm"
								>
									Get Started
								</Link>
							</>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2"
						>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								{menuOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{menuOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
							<Link
								to="/jobs"
								className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
								onClick={() => setMenuOpen(false)}
							>
								Jobs
							</Link>

							{user ? (
								<>
									<div className="px-3 py-2 border-b border-gray-100 mb-2">
										<div className="flex items-center space-x-3">
											<div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
												<span className="text-blue-600 font-semibold">
													{user.name?.charAt(0).toUpperCase()}
												</span>
											</div>
											<div>
												<p className="text-gray-900 font-medium">{user.name}</p>
												<p className="text-gray-500 text-sm capitalize">{user.role}</p>
											</div>
										</div>
									</div>
									<Link
										to={getDashboardRoute()}
										className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
										onClick={() => setMenuOpen(false)}
									>
										Dashboard
									</Link>

									{getProfileRoute() && (
										<Link
											to={getProfileRoute()}
											className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
											onClick={() => setMenuOpen(false)}
										>
											Profile
										</Link>
									)}
									<button
										onClick={handleLogout}
										className="w-full text-left text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
									>
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to="/login"
										className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-blue-50"
										onClick={() => setMenuOpen(false)}
									>
										Login
									</Link>
									<Link
										to="/register"
										className="text-white bg-blue-600 hover:bg-blue-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
										onClick={() => setMenuOpen(false)}
									>
										Get Started
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
