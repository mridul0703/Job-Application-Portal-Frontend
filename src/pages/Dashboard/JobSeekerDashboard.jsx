import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FaMapMarkerAlt } from "react-icons/fa";

const statusColor = {
	pending: "bg-yellow-100 text-yellow-800",
	accepted: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

const ApplicationCard = ({ application, onWithdraw }) => {
	const { job } = application;

	if (!job) {
		return (
			<div className="bg-red-50 text-red-800 p-4 rounded shadow flex flex-col gap-2">
				<p className="font-semibold">This job posting has been removed or is no longer available.</p>
				<p className="text-sm text-red-600">
					You applied on {new Date(application.createdAt).toLocaleDateString()}
				</p>
				<button
					onClick={() => onWithdraw(application._id)}
					className="mt-2 self-start px-3 py-1 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded"
				>
					Remove Application
				</button>
			</div>
		);
	}

	return (
		<div className="relative bg-white p-5 rounded-xl shadow w-full transition hover:shadow-lg flex flex-col justify-between min-h-[200px]">
			<Link to={`/jobs/${job._id}`} className="block">
				<h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
				<p className="text-sm text-gray-500 flex items-center mt-1">
					<FaMapMarkerAlt className="mr-1" /> {job.location}
				</p>
				<p className="text-sm text-gray-500 mt-1">Company: {job.company || "N/A"}</p>
				<p className="text-sm text-gray-400 mt-1">
					Applied: {new Date(application.createdAt).toLocaleDateString()}
				</p>
			</Link>

			{/* Status + Withdraw in same row */}
			<div className="mt-4 flex justify-between items-center">
				<span className={`text-xs px-2 py-1 rounded ${statusColor[application.status]}`}>
					{application.status.charAt(0).toUpperCase() + application.status.slice(1)}
				</span>
				<button
					onClick={() => onWithdraw(application._id)}
					className="bg-red-100 text-red-700 hover:bg-red-200 text-xs font-medium px-3 py-1 rounded transition"
				>
					Withdraw Application
				</button>
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
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="max-w-6xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
			{/* Header */}
			<div className="bg-white p-6 sm:p-8 rounded-xl shadow mb-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
				<img
					src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
					alt="Profile"
					className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-300 mx-auto sm:mx-0"
				/>
				<div className="text-center sm:text-left">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{user.name}</h1>
					<p className="text-sm sm:text-md text-gray-500 mt-1">{user.email}</p>
					<p className="text-sm text-blue-600 mt-2 font-medium capitalize">{user.role}</p>
				</div>
			</div>

			{/* Main layout */}
			<div className="flex flex-col sm:flex-row gap-6">
				{/* Filters */}
				<div className="w-full sm:w-1/4 space-y-2 sticky top-6 self-start">
					{/* Mobile Dropdown */}
					<div className="sm:hidden mb-4">
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="w-full px-4 py-2 border rounded-md text-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="all">All Applications</option>
							<option value="pending">Pending</option>
							<option value="accepted">Accepted</option>
							<option value="rejected">Rejected</option>
						</select>
					</div>

					{/* Desktop Sidebar */}
					<div className="hidden sm:block space-y-2">
						{["all", "pending", "accepted", "rejected"].map((status) => (
							<button
								key={status}
								onClick={() => setStatusFilter(status)}
								className={`block w-full text-left px-4 py-2 rounded text-sm font-medium ${statusFilter === status
									? "bg-blue-100 text-blue-700"
									: "bg-white hover:bg-blue-50 text-gray-700"
									}`}
							>
								{status === "all"
									? "All Applications"
									: status.charAt(0).toUpperCase() + status.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Applications List */}
				<div className="flex-1 space-y-6">
					{filteredApplications.length === 0 ? (
						<p className="text-center text-gray-400 italic">No applications found.</p>
					) : (
						filteredApplications.map((app) => (
							<ApplicationCard key={app._id} application={app} onWithdraw={handleWithdraw} />
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default JobSeekerDashboard;
