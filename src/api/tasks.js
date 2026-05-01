import { postRequest, getRequest, putRequest, deleteRequest } from "./http";

export const createTask = (projectId, data) => postRequest(`/projects/${projectId}/tasks`, data);
export const getTasks = (projectId) => getRequest(`/projects/${projectId}/tasks`);
export const getTask = (projectId, taskId) => getRequest(`/projects/${projectId}/tasks/${taskId}`);
export const updateTask = (projectId, taskId, data) => putRequest(`/projects/${projectId}/tasks/${taskId}`, data);
export const deleteTask = (projectId, taskId) => deleteRequest(`/projects/${projectId}/tasks/${taskId}`);