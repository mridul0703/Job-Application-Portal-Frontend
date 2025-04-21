import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../utils/authHelper';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

const ProtectedRoute = ({ allowedRoles }) => {
	const token = getAccessToken();

	if (!token) return <Navigate to="/login" />;

	try {
		const decoded = jwtDecode(token);
		const isExpired = dayjs.unix(decoded.exp).isBefore(dayjs());

		if (isExpired) return <Navigate to="/login" />;

		if (!allowedRoles.includes(decoded.role)) {
			// If the user's role isn't allowed, send them to the Landing page
			return <Navigate to="/" replace />;
		}

		return <Outlet />;
	} catch {
		return <Navigate to="/login" />;
	}
};

export default ProtectedRoute;
