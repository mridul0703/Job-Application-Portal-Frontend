// src/pages/Jobs/JobList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const SDE_SKILLS = [
	"JavaScript", "React", "TypeScript", "HTML", "CSS", "Node.js", "MongoDB", "Docker", "Python", "Django", "AWS", "Express", "Redux", "Bash", "CI/CD", "Git", "Swagger", "Figma", "Communication", "Problem Solving", "React Native"

];

const JobList = () => {
	const [jobs, setJobs] = useState([]);
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const [showAllSkills, setShowAllSkills] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		workMode: '',
		location: '',
		company: '',
		skills: [],
	});

	const fetchJobs = async (search = '') => {
		setLoading(true);
		try {
			let url = '/jobs/all';
			if (search.trim()) {
				url += `?q=${encodeURIComponent(search.trim())}`;
			}

			const res = await api.get(url);
			setJobs(res.data || []);
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};



	useEffect(() => {
		fetchJobs(search);
	}, [search]);


	const handleFilterChange = (e) => {
		const { name, value, checked } = e.target;
		if (name === 'skills') {
			setFilters((prev) => ({
				...prev,
				skills: checked
					? [...prev.skills, value]
					: prev.skills.filter((s) => s !== value),
			}));
		} else {
			setFilters((prev) => ({ ...prev, [name]: value }));
		}
	};

	const clearFilters = () => {
		setFilters({
			workMode: '',
			location: '',
			company: '',
			skills: [],
		});
	};

	const applyFilters = async () => {
		setLoading(true);
		await fetchJobs();
		setLoading(false);
	};

	const filteredJobs = jobs.filter((job) => {
		const loc = job.location?.toLowerCase() || '';
		const comp = job.company?.toLowerCase() || '';
		const skills = job.skills || [];

		const matchesLocation = filters.location
			? loc.includes(filters.location.toLowerCase())
			: true;

		const matchesCompany = filters.company
			? comp.includes(filters.company.toLowerCase())
			: true;

		const matchesSkills =
			filters.skills.length > 0
				? filters.skills.every((skill) =>
					skills.map((t) => t.toLowerCase()).includes(skill.toLowerCase())
				)
				: true;

		let matchesWorkMode = true;
		if (filters.workMode === 'remote') {
			matchesWorkMode = loc.includes('remote');
		} else if (filters.workMode === 'onsite') {
			matchesWorkMode = !loc.includes('remote');
		}

		return matchesLocation && matchesCompany && matchesSkills && matchesWorkMode;
	});

	return (
		<div className="min-h-screen bg-blue-50 p-4 md:p-6 relative">
			<div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-4 gap-6">

				{/* Mobile Filters Toggle */}
				<div className="md:hidden flex justify-between items-center mb-2">
					<h2 className="text-xl font-semibold text-blue-700">Filters</h2>
					<button
						className="text-blue-700 font-medium text-base bg-blue-100 px-4 py-2 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
						onClick={() => setShowFilters((prev) => !prev)}
					>
						{showFilters ? 'Hide Filters' : 'Show Filters'}
					</button>
				</div>

				{/* Filters Sidebar */}
				{(showFilters || window.innerWidth >= 768) && (
					<div className="bg-white p-5 rounded shadow space-y-5 md:block">
						<div className="flex justify-between items-center">
							<h2 className="text-lg font-semibold text-blue-700">All Filters</h2>
							<button
								className="text-sm text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 px-2 py-1 rounded"
								onClick={clearFilters}
							>
								Clear
							</button>
						</div>

						{/* Work Mode */}
						<div>
							<h3 className="font-medium text-gray-700 mb-2">Work Mode</h3>
							{['remote', 'onsite', 'hybrid'].map((mode) => (
								<label key={mode} className="flex items-center text-sm text-gray-600 mb-1 space-x-2">
									<input
										type="radio"
										name="workMode"
										value={mode}
										checked={filters.workMode === mode}
										onChange={handleFilterChange}
										className="accent-blue-600"
									/>
									<span>{mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
								</label>
							))}
						</div>

						{/* Skills */}
						<div>
							<h3 className="font-medium text-gray-700 mb-2">Skills</h3>
							{(showAllSkills ? SDE_SKILLS : SDE_SKILLS.slice(0, 5)).map((skill) => (
								<label key={skill} className="flex items-center text-sm text-gray-600 mb-1 space-x-2">
									<input
										type="checkbox"
										name="skills"
										value={skill}
										checked={filters.skills.includes(skill)}
										onChange={handleFilterChange}
										className="accent-blue-600"
									/>
									<span>{skill}</span>
								</label>
							))}
							<button
								className="text-blue-600 text-sm mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 px-2 py-1 rounded"
								onClick={() => setShowAllSkills((prev) => !prev)}
							>
								{showAllSkills ? 'Show Less' : 'Show More'}
							</button>
						</div>

						{/* Location */}
						<div>
							<h3 className="font-medium text-gray-700 mb-2">Location</h3>
							<input
								name="location"
								value={filters.location}
								onChange={handleFilterChange}
								placeholder="Enter location"
								className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
							/>
						</div>

						{/* Company */}
						<div>
							<h3 className="font-medium text-gray-700 mb-2">Company</h3>
							<input
								name="company"
								value={filters.company}
								onChange={handleFilterChange}
								placeholder="Enter company"
								className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
							/>
						</div>

						<button
							onClick={applyFilters}
							className="mt-4 w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold text-base py-2 rounded transition"
						>
							Apply Filters
						</button>
					</div>
				)}

				{/* Job Listings */}
				<div className="md:col-span-3 space-y-4">
					<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
						<h1 className="text-2xl font-bold text-blue-800">Job Listings</h1>
						<input
							className="border p-3 rounded w-full md:w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Search jobs..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					{filteredJobs.length === 0 ? (
						<p className="text-gray-500 mt-6">No jobs found.</p>
					) : (
						filteredJobs.map((job) => (
							<Link
								to={`/jobs/${job._id}`}
								key={job._id}
								className="block bg-white p-6 rounded shadow group hover:shadow-lg hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-300 transition"
							>
								<h3 className="text-xl font-bold text-blue-700 group-hover:text-blue-900">
									{job.title}
								</h3>
								<p className="text-gray-600">{job.company} • {job.location}</p>
								<p className="text-gray-500 mt-1">
									Salary: ${job.salary?.toLocaleString() || 'N/A'}
								</p>
								<div className="mt-2 flex flex-wrap gap-2">
									{job.skills?.map((skill, idx) => (
										<span
											key={idx}
											className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
										>
											{skill}
										</span>
									))}
								</div>

							</Link>
						))
					)}
				</div>
			</div>

			{/* Fullscreen Loader */}
			{loading && (
				<div className="fixed inset-0 bg-white bg-opacity-70 z-50 flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
		</div>
	);
};

export default JobList;
