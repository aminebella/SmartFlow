// ← createSprint, startSprint...
import API from "../api/axios.js";

// We use the configured axios instance `API` (see src/api/axios.js) which already
// sets the baseURL and `withCredentials: true` so cookies (httpOnly jwt) are sent.
// Each function returns the backend payload. Backend responses often wrap data
// in a `{ data: ... }` envelope; we prefer to return `res.data.data` when present
// and fall back to `res.data` otherwise.

function unwrap(res) {
  // axios response: res.data is the parsed body
  return res?.data?.data ?? res?.data ?? null;
}

// Ikram Part: Sprint management for a project
export async function listSprintsByProject(projectId) {
  try {
    const res = await API.get(`/projects/${projectId}/sprints`);
    return unwrap(res);
  } catch (err) {
    // Normalize error message
    throw new Error(err?.response?.data?.message || err.message || 'Failed to list sprints');
  }
}

export async function createSprint(projectId, data) {
  try {
    const res = await API.post(`/projects/${projectId}/sprints`, data);
    return unwrap(res);
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to create sprint');
  }
}

export async function updateSprint(id, data) {
  try {
    const res = await API.put(`/sprints/${id}`, data);
    return unwrap(res);
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to update sprint');
  }
}

export async function deleteSprint(id) {
  try {
    const res = await API.delete(`/sprints/${id}`);
    // return any payload if present, otherwise null
    return unwrap(res);
  } catch (err) {
    throw new Error(err?.response?.data?.message || err.message || 'Failed to delete sprint');
  }
}


// Imane Part: 

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