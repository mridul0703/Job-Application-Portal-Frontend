import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import jobSearchImage from '../assets/jobSearch.png';

const Landing = () => {
	const [query, setQuery] = useState('');
	const [latestJobs, setLatestJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchRecentJobs = async () => {
			try {
				if (user) {
					const res = await api.get('/jobs/recent?limit=5');
					setLatestJobs(res.data.jobs || []);
				}
			} catch (err) {
				console.error('Failed to fetch recent jobs', err);
			} finally {
				setLoading(false);
			}
		};
		fetchRecentJobs();
	}, [user]);

	const handleSearch = () => {
		if (query.trim()) navigate(`/jobs?q=${encodeURIComponent(query)}`);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-white">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f4f8ff] text-gray-800">
			{/* Hero Section */}
			<section className="bg-gradient-to-b from-white to-[#e0edff] py-16 md:py-24">
				<div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-10">
					{/* Left Content */}
					<div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 animate-fade-in-up">
						<h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1d4ed8] leading-tight">
							Find Your Dream Job Today
						</h1>
						<p className="text-base md:text-xl text-gray-700">
							JobPortal connects top talent with world-class companies.
						</p>

						{user ? (
							<div className="flex flex-col sm:flex-row gap-4 pt-4">
								<input
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									placeholder="Search jobs by title, company, tags, or location"
									className="flex-1 px-5 py-3 rounded-md border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									onClick={handleSearch}
									className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-3 rounded-md font-semibold shadow-md transition"
								>
									Search
								</button>
							</div>
						) : (
							<div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-6">
								<Link
									to="/login"
									className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-6 py-3 rounded-lg text-lg font-medium shadow transition"
								>
									Login
								</Link>
								<Link
									to="/register"
									className="border-2 border-[#1d4ed8] text-[#1d4ed8] hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-medium shadow transition"
								>
									Register
								</Link>
							</div>
						)}
					</div>

					{/* Right Image */}
					<div className="w-full lg:w-1/2 flex justify-center">
						<img
							src={jobSearchImage}
							alt="Job search"
							className="w-full max-w-md animate-fade-in"
						/>
					</div>
				</div>
			</section>

			{/* Latest Jobs */}
			{user && (
				<section className="bg-white py-16 px-6">
					<div className="max-w-6xl mx-auto">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
							<h2 className="text-2xl sm:text-3xl font-bold text-blue-700">
								Latest Opportunities
							</h2>
							<Link to="/jobs" className="text-blue-600 hover:underline font-medium">
								Browse all jobs →
							</Link>
						</div>

						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{latestJobs.length > 0 ? (
								latestJobs.map((job) => (
									<div
										key={job._id}
										className="border border-blue-100 rounded-xl shadow hover:shadow-lg hover:scale-[1.01] transition-all duration-200 bg-white p-5 cursor-pointer group"
										onClick={() => navigate(`/jobs/${job._id}`)}
									>
										<h3 className="text-xl font-semibold text-blue-700 group-hover:text-blue-900 transition">
											{job.title}
										</h3>
										<p className="text-sm text-gray-600 mb-1">{job.company} · {job.location}</p>
										<p className="text-sm text-gray-500 truncate">{job.tags?.join(', ')}</p>
									</div>
								))
							) : (
								<p className="text-gray-500">No recent jobs found.</p>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Features */}
			<section className="bg-gradient-to-b from-white to-[#f0f6ff] py-16 px-6">
				<div className="max-w-6xl mx-auto text-center">
					<h2 className="text-3xl font-bold text-[#1d4ed8] mb-12">Why Choose JobPortal?</h2>
					<div className="grid gap-8 grid-cols-1 md:grid-cols-3">
						{[
							{ title: 'For Job Seekers', text: 'Discover top job opportunities, apply effortlessly, and track your progress in real time.' },
							{ title: 'For Recruiters', text: 'Post jobs, filter candidates, and streamline your hiring process with ease.' },
							{ title: 'Smart Dashboards', text: 'Get a personalized dashboard whether you’re an applicant, recruiter, or admin.' }
						].map(({ title, text }) => (
							<div key={title} className="border border-blue-100 p-6 rounded-lg shadow-sm hover:shadow-md transition">
								<h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-[#1d4ed8] transition">
									{title}
								</h3>
								<p className="text-gray-600">{text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gradient-to-b from-white to-[#d1e3ff] text-gray-700 py-12 px-6">
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
					{/* Company Info */}
					<div>
						<h2 className="text-2xl font-bold text-[#1d4ed8] mb-4">JobPortal</h2>
						<p className="text-sm text-gray-600 mb-4">Connect with us:</p>
						<div className="flex space-x-4 text-[#1d4ed8] text-xl">
							<i className="fab fa-facebook hover:text-blue-700"></i>
							<i className="fab fa-instagram hover:text-pink-600"></i>
							<i className="fab fa-twitter hover:text-blue-400"></i>
							<i className="fab fa-linkedin hover:text-blue-800"></i>
						</div>
					</div>

					{/* Links */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<ul className="space-y-2">
							<li><Link to="#" className="hover:underline">About us</Link></li>
							<li><Link to="#" className="hover:underline">Careers</Link></li>
							<li><Link to="#" className="hover:underline">Help Center</Link></li>
							<li><Link to="#" className="hover:underline">Terms & Conditions</Link></li>
						</ul>
						<ul className="space-y-2">
							<li><Link to="#" className="hover:underline">Privacy Policy</Link></li>
							<li><Link to="#" className="hover:underline">Report issue</Link></li>
							<li><Link to="#" className="hover:underline">Trust & Safety</Link></li>
							<li><Link to="#" className="hover:underline">Credits</Link></li>
						</ul>
					</div>

					{/* Mobile App */}
					<div className="text-sm">
						<h4 className="font-semibold text-[#1d4ed8] mb-2">Apply on the go</h4>
						<p className="mb-4">Download our app and stay updated</p>
						<div className="flex space-x-2 flex-wrap">
							<img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
							<img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
