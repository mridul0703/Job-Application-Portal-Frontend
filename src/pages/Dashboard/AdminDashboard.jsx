import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
	FaUsers,
	FaBriefcase,
	FaFileAlt,
} from "react-icons/fa";

const StatCard = ({ icon: Icon, label, count }) => (
	<div className="flex items-center p-4 bg-white rounded-xl shadow-md space-x-4 border">
		<Icon className="text-blue-600 text-2xl" />
		<div>
			<p className="text-sm text-gray-500">{label}</p>
			<p className="text-xl font-bold text-gray-800">{count}</p>
		</div>
	</div>
);

const AdminDashboard = () => {
	const [users, setUsers] = useState([]);
	const [jobs, setJobs] = useState([]);
	const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, totalApplications: 0 });
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [selectedJobId, setSelectedJobId] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboard = async () => {
			try {
				const [statsRes, usersRes, jobsRes] = await Promise.all([
					api.get("/admin/stats"),
					api.get("/admin/users"),
					api.get("/admin/jobs"),
				]);
				setStats(statsRes.data.stats);
				setUsers(usersRes.data);
				setJobs(jobsRes.data);
			} catch (err) {
				console.error("❌ Failed to load dashboard:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboard();
	}, []);

	const handleDeleteUser = async (id) => {
		if (!window.confirm("Delete this user?")) return;
		try {
			await api.delete(`/admin/users/${id}`);
			setUsers((prev) => prev.filter((u) => u._id !== id));
			setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
			setSelectedUserId(null);
		} catch {
			alert("❌ Failed to delete user.");
		}
	};

	const handleDeleteJob = async (id) => {
		if (!window.confirm("Delete this job?")) return;
		try {
			await api.delete(`/admin/jobs/${id}`);
			const deletedJob = jobs.find((j) => j._id === id);
			const removedApplications = deletedJob?.applications?.length || 0;
			setJobs((prev) => prev.filter((j) => j._id !== id));
			setStats((prev) => ({
				...prev,
				totalJobs: prev.totalJobs - 1,
				totalApplications: prev.totalApplications - removedApplications,
			}));
			setSelectedJobId(null);
		} catch {
			alert("❌ Failed to delete job.");
		}
	};

	if (loading) return <p className="text-center mt-10 text-blue-600 text-lg">Loading dashboard...</p>;

	return (
		<div className="p-6 space-y-10 max-w-screen-xl mx-auto">
			<h1 className="text-3xl font-bold text-blue-800 mb-6">Admin Dashboard</h1>

			{/* Stats Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<StatCard icon={FaUsers} label="Total Users" count={stats.totalUsers} />
				<StatCard icon={FaBriefcase} label="Total Jobs" count={stats.totalJobs} />
				<StatCard icon={FaFileAlt} label="Applications" count={stats.totalApplications} />
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-xl shadow-md p-6 border">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">All Users</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm text-left">
						<thead>
							<tr className="bg-gray-100 text-gray-600 border-b">
								<th className="p-3">Name</th>
								<th className="p-3">Email</th>
								<th className="p-3">Role</th>
								<th className="p-3 text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<React.Fragment key={user._id}>
									<tr className="border-b hover:bg-gray-50">
										<td className="p-3">{user.name}</td>
										<td className="p-3">{user.email}</td>
										<td className="p-3 capitalize">{user.role}</td>
										<td className="p-3 text-center space-x-4">
											<button
												onClick={() => {
													setSelectedUserId((prev) => (prev === user._id ? null : user._id));
													setSelectedJobId(null); // close job detail
												}}
												className="text-blue-600 hover:underline"
											>
												View
											</button>
											<button
												onClick={() => handleDeleteUser(user._id)}
												className="text-red-600 hover:underline"
											>
												Delete
											</button>
										</td>
									</tr>
									{selectedUserId === user._id && (
										<tr>
											<td colSpan="4" className="p-4 bg-blue-50 border rounded-md">
												<h3 className="text-md font-bold mb-2">User Details</h3>
												<div className="text-sm text-gray-800 grid sm:grid-cols-2 gap-2">
													<p><strong>Name:</strong> {user.name}</p>
													<p><strong>Email:</strong> {user.email}</p>
													<p><strong>Role:</strong> {user.role}</p>
													<p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
													<p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>

													{user.skills?.length > 0 && <p><strong>Skills:</strong> {user.skills.join(", ")}</p>}
													{user.languages?.length > 0 && <p><strong>Languages:</strong> {user.languages.join(", ")}</p>}
													{user.clubs?.length > 0 && <p><strong>Clubs:</strong> {user.clubs.join(", ")}</p>}
													{user.education?.length > 0 && <p><strong>Education:</strong> {user.education.map(e => e.institute || "").join(", ")}</p>}
													{user.internships?.length > 0 && <p><strong>Internships:</strong> {user.internships.map(i => i.company || "").join(", ")}</p>}
													{user.projects?.length > 0 && <p><strong>Projects:</strong> {user.projects.map(p => p.title || "").join(", ")}</p>}
													{user.certifications?.length > 0 && <p><strong>Certifications:</strong> {user.certifications.map(c => c.name || "").join(", ")}</p>}
													{user.awards?.length > 0 && <p><strong>Awards:</strong> {user.awards.join(", ")}</p>}
												</div>
												<button onClick={() => setSelectedUserId(null)} className="mt-2 text-blue-700 hover:underline">Close</button>
											</td>
										</tr>
									)}

								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Jobs Table */}
			<div className="bg-white rounded-xl shadow-md p-6 border">
				<h2 className="text-xl font-semibold text-gray-800 mb-4">All Jobs</h2>
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm text-left">
						<thead>
							<tr className="bg-gray-100 text-gray-600 border-b">
								<th className="p-3">Title</th>
								<th className="p-3">Company</th>
								<th className="p-3">Location</th>
								<th className="p-3">Status</th>
								<th className="p-3 text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{jobs.map((job) => (
								<React.Fragment key={job._id}>
									<tr className="border-b hover:bg-gray-50">
										<td className="p-3">{job.title}</td>
										<td className="p-3">{job.company}</td>
										<td className="p-3">{job.location}</td>
										<td className="p-3 capitalize">{job.status}</td>
										<td className="p-3 text-center space-x-4">
											<button
												onClick={() => {
													setSelectedJobId((prev) => (prev === job._id ? null : job._id));
													setSelectedUserId(null); // close user detail
												}}
												className="text-blue-600 hover:underline"
											>
												View
											</button>
											<button
												onClick={() => handleDeleteJob(job._id)}
												className="text-red-600 hover:underline"
											>
												Delete
											</button>
										</td>
									</tr>
									{selectedJobId === job._id && (
										<tr>
											<td colSpan="5" className="p-4 bg-blue-50 border rounded-md">
												<h3 className="text-md font-bold mb-2">Job Details</h3>
												<div className="text-sm text-gray-800 grid sm:grid-cols-2 gap-2">
													<p><strong>Title:</strong> {job.title}</p>
													<p><strong>Company:</strong> {job.company}</p>
													<p><strong>Description:</strong> {job.description}</p>
													<p><strong>Location:</strong> {job.location}</p>
													<p><strong>Salary:</strong> ${job.salary?.toLocaleString()}</p>
													<p><strong>Status:</strong> {job.status}</p>
													<p><strong>Job Type:</strong> {job.jobType}</p>
													<p><strong>Experience Level:</strong> {job.experienceLevel}</p>
													<p><strong>Tags:</strong> {job.tags?.join(", ")}</p>
													<p><strong>Skills:</strong> {job.skills?.join(", ")}</p>
													<p><strong>Created By:</strong> {job.createdBy?.email || "Unknown"}</p>
												</div>
												<button onClick={() => setSelectedJobId(null)} className="mt-2 text-blue-700 hover:underline">Close</button>
											</td>
										</tr>
									)}

								</React.Fragment>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
