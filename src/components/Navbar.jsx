import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // Optional: Lucide icons for clean hamburger icon

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
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<nav className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-20">
				{/* Logo */}
				<Link to="/" className="text-2xl font-extrabold text-blue-700 tracking-tight">
					JobPortal
				</Link>

				{/* Hamburger (Mobile) */}
				<div className="lg:hidden">
					<button onClick={() => setMenuOpen(!menuOpen)} className="text-blue-700 focus:outline-none">
						{menuOpen ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>

				{/* Nav Links */}
				<div
					className={`lg:flex lg:items-center lg:space-x-6 text-gray-700 font-medium text-base absolute lg:static top-20 left-0 w-full lg:w-auto bg-white lg:bg-transparent px-6 lg:px-0 py-4 lg:py-0 transition-all duration-300 ${menuOpen ? "block" : "hidden"
						} lg:block`}>
					<Link to="/jobs" onClick={() => setMenuOpen(false)} className="block py-2 lg:py-0 hover:text-blue-600 transition">
						Jobs
					</Link>

					{user ? (
						<>
							<Link to={getDashboardRoute()} onClick={() => setMenuOpen(false)} className="block py-2 lg:py-0 hover:text-blue-600">
								Dashboard
							</Link>

							{getProfileRoute() && (
								<Link to={getProfileRoute()} onClick={() => setMenuOpen(false)} className="block py-2 lg:py-0 hover:text-blue-600">
									Profile
								</Link>
							)}

							<button onClick={handleLogout} className="block text-red-500 hover:text-red-600 py-2 lg:py-0">
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								to="/login"
								onClick={() => setMenuOpen(false)}
								className="block lg:inline-block mt-2 lg:mt-0 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
								Login
							</Link>
							<Link
								to="/register"
								onClick={() => setMenuOpen(false)}
								className="block lg:inline-block mt-2 lg:mt-0 px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition">
								Register
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
