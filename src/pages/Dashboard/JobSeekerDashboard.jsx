import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const statusConfig = {
	pending: { 
		color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
		icon: "⏳",
		label: "Under Review"
	},
	accepted: { 
		color: "bg-green-100 text-green-800 border-green-200", 
		icon: "✅",
		label: "Accepted"
	},
	rejected: { 
		color: "bg-red-100 text-red-800 border-red-200", 
		icon: "❌",
		label: "Not Selected"
	},
};

const ApplicationCard = ({ application, onWithdraw }) => {
	const { job } = application;
	const status = statusConfig[application.status] || statusConfig.pending;

	if (!job) {
		return (
			<div className="card p-6 border-l-4 border-red-500">
				<div className="flex items-start">
					<div className="flex-shrink-0">
						<div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
							<span className="text-red-600 text-lg">⚠️</span>
						</div>
					</div>
					<div className="ml-4 flex-1">
						<h3 className="text-lg font-semibold text-red-800 mb-2">
							Job No Longer Available
						</h3>
						<p className="text-red-600 mb-4">
							This job posting has been removed or is no longer available.
						</p>
						<div className="flex items-center justify-between">
							<span className="text-sm text-red-500">
								Applied on {new Date(application.createdAt).toLocaleDateString()}
							</span>
							<button
								onClick={() => onWithdraw(application._id)}
								className="btn-outline text-sm px-4 py-2 border-red-500 text-red-600 hover:bg-red-50"
							>
								Remove Application
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="card card-hover p-6 group">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<Link to={`/jobs/${job._id}`} className="block group-hover:text-blue-600 transition-colors">
						<h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
					</Link>
					<div className="space-y-1">
						<p className="text-gray-600 font-medium">{job.company}</p>
						<div className="flex items-center text-gray-500">
							<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span className="text-sm">{job.location}</span>
						</div>
					</div>
				</div>
				<div className="ml-4">
					<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
						<span className="mr-1">{status.icon}</span>
						{status.label}
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

			<div className="flex items-center justify-between pt-4 border-t border-gray-100">
				<span className="text-sm text-gray-500">
					Applied on {new Date(application.createdAt).toLocaleDateString()}
				</span>
				<div className="flex space-x-2">
					<Link
						to={`/jobs/${job._id}`}
						className="text-blue-600 hover:text-blue-700 text-sm font-medium"
					>
						View Job →
					</Link>
					<button
						onClick={() => onWithdraw(application._id)}
						className="text-red-600 hover:text-red-700 text-sm font-medium"
					>
						Withdraw
					</button>
				</div>
			</div>
		</div>
	);
};

const JobSeekerDashboard = () => {
	const [user, setUser] = useState(null);
	const [applications, setApplications] = useState([]);
	const [filteredApplications, setFilteredApplications] = useState([]);
	const [statusFilter, setStatusFilter] = useState("all");
	const [loading, setLoading] = useState(true);

	const fetchAll = async () => {
		setLoading(true);
		try {
			const userRes = await api.get("/users/me");
			const appsRes = await api.get("/apply/my");
			setUser(userRes.data);
			setApplications(appsRes.data);
			setFilteredApplications(appsRes.data);
		} catch (err) {
			console.error("Error loading dashboard data", err);
		} finally {
			setLoading(false);
		}
	};

	const handleWithdraw = async (id) => {
		if (!window.confirm("Are you sure you want to withdraw this application?")) return;
		try {
			await api.delete(`/apply/${id}`);
			const updated = applications.filter((app) => app._id !== id);
			setApplications(updated);
			filterApplications(statusFilter, updated);
		} catch (err) {
			console.error("Withdraw failed", err);
			alert("Failed to withdraw application.");
		}
	};

	const filterApplications = (status, list = applications) => {
		if (status === "all") {
			setFilteredApplications(list);
		} else {
			setFilteredApplications(list.filter((app) => app.status === status));
		}
	};

	useEffect(() => {
		fetchAll();
	}, []);

	useEffect(() => {
		filterApplications(statusFilter);
	}, [statusFilter]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
				<div className="loading-spinner"></div>
			</div>
		);
	}

	if (!user) return null;

	const getStats = () => {
		const total = applications.length;
		const pending = applications.filter(app => app.status === 'pending').length;
		const accepted = applications.filter(app => app.status === 'accepted').length;
		const rejected = applications.filter(app => app.status === 'rejected').length;
		return { total, pending, accepted, rejected };
	};

	const stats = getStats();

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="card p-8 mb-8">
					<div className="flex flex-col lg:flex-row lg:items-center gap-6">
						<div className="flex items-center space-x-4">
							<div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
								<span className="text-white text-2xl font-bold">
									{user.name?.charAt(0).toUpperCase()}
								</span>
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
								<p className="text-gray-600">{user.email}</p>
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
									👤 Job Seeker
								</span>
							</div>
						</div>
						
						<div className="lg:ml-auto">
							<Link
								to="/jobs"
								className="btn-primary"
							>
								Find New Jobs
							</Link>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="card p-6 text-center">
						<div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
						<div className="text-gray-600">Total Applications</div>
					</div>
					<div className="card p-6 text-center">
						<div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pending}</div>
						<div className="text-gray-600">Under Review</div>
					</div>
					<div className="card p-6 text-center">
						<div className="text-3xl font-bold text-green-600 mb-2">{stats.accepted}</div>
						<div className="text-gray-600">Accepted</div>
					</div>
					<div className="card p-6 text-center">
						<div className="text-3xl font-bold text-red-600 mb-2">{stats.rejected}</div>
						<div className="text-gray-600">Not Selected</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="grid lg:grid-cols-4 gap-8">
					{/* Filters Sidebar */}
					<div className="lg:col-span-1">
						<div className="card p-6 sticky top-8">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Applications</h3>
							<div className="space-y-2">
								{[
									{ key: "all", label: "All Applications", count: stats.total },
									{ key: "pending", label: "Under Review", count: stats.pending },
									{ key: "accepted", label: "Accepted", count: stats.accepted },
									{ key: "rejected", label: "Not Selected", count: stats.rejected }
								].map(({ key, label, count }) => (
									<button
										key={key}
										onClick={() => setStatusFilter(key)}
										className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
											statusFilter === key
												? "bg-blue-100 text-blue-700 border-2 border-blue-200"
												: "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent"
										}`}
									>
										<div className="flex justify-between items-center">
											<span>{label}</span>
											<span className={`px-2 py-1 rounded-full text-xs ${
												statusFilter === key ? "bg-blue-200 text-blue-800" : "bg-gray-200 text-gray-600"
											}`}>
												{count}
											</span>
										</div>
									</button>
								))}
							</div>
						</div>
					</div>

					{/* Applications List */}
					<div className="lg:col-span-3">
						<div className="mb-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">My Applications</h2>
							<p className="text-gray-600">
								{statusFilter === "all" 
									? `Showing all ${filteredApplications.length} applications`
									: `Showing ${filteredApplications.length} ${statusFilter} applications`
								}
							</p>
						</div>

						{filteredApplications.length === 0 ? (
							<div className="card p-12 text-center">
								<div className="text-gray-400 mb-4">
									<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
								<p className="text-gray-600 mb-6">
									{statusFilter === "all" 
										? "You haven't applied to any jobs yet. Start exploring opportunities!"
										: `No ${statusFilter} applications found.`
									}
								</p>
								{statusFilter === "all" && (
									<Link to="/jobs" className="btn-primary">
										Browse Jobs
									</Link>
								)}
							</div>
						) : (
							<div className="space-y-6">
								{filteredApplications.map((app) => (
									<ApplicationCard key={app._id} application={app} onWithdraw={handleWithdraw} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default JobSeekerDashboard;
