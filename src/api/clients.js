import { postRequest, getRequest, putRequest, deleteRequest } from "./http";

export const createClient  = (data)       => postRequest('/clients', data);
export const getAllClients  = ()           => getRequest('/clients');
export const getClient     = (id)         => getRequest(`/clients/${id}`);
export const updateClient  = (id, data)   => putRequest(`/clients/${id}`, data);
export const deleteClient  = (id)         => deleteRequest(`/clients/${id}`);