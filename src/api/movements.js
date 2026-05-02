// api/movements.js
import { getRequest, deleteRequest, BASE_URL } from "./http";

export const getAllMovements = (projectId) => getRequest(projectId ? `/movements?projectId=${projectId}` : '/movements');
export const getMovement = (id) => getRequest(`/movements/${id}`);
export const deleteMovement = (id) => deleteRequest(`/movements/${id}`);

export const createMovement = async (formData) => {
    const response = await fetch(`${BASE_URL}/movements`, {
        method: 'POST',
        credentials: 'include',
        body: formData, // FormData — no ponemos Content-Type, el navegador lo hace solo
    });
    const result = await response.json();
    if (!response.ok) {
        const error = new Error(result.error?.message || 'Error al crear el movimiento');
        error.status = response.status;
        error.data = result;
        throw error;
    }
    return result;
};

export const updateMovement = async (id, formData) => {
    const response = await fetch(`${BASE_URL}/movements/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) {
        const error = new Error(result.error?.message || 'Error al actualizar el movimiento');
        error.status = response.status;
        error.data = result;
        throw error;
    }
    return result;
};