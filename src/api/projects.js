import { postRequest, getRequest, putRequest, deleteRequest } from "./http";

export const createProject = (data) => postRequest('/projects', data);
export const getAllProjects = () => getRequest('/projects');
export const getProjectById = (id) => getRequest(`/projects/${id}`);
export const getBasicProject = (id) => getRequest(`/projects/basic/${id}`);
export const updateProject = (id, data) => putRequest(`/projects/${id}`, data);
export const deleteProject = (id) => deleteRequest(`/projects/${id}`);