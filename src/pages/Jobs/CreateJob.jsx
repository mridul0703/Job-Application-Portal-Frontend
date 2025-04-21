import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateJob = () => {
	const [form, setForm] = useState({
		title: '',
		company: '',
		location: '',
		description: '',
		salary: '',
		tags: '',
		skills: '',
		experienceLevel: 'entry',
		status: 'open',
		jobType: 'full-time',
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const isFormValid =
		form.title.trim() &&
		form.company.trim() &&
		form.location.trim() &&
		form.description.trim() &&
		form.salary;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage('');

		const payload = {
			...form,
			salary: Number(form.salary),
			tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
			skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
		};

		try {
			await api.post('/jobs/create', payload);
			setMessage('✅ Job created successfully!');
			setTimeout(() => navigate('/recruiter/dashboard'), 1500);
		} catch (err) {
			console.error('Error creating job', err);
			const errMsg = err.response?.data?.message || '❌ Failed to create job.';
			setMessage(errMsg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-3xl bg-white p-8 rounded-lg shadow space-y-6"
			>
				<h2 className="text-3xl font-bold text-blue-700">Post a Job</h2>

				{message && (
					<p className="text-center text-sm font-medium text-gray-700">{message}</p>
				)}

				{/* Basic Fields */}
				{['title', 'company', 'location', 'salary'].map((field) => (
					<div key={field}>
						<label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
							{field} <span className="text-red-500">*</span>
						</label>
						<input
							id={field}
							type={field === 'salary' ? 'number' : 'text'}
							name={field}
							value={form[field]}
							onChange={handleChange}
							className="w-full border p-3 rounded mt-1"
							placeholder={`Enter ${field}`}
						/>
					</div>
				))}

				{/* Description */}
				<div>
					<label htmlFor="description" className="block text-sm font-medium text-gray-700">
						Description <span className="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						name="description"
						value={form.description}
						onChange={handleChange}
						className="w-full border p-3 rounded mt-1 min-h-[100px]"
						placeholder="Describe the role, requirements, etc."
					/>
					<p className="text-sm text-gray-500 text-right">
						{form.description.length} / 1000
					</p>
				</div>

				{/* Tags and Skills */}
				{['tags', 'skills'].map((field) => (
					<div key={field}>
						<label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
							{field} (comma-separated)
						</label>
						<input
							id={field}
							name={field}
							value={form[field]}
							onChange={handleChange}
							className="w-full border p-3 rounded mt-1"
							placeholder={`e.g. React, Node, MongoDB`}
						/>
					</div>
				))}

				{/* Dropdowns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
							Experience Level
						</label>
						<select
							id="experienceLevel"
							name="experienceLevel"
							value={form.experienceLevel}
							onChange={handleChange}
							className="w-full border p-3 rounded mt-1"
						>
							<option value="entry">Entry</option>
							<option value="mid">Mid</option>
							<option value="senior">Senior</option>
						</select>
					</div>

					<div>
						<label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
							Job Type
						</label>
						<select
							id="jobType"
							name="jobType"
							value={form.jobType}
							onChange={handleChange}
							className="w-full border p-3 rounded mt-1"
						>
							<option value="full-time">Full-time</option>
							<option value="part-time">Part-time</option>
							<option value="internship">Internship</option>
							<option value="contract">Contract</option>
						</select>
					</div>

					<div>
						<label htmlFor="status" className="block text-sm font-medium text-gray-700">
							Status
						</label>
						<select
							id="status"
							name="status"
							value={form.status}
							onChange={handleChange}
							className="w-full border p-3 rounded mt-1"
						>
							<option value="open">Open</option>
							<option value="closed">Closed</option>
						</select>
					</div>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={loading || !isFormValid}
					className={`w-full font-medium py-3 rounded transition text-white ${loading || !isFormValid
						? 'bg-blue-300 cursor-not-allowed'
						: 'bg-blue-600 hover:bg-blue-700'
						}`}
				>
					{loading ? 'Posting...' : 'Create Job'}
				</button>
			</form>

			{loading && (
				<div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
		</div>
	);
};

export default CreateJob;
