import API from "../api/axios.js";

// GET /api/projects
export const getProjects = async () => {
  const res = await API.get(`/projects`);
  return res.data?.data ?? res.data ?? [];
};

// GET /api/projects/{id}
export const getProjectById = async (projectId) => {
  const res = await API.get(`/projects/${projectId}`);
  return res.data?.data ?? res.data;
};

// POST /api/projects
export const createProject = async (data) => {
  const res = await API.post(`/projects`, data);
  return res.data?.data ?? res.data;
};

// PUT /api/projects/{id}
export const updateProject = async (projectId, data) => {
  const res = await API.put(`/projects/${projectId}`, data);
  return res.data?.data ?? res.data;
};

// DELETE /api/projects/{id}
export const deleteProject = async (projectId) => {
  const res = await API.delete(`/projects/${projectId}`);
  return res.data?.data ?? res.data;
};

// GET /api/projects/{id}/members
export const getProjectMembers = async (projectId) => {
  const res = await API.get(`/projects/${projectId}/members`);
  return res.data?.data ?? res.data ?? [];
};

// GET /api/projects/{id}/my-role
export const getMyProjectRole = async (projectId) => {
  const res = await API.get(`/projects/${projectId}/my-role`);
  return res.data?.data ?? res.data;
};