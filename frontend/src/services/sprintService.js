import API from "../api/axios.js";

// GET /api/sprints/project/{projectId}
export const getSprintsByProject = async (projectId) => {
  const res = await API.get(`/sprints/project/${projectId}`);
  return res.data?.data ?? res.data ?? [];
};

// GET /api/sprints/{id}
export const getSprintById = async (sprintId) => {
  const res = await API.get(`/sprints/${sprintId}`);
  return res.data?.data ?? res.data;
};

// POST /api/sprints
export const createSprint = async (data) => {
  const res = await API.post(`/sprints`, data);
  return res.data?.data ?? res.data;
};

// PUT /api/sprints/{id}
export const updateSprint = async (sprintId, data) => {
  const res = await API.put(`/sprints/${sprintId}`, data);
  return res.data?.data ?? res.data;
};

// DELETE /api/sprints/{id}
export const deleteSprint = async (sprintId) => {
  const res = await API.delete(`/sprints/${sprintId}`);
  return res.data?.data ?? res.data;
};

// POST /api/sprints/{id}/start
export const startSprint = async (sprintId) => {
  const res = await API.post(`/sprints/${sprintId}/start`);
  return res.data?.data ?? res.data;
};

// POST /api/sprints/{id}/complete
export const completeSprint = async (sprintId) => {
  const res = await API.post(`/sprints/${sprintId}/complete`);
  return res.data?.data ?? res.data;
};