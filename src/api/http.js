export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// peticiones
const request = async (method, endpoint, data = null, hasRefreshed = false) => {

    const config = {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // response 401 + no es intento de refresh
    if (response.status === 401 && !endpoint.includes('/auth/refresh') && !hasRefreshed) {
        console.warn("Access token expirado, intentando refrescar...");

        // intentamos refresh
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        });

        // refresh ok
        if (refreshRes.ok) {
            console.log("Token refrescado con éxito, reintentando petición...");
            return request(method, endpoint, data, true); // reintento
        } else {
            console.error("Refresh token inválido. Forzando logout.");
            // force-logout
            window.dispatchEvent(new CustomEvent('force-logout'));
            throw new Error("Sesión expirada");
        }
    }

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error("Respuesta inesperada del servidor");
    }

    console.log("response.ok:", response.ok);
    console.log("response.status:", response.status);
    console.log("result:", result);

    if (!response.ok) {
        const error = new Error(
            result?.error?.message || 'Error en la petición'
        );
        error.status = response.status;
        error.data = result;

        console.log("error.data:", error.data);

        throw error;
    }
    return result;
};

// post, get, put, delete
export const postRequest = (endpoint, data) => request('POST', endpoint, data);
export const getRequest = (endpoint) => request('GET', endpoint);
export const putRequest = (endpoint, data) => request('PUT', endpoint, data);
export const deleteRequest = (endpoint) => request('DELETE', endpoint);