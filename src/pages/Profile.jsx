import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';


const Profile = () => {
	const [user, setUser] = useState(null);
	const [formData, setFormData] = useState({});
	const [editSection, setEditSection] = useState(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);


	const sectionRefs = useRef({});


	const fetchProfile = async () => {
		setLoading(true);
		try {
			const { data } = await api.get('/users/me');
			setUser(data);
			setFormData(data);
			setError(null);
		} catch (err) {
			console.error(err);
			setError('Failed to load user profile');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	const handleInputChange = (section, index, field, value) => {
		if (Array.isArray(formData[section])) {
			const updated = [...formData[section]];
			if (typeof updated[index] === 'string') {
				updated[index] = value;
			} else {
				updated[index] = {
					...updated[index],
					[field]: value,
				};
			}
			setFormData({ ...formData, [section]: updated });
		} else {
			setFormData({ ...formData, [section]: value });
		}
	};

	const handleAddNew = (section) => {
		const templates = {
			education: { institution: '', course: '', grade: '' },
			internships: { company: '', role: '', duration: '', description: '' },
			projects: { title: '', description: '', technologies: [], link: '' },
			certifications: { title: '', issuer: '', date: '' },
			awards: { title: '', issuer: '', date: '' },
			clubs: '',
			skills: '',
			languages: '',
		};
		const newItem = templates[section] || '';
		const current = formData[section] || [];
		setFormData({ ...formData, [section]: [...current, newItem] });
	};

	const handleSave = async () => {
		setSaving(true);
		try {
			const { data } = await api.put('/users/me', formData);
			setUser(data);
			setFormData(data);
			setEditSection(null);
		} catch (err) {
			alert('Failed to save profile');
			console.error(err);
		} finally {
			setSaving(false);
		}
	};

	const scrollToSection = (key) => {
		sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth' });
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (error) {
		return <div className="text-center text-red-600 py-10">{error}</div>;
	}

	if (!user || user.role === 'admin') {
		return <div className="text-center py-10">Admins do not have a profile.</div>;
	}

	const isRecruiter = user.role === 'recruiter';
	const isMobile = window.innerWidth <= 768;

	const sections = isRecruiter
		? [
			{ key: 'company', label: 'Company Name' },
			{ key: 'position', label: 'Recruiter Position' },
			{ key: 'industry', label: 'Industry' },
			{ key: 'companyWebsite', label: 'Company Website' },
			{ key: 'location', label: 'Location' },
			{ key: 'bio', label: 'About You' },
			{ key: 'phone', label: 'Phone Number' },
		]
		: [
			{ key: 'education', label: 'Education' },
			{ key: 'skills', label: 'Skills' },
			{ key: 'languages', label: 'Languages' },
			{ key: 'internships', label: 'Internships' },
			{ key: 'projects', label: 'Projects' },
			{ key: 'certifications', label: 'Certifications' },
			{ key: 'awards', label: 'Awards' },
			{ key: 'clubs', label: 'Clubs & Committees' },
			{ key: 'bio', label: 'Profile Summary' },
			{ key: 'resumeUrl', label: 'Resume Link' },
			{ key: 'location', label: 'Location' },
			{ key: 'gender', label: 'Gender' },
			{ key: 'dob', label: 'Date of Birth' },
			{ key: 'phone', label: 'Phone Number' },
		];

	return (
		<div className="max-w-6xl mx-auto px-6 py-8 bg-gray-50 min-h-screen relative">
			{saving && (
				<div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
					<div className="w-16 h-16 border-4 border-white border-t-blue-600 rounded-full animate-spin" />
				</div>
			)}

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


			{/* Main Content */}
			<div className="flex flex-col lg:flex-row gap-6">
				{/* Toggle Button for Mobile */}
				{isMobile && (
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 self-start"
					>
						{sidebarOpen ? 'Hide Sections' : 'Show Sections'}
					</button>
				)}

				{/* Sidebar */}
				{sidebarOpen && (
					<div className="w-full lg:w-1/4 space-y-2 sticky top-6 self-start z-10 bg-gray-50 lg:bg-transparent">
						{sections.map(({ key, label }) => (
							<button
								key={key}
								onClick={() => {
									scrollToSection(key);
									if (isMobile) setSidebarOpen(false);
								}}
								className="block w-full text-left px-4 py-2 bg-white rounded hover:bg-blue-100 text-sm text-gray-700 font-medium"
							>
								{label}
							</button>
						))}
					</div>
				)}

				{/* Sections */}
				<div className="flex-1 space-y-8">
					{sections.map(({ key, label }) => {
						const value = formData[key];

						return (
							<div
								key={key}
								ref={(el) => (sectionRefs.current[key] = el)}
								className="bg-white p-6 rounded-xl shadow"
							>
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-semibold">{label}</h3>
									{editSection === key ? (
										<div className="flex gap-2">
											<button
												onClick={handleSave}
												className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
											>
												Save
											</button>
											<button
												onClick={() => {
													setFormData(user);
													setEditSection(null);
												}}
												className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300"
											>
												Cancel
											</button>
										</div>
									) : (
										<button
											onClick={() => {
												setEditSection(key);
												scrollToSection(key);
											}}
											className="text-blue-600 hover:underline"
										>
											Edit
										</button>
									)}
								</div>

								{Array.isArray(value) ? (
									value.length === 0 ? (
										<p className="text-sm text-gray-400 italic">No {label.toLowerCase()} added yet.</p>
									) : (
										['skills', 'languages', 'clubs'].includes(key) ? (
											<p className="text-sm text-gray-800">{value.join(', ')}</p>
										) : (
											value.map((item, index) => (
												<div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-gray-50 p-4 rounded-lg">
													{typeof item === 'string' ? (
														editSection === key ? (
															<input
																type="text"
																className="col-span-2 border px-3 py-2 rounded text-sm"
																value={item}
																onChange={(e) =>
																	handleInputChange(key, index, null, e.target.value)
																}
															/>
														) : (
															<p className="col-span-2 text-gray-700 text-sm">{item}</p>
														)
													) : (
														Object.entries(item)
															.filter(([field]) => field !== '_id')
															.map(([field, val]) => (
																<div key={field} className="flex flex-col">
																	<label className="text-xs text-gray-500 capitalize mb-1">
																		{field.replace(/([A-Z])/g, ' $1')}
																	</label>
																	{editSection === key ? (
																		<input
																			type={field.toLowerCase().includes('date') ? 'date' : 'text'}
																			className="border px-3 py-2 rounded text-sm"
																			value={
																				field.toLowerCase().includes('date') && val
																					? new Date(val).toISOString().split('T')[0]
																					: val
																			}
																			onChange={(e) =>
																				handleInputChange(key, index, field, e.target.value)
																			}
																		/>
																	) : (
																		<p className="text-gray-800 text-sm">
																			{val || <span className="text-gray-400 italic">N/A</span>}
																		</p>
																	)}
																</div>
															))
													)}
												</div>
											))
										)
									)
								) : (
									<div className="flex flex-col">
										{editSection === key ? (
											<>
												<label className="text-xs text-gray-500 capitalize mb-1">{label}</label>
												<input
													type={
														key.toLowerCase().includes('date')
															? 'date'
															: key.toLowerCase().includes('phone')
																? 'tel'
																: 'text'
													}
													className="w-full border px-4 py-2 rounded text-sm"
													value={
														key.toLowerCase().includes('date') && value
															? new Date(value).toISOString().split('T')[0]
															: value || ''
													}
													onChange={(e) => handleInputChange(key, null, null, e.target.value)}
												/>
											</>
										) : key === 'resumeUrl' && value ? (
											<a
												href={value}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 underline text-sm"
											>
												{value}
											</a>
										) : (
											<p className="text-gray-800 text-sm">
												{value || <span className="text-gray-400 italic">N/A</span>}
											</p>
										)}
									</div>
								)}

								{editSection === key && Array.isArray(value) && (
									<button
										onClick={() => handleAddNew(key)}
										className="mt-2 text-sm text-blue-600 hover:underline"
									>
										+ Add New
									</button>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Profile;
