const BASE_URL = 'http://localhost:3000/api/auth';

// peticiones post
const postRequest = async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // guardamos en navegador la cookie 'accessToken'
        credentials: 'include', 
        body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Error en la petición');
    return result;
};

export const login = (email, password) => postRequest('/login', { email, password });

export const register = (userData) => postRequest('/register', userData);

export const logout = () => postRequest('/logout', {});

//obtenemos datos del usuario (/me)
export const getMe = async () => {
    const response = await fetch(`${BASE_URL}/me`, { credentials: 'include' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result.data;
};