import { postRequest, getRequest } from './http'; // tu archivo con la lógica centralizada

export const login = (email, password) => postRequest('/auth/login', { email, password });
export const register = (userData) => postRequest('/auth/register', userData);
export const logout = () => postRequest('/auth/logout', {});
export const getMe = () => getRequest('/auth/me');
export const activateAccount = (token) => getRequest(`/auth/activate/${token}`);