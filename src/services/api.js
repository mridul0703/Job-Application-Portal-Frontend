import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { getAccessToken, setAccessToken, logout } from '../utils/authHelper';
import { toast } from 'react-toastify'; // Make sure react-toastify is installed and set up

let accessToken = getAccessToken();

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

api.interceptors.request.use(async (req) => {
  accessToken = getAccessToken();

  if (!accessToken) return req;

  try {
    const decoded = jwtDecode(accessToken);
    const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1000;

    if (!isExpired) {
      req.headers.Authorization = `Bearer ${accessToken}`;
      return req;
    }

    // Token expired - attempt to refresh
    const res = await axios.post(
      'https://job-application-portal-wrao.onrender.com/api/auth/refresh',
      {},
      { withCredentials: true }
    );

    const newAccessToken = res.data.accessToken;
    setAccessToken(newAccessToken);
    req.headers.Authorization = `Bearer ${newAccessToken}`;
    return req;

  } catch (err) {
    logout();

    // 👇 Notify the user before redirecting
    toast.error('Session expired. Please log in again.');

    window.location.href = '/login';
    return Promise.reject(err);
  }
});

export default api;
