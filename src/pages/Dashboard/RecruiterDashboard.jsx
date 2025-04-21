import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
	FaBriefcase, FaMapMarkerAlt, FaUserFriends,
	FaPen, FaTrash, FaPlus, FaCheck, FaTimes
} from "react-icons/fa";

const JobCard = ({
	job,
	onDelete,
	onStatusChange,
	onUpdate,
	expandedJobId,
	setExpandedJobId
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editedJob, setEditedJob] = useState({ ...job });
	const [applicants, setApplicants] = useState([]);
	const [loadingApplicants, setLoadingApplicants] = useState(false);

	const isExpanded = expandedJobId === job._id;

	const toggleExpand = async () => {
		if (isExpanded) {
			setExpandedJobId(null);
		} else {
			setExpandedJobId(job._id);
			if (applicants.length === 0) {
				setLoadingApplicants(true);
				try {
					const res = await api.get(`/apply/${job._id}/applications`);
					setApplicants(res.data || []);
				} catch (err) {
					console.error("Error fetching applicants:", err);
				}
				setLoadingApplicants(false);
			}
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedJob(prev => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		await onUpdate(editedJob._id, editedJob);
		setIsEditing(false);
	};

	const handleStatusUpdate = async (applicationId, newStatus) => {
		try {
			await api.put(`/apply/${applicationId}/status`, { status: newStatus });
			setApplicants(prev =>
				prev.map(app => app._id === applicationId ? { ...app, status: newStatus } : app)
			);
		} catch (err) {
			alert("Failed to update application status");
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-5 space-y-4 w-full">
			{isEditing ? (
				<>
					<input className="text-lg font-semibold border rounded p-2 w-full" name="title" value={editedJob.title} onChange={handleChange} />
					<input className="text-sm text-gray-600 border rounded p-2 w-full" name="location" value={editedJob.location} onChange={handleChange} />
					<select name="jobType" value={editedJob.jobType} onChange={handleChange} className="text-sm border rounded p-2 w-full">
						<option value="full-time">Full-time</option>
						<option value="part-time">Part-time</option>
						<option value="internship">Internship</option>
						<option value="contract">Contract</option>
					</select>
				</>
			) : (
				<>
					<h3 className="text-xl font-semibold">{job.title}</h3>
					<p className="text-sm text-gray-500 flex items-center"><FaMapMarkerAlt className="mr-1" /> {job.location}</p>
					<p className="text-sm text-gray-500">Type: {job.jobType}</p>
					<p className="text-sm font-medium">Status: <span className={job.status === 'open' ? 'text-green-600' : 'text-red-600'}>{job.status}</span></p>
				</>
			)}

			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-2 lg:space-y-0">
				{/* Show/Hide Applicants */}
				<button
					onClick={toggleExpand}
					className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium w-full lg:w-auto"
				>
					{isExpanded ? 'Hide Applicants' : 'View Applicants'}
				</button>

				{/* Action Buttons: Edit, Delete, Status */}
				<div className="flex justify-between lg:space-x-2 w-full lg:w-auto">
					{isEditing ? (
						<>
							<button
								onClick={handleSave}
								className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-sm font-medium w-full lg:w-auto"
							>
								Save
							</button>
							<button
								onClick={() => {
									setIsEditing(false);
									setEditedJob(job);
								}}
								className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium w-full lg:w-auto"
							>
								Cancel
							</button>
						</>
					) : (
						<>
							<button
								onClick={() => setIsEditing(true)}
								className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded text-sm font-medium w-full lg:w-auto"
							>
								Edit
							</button>
							<button
								onClick={() => onDelete(job._id)}
								className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium w-full lg:w-auto"
							>
								Delete
							</button>
							{job.status === 'closed' ? (
								<button
									onClick={() => onStatusChange(job._id, 'open')}
									className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-sm font-medium w-full lg:w-auto"
								>
									Open
								</button>
							) : (
								<button
									onClick={() => onStatusChange(job._id, 'closed')}
									className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium w-full lg:w-auto"
								>
									Close
								</button>
							)}
						</>
					)}
				</div>
			</div>



			{/* Expanded Applicant List */}
			{isExpanded && (
				<div className="mt-4 border-t pt-4">
					{loadingApplicants ? (
						<p className="text-sm text-gray-500">Loading applicants...</p>
					) : applicants.length === 0 ? (
						<p className="text-sm text-gray-500">No applicants yet.</p>
					) : (
						<ul className="space-y-3">
							{applicants.map(app => (
								<li key={app._id} className="border p-3 rounded-md bg-gray-50">
									<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-2 lg:space-y-0">
										<div>
											<p className="font-medium">{app.applicant?.name}</p>
											<p className="text-sm text-gray-600">{app.applicant?.email}</p>
											<p className="text-sm text-gray-500">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
											{app.resume && (
												<a href={app.resume} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">View Resume</a>
											)}
											<p className="mt-1 text-sm">
												Status:
												<span className={`ml-1 font-semibold capitalize ${app.status === 'accepted' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
													{app.status}
												</span>
											</p>
										</div>

										<div className="flex flex-row space-x-2 mt-2">
											{app.status !== 'accepted' && (
												<button onClick={() => handleStatusUpdate(app._id, 'accepted')} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 w-full sm:w-auto">
													Accept
												</button>
											)}
											{app.status !== 'rejected' && (
												<button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 w-full sm:w-auto">
													Reject
												</button>
											)}
										</div>
									</div>
								</li>
							))}
						</ul>

					)}
				</div>
			)}
		</div>
	);
};

const RecruiterDashboard = () => {
	const [jobs, setJobs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [recruiter, setRecruiter] = useState(null);
	const [expandedJobId, setExpandedJobId] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				const [jobsRes, profileRes] = await Promise.all([
					api.get("/jobs/myjobs"),
					api.get("/users/me")
				]);
				setJobs(jobsRes.data);
				setRecruiter(profileRes.data);
			} catch (err) {
				console.error("Error loading dashboard:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchJobs();
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this job?")) return;
		try {
			await api.delete(`/jobs/${id}`);
			setJobs(jobs.filter(job => job._id !== id));
		} catch (err) {
			alert("Failed to delete job");
		}
	};

	const handleStatusChange = async (id, newStatus) => {
		try {
			await api.put(`/jobs/${id}/status`, { status: newStatus });
			setJobs(prev => prev.map(job =>
				job._id === id ? { ...job, status: newStatus } : job
			));
		} catch (err) {
			alert("Failed to update job status");
		}
	};

	const handleUpdate = async (id, updatedData) => {
		try {
			await api.put(`/jobs/${id}`, updatedData);
			setJobs(prev => prev.map(job => job._id === id ? { ...job, ...updatedData } : job));
		} catch (err) {
			alert("Failed to update job");
		}
	};

	return (
		<div className="max-w-6xl mx-auto px-6 py-8 bg-gray-50 min-h-screen relative 
">
			<div className="bg-white p-6 sm:p-8 rounded-xl shadow flex flex-col sm:flex-row sm:items-center gap-6">
				<img
					src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
					alt="Recruiter Avatar"
					className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-300 mx-auto sm:mx-0"
				/>
				<div className="flex-1 text-center sm:text-left">
					<h1 className="text-3xl font-bold text-gray-800">Recruiter Dashboard</h1>
					{recruiter && (
						<>
							<p className="text-sm text-gray-500 mt-1">{recruiter.name} ({recruiter.email})</p>
							<p className="text-sm text-blue-600 mt-2 font-medium capitalize">{recruiter.role}</p>
						</>
					)}
				</div>
				<div>
					<button
						onClick={() => navigate("/recruiter/jobs/create")}
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
					>
						<FaPlus className="mr-2" />
						Post Job
					</button>
				</div>
			</div>

			{loading ? (
				<p className="text-center text-gray-500">Loading jobs...</p>
			) : jobs.length === 0 ? (
				<p className="text-center text-gray-500">You haven't posted any jobs yet.</p>
			) : (
				<div className="space-y-6 mt-10">
					{jobs.map(job => (
						<JobCard
							key={job._id}
							job={job}
							onDelete={handleDelete}
							onStatusChange={handleStatusChange}
							onUpdate={handleUpdate}
							expandedJobId={expandedJobId}
							setExpandedJobId={setExpandedJobId}
						/>
					))}
				</div>

			)}
		</div>
	);
};

export default RecruiterDashboard;
