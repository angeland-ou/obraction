import { getRequest, putRequest, deleteRequest, BASE_URL } from './http';

export const getTenant = () => getRequest('/tenant/');
export const updateTenant = (data) => putRequest('/tenant/', data);
export const deleteTenantLogo = () => deleteRequest('/tenant/logo');

export const uploadTenantLogo = async (formData) => {
    const response = await fetch(`${BASE_URL}/tenant/logo`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    if (!response.ok) {
        const data = await response.json();
        const error = new Error(data.error?.message || 'Error al subir el logotipo');
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return response.json();
};