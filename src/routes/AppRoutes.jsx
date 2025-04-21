import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import RecruiterDashboard from "../pages/Dashboard/RecruiterDashboard";
import JobSeekerDashboard from "../pages/Dashboard/JobSeekerDashboard";
import JobList from "../pages/Jobs/JobList";
import JobDetails from "../pages/Jobs/JobDetails";
import CreateJob from "../pages/Jobs/CreateJob";

const AppRoutes = () => {
	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/" element={<Landing />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/jobs" element={<JobList />} />
			<Route path="/jobs/:id" element={<JobDetails />} />

			{/* Protected Routes */}
			<Route element={<ProtectedRoute allowedRoles={['job-seeker', 'recruiter']} />}>
				<Route path="/profile" element={<Profile />} />
			</Route>

			<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
				<Route path="/admin/dashboard" element={<AdminDashboard />} />
			</Route>

			<Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
				<Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
				<Route path="/recruiter/jobs/create" element={<CreateJob />} />
			</Route>

			<Route element={<ProtectedRoute allowedRoles={['job-seeker']} />}>
				<Route path="/user/dashboard" element={<JobSeekerDashboard />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
