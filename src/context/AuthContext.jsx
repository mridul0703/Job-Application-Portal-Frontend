import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  logout as clearSession,
} from '../utils/authHelper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid access token', err);
        removeAccessToken();
        setUser(null);
      }
    }
    setLoading(false); // ✅ Always set loading to false after check
  }, []);

  const login = (accessToken) => {
    setAccessToken(accessToken);
    try {
      const decoded = jwtDecode(accessToken);
      setUser(decoded);
    } catch (err) {
      console.error('Failed to decode access token during login', err);
    }
  };

  const logout = async () => {
    await clearSession(); // call backend to clear cookie
    removeAccessToken();  // just to be sure
    setUser(null);        // instantly update state
    window.location.href = "/login"; // force redirect
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
