export const getAccessToken = () => localStorage.getItem('accessToken');
export const setAccessToken = (token) => localStorage.setItem('accessToken', token);
export const removeAccessToken = () => localStorage.removeItem('accessToken');

export const logout = () => {
  removeAccessToken();
  fetch('https://job-application-portal-wrao.onrender.com/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
