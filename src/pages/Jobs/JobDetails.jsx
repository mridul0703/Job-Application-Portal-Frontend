import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
	FaBriefcase,
	FaMapMarkerAlt,
	FaCheckCircle,
	FaMoneyBillWave,
} from 'react-icons/fa';

const JobDetails = () => {
	const { id } = useParams();
	const [job, setJob] = useState(null);
	const [applied, setApplied] = useState(false);
	const [status, setStatus] = useState(null);
	const [applicationId, setApplicationId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const jobRes = await api.get(`/jobs/${id}`);
				setJob(jobRes.data);

				if (user?.role === 'job-seeker') {
					const appRes = await api.get(`/apply/${id}/status`);
					setApplied(appRes.data.applied);
					setStatus(appRes.data.status);
					setApplicationId(appRes.data.applicationId);
				}
			} catch (err) {
				console.error('Error fetching job or application:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id, user]);

	const handleApply = async () => {
		setIsProcessing(true);
		try {
			const res = await api.post(`/apply/${id}`, {
				resumeUrl: 'https://example.com/my-resume.pdf',
			});
			setApplied(true);
			setStatus(res.data?.application?.status || 'pending');
			setApplicationId(res.data?.application?._id);
		} catch (err) {
			console.error('Application failed', err);
			alert('Failed to apply. Please try again later.');
		} finally {
			setIsProcessing(false);
		}
	};

	const handleWithdraw = async () => {
		if (!applicationId) return;
		setIsProcessing(true);
		try {
			await api.delete(`/apply/${applicationId}`);
			setApplied(false);
			setStatus(null);
			setApplicationId(null);
		} catch (err) {
			console.error('Failed to withdraw application', err);
			alert('Could not withdraw your application.');
		} finally {
			setIsProcessing(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen bg-white">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!job) {
		return <div className="text-center mt-20 text-gray-600">Job not found.</div>;
	}

	const statusBadgeClasses = {
		accepted: 'bg-green-100 text-green-700',
		rejected: 'bg-red-100 text-red-700',
		pending: 'bg-yellow-100 text-yellow-700',
	};

	return (
		<div className="min-h-screen bg-blue-50 p-6">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 relative">

				{/* Status Badge */}
				{applied && (
					<div
						className={`absolute top-6 right-6 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${statusBadgeClasses[status] || 'bg-gray-200 text-gray-700'}`}
					>
						{status}
					</div>
				)}

				<h1 className="text-3xl font-bold text-blue-800 mb-2">{job.title}</h1>

				<div className="text-gray-600 flex flex-wrap items-center gap-4 mb-4">
					<p className="flex items-center gap-2"><FaBriefcase /> {job.company}</p>
					<p className="flex items-center gap-2"><FaMapMarkerAlt /> {job.location}</p>
					<p className="flex items-center gap-2"><FaMoneyBillWave /> ${job.salary?.toLocaleString() || 'N/A'} /year</p>
				</div>

				<div className="flex flex-wrap gap-4 text-sm text-blue-600 font-medium mb-4">
					<p>Job Type: {job.jobType}</p>
					<p>Experience: {job.experienceLevel}</p>
					<p>Status: {job.status}</p>
				</div>

				<hr className="my-4" />

				<div>
					<h2 className="text-xl font-semibold text-blue-700 mb-2">Job Description</h2>
					<p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
				</div>

				{job.tags?.length > 0 && (
					<div className="mt-6">
						<h3 className="text-md font-semibold text-blue-700 mb-2">Skills Required</h3>
						<div className="flex flex-wrap gap-2">
							{job.tags.map((tag, idx) => (
								<span
									key={idx}
									className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
								>
									{tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Apply / Withdraw */}
				{user?.role === 'job-seeker' && !applied && (
					<button
						onClick={handleApply}
						disabled={isProcessing}
						className={`mt-8 px-6 py-2 rounded shadow text-white transition ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
						aria-label="Apply for this job"
					>
						{isProcessing ? 'Applying...' : 'Apply Now'}
					</button>
				)}

				{applied && (
					<div className="mt-8 text-green-600 font-semibold flex flex-col sm:flex-row sm:items-center gap-4">
						<p className="flex items-center">
							<FaCheckCircle className="mr-2" />
							You have already applied.
						</p>
						<button
							onClick={handleWithdraw}
							disabled={isProcessing}
							className={`px-4 py-2 rounded shadow text-white transition ${isProcessing ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
							aria-label="Withdraw your application"
						>
							{isProcessing ? 'Processing...' : 'Withdraw Application'}
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default JobDetails;
