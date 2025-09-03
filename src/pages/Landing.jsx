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
					const res = await api.get('/jobs/recent?limit=6');
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
			<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-blue-800/5"></div>
				<div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full -translate-y-48 translate-x-48 opacity-20"></div>
				<div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 rounded-full translate-y-40 -translate-x-40 opacity-20"></div>
				
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Content */}
						<div className="text-center lg:text-left space-y-8 animate-fade-in">
							<div className="space-y-6">
								<h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
									Find Your
									<span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
										Dream Job
									</span>
								</h1>
								<p className="text-xl text-gray-600 max-w-2xl">
									Connect with top companies and discover opportunities that match your skills and aspirations.
								</p>
							</div>

							{user ? (
								<div className="space-y-4">
									<div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
										<div className="relative flex-1">
											<input
												type="text"
												value={query}
												onChange={(e) => setQuery(e.target.value)}
												placeholder="Search jobs by title, company, or location..."
												className="input-field pr-12"
												onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
											/>
											<button
												onClick={handleSearch}
												className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700"
											>
												<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
												</svg>
											</button>
										</div>
										<button
											onClick={handleSearch}
											className="btn-primary whitespace-nowrap"
										>
											Search Jobs
										</button>
									</div>
									<p className="text-sm text-gray-500">
										Explore thousands of opportunities from leading companies
									</p>
								</div>
							) : (
								<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
									<Link
										to="/register"
										className="btn-primary text-lg px-8 py-4"
									>
										Get Started Free
									</Link>
									<Link
										to="/login"
										className="btn-secondary text-lg px-8 py-4"
									>
										Sign In
									</Link>
								</div>
							)}
						</div>

						{/* Right Image */}
						<div className="flex justify-center lg:justify-end">
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl transform rotate-6 opacity-20"></div>
								<img
									src={jobSearchImage}
									alt="Job search illustration"
									className="relative w-full max-w-lg rounded-3xl shadow-2xl animate-fade-in"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Latest Jobs */}
			{user && (
				<section className="py-20 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-gray-900 mb-4">
								Latest Opportunities
							</h2>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								Discover the newest job openings from top companies
							</p>
						</div>

						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{latestJobs.length > 0 ? (
								latestJobs.map((job) => (
									<div
										key={job._id}
										className="card card-hover p-6 cursor-pointer group"
										onClick={() => navigate(`/jobs/${job._id}`)}
									>
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
													{job.title}
												</h3>
												<p className="text-gray-600 font-medium">{job.company}</p>
												<p className="text-gray-500 text-sm">{job.location}</p>
											</div>
											<div className="ml-4">
												<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{job.jobType}
												</span>
											</div>
										</div>
										
										{job.tags && job.tags.length > 0 && (
											<div className="flex flex-wrap gap-2 mb-4">
												{job.tags.slice(0, 3).map((tag, index) => (
													<span
														key={index}
														className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
													>
														{tag}
													</span>
												))}
											</div>
										)}
										
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-500">
												{new Date(job.createdAt).toLocaleDateString()}
											</span>
											<span className="text-blue-600 font-medium group-hover:text-blue-700">
												View Details →
											</span>
										</div>
									</div>
								))
							) : (
								<div className="col-span-full text-center py-12">
									<div className="text-gray-400 mb-4">
										<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
										</svg>
									</div>
									<p className="text-gray-500 text-lg">No recent jobs found</p>
								</div>
							)}
						</div>

						{latestJobs.length > 0 && (
							<div className="text-center mt-12">
								<Link
									to="/jobs"
									className="btn-secondary"
								>
									View All Jobs
								</Link>
							</div>
						)}
					</div>
				</section>
			)}

			{/* Features */}
			<section className="py-20 bg-gradient-to-br from-blue-50 to-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">
							Why Choose JobPortal?
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							We provide the tools and platform you need to succeed in your career journey
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-3">
						{[
							{ 
								title: 'For Job Seekers', 
								text: 'Discover top job opportunities, apply effortlessly, and track your progress in real time.',
								icon: '👤'
							},
							{ 
								title: 'For Recruiters', 
								text: 'Post jobs, filter candidates, and streamline your hiring process with ease.',
								icon: '🏢'
							},
							{ 
								title: 'Smart Dashboards', 
								text: 'Get a personalized dashboard whether you are an applicant, recruiter, or admin.',
								icon: '📊'
							}
						].map(({ title, text, icon }) => (
							<div key={title} className="card p-8 text-center group">
								<div className="text-4xl mb-4">{icon}</div>
								<h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
									{title}
								</h3>
								<p className="text-gray-600 leading-relaxed">{text}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-20 bg-blue-600">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						{[
							{ number: '10K+', label: 'Active Jobs' },
							{ number: '5K+', label: 'Companies' },
							{ number: '50K+', label: 'Job Seekers' },
							{ number: '95%', label: 'Success Rate' }
						].map(({ number, label }) => (
							<div key={label} className="text-white">
								<div className="text-4xl font-bold mb-2">{number}</div>
								<div className="text-blue-100">{label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						{/* Company Info */}
						<div className="md:col-span-2">
							<div className="flex items-center mb-6">
								<div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
									<span className="text-white font-bold text-lg">J</span>
								</div>
								<span className="ml-3 text-2xl font-bold">JobPortal</span>
							</div>
							<p className="text-gray-400 mb-6 max-w-md">
								Connecting talented professionals with amazing opportunities. Your career journey starts here.
							</p>
							<div className="flex space-x-4">
								{['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
									<a
										key={social}
										href="#"
										className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
									>
										<span className="sr-only">{social}</span>
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
										</svg>
									</a>
								))}
							</div>
						</div>

						{/* Quick Links */}
						<div>
							<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
							<ul className="space-y-2">
								{['About Us', 'Careers', 'Help Center', 'Contact'].map((link) => (
									<li key={link}>
										<Link to="#" className="text-gray-400 hover:text-white transition-colors">
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Legal */}
						<div>
							<h3 className="text-lg font-semibold mb-4">Legal</h3>
							<ul className="space-y-2">
								{['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((link) => (
									<li key={link}>
										<Link to="#" className="text-gray-400 hover:text-white transition-colors">
											{link}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-12 pt-8 text-center">
						<p className="text-gray-400">
							© 2024 JobPortal. All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
