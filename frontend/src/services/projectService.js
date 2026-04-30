// ← getProjects, createProject, getById...
import API from "@/api/axios";

// ─── ADMIN ────────────────────────────────────────────────────────────────

// GET /projects?status=ACTIVE  (status optional)
export const getAllProjects = async (status = null) => {
  const params = status ? { status } : {};
  const response = await API.get("/projects", { params });
  return response.data; // List<ProjectResponse>
};

// ─── CLIENT ───────────────────────────────────────────────────────────────

// GET /projects/my?status=ACTIVE  (status optional, default = all)
export const getMyProjects = async (status = null) => {
  const params = status ? { status } : {};
  const response = await API.get("/projects/my", { params });
  return response.data;
};

// GET /projects/{id}
export const getProjectById = async (id) => {
  const response = await API.get(`/projects/${id}`);
  return response.data; // ProjectResponse
};

// POST /projects
export const createProject = async (projectData) => {
  const response = await API.post("/projects", projectData);
  return response.data;
};

// PUT /projects/{id}
export const updateProject = async (id, projectData) => {
  const response = await API.put(`/projects/${id}`, projectData);
  return response.data;
};

// ─── STATUS CHANGES ───────────────────────────────────────────────────────

// PATCH /projects/{id}/archive
export const archiveProject = async (id) => {
  await API.patch(`/projects/${id}/archive`);
};

// PATCH /projects/{id}/restore
export const restoreProject = async (id) => {
  await API.patch(`/projects/${id}/restore`);
};

// PATCH /projects/{id}/finish
export const finishProject = async (id) => {
  await API.patch(`/projects/${id}/finish`);
};

// PATCH /projects/{id}/restore-finished
export const restoreFinishedProject = async (id) => {
  await API.patch(`/projects/${id}/restore-finished`);
};

// ─── MEMBERS ──────────────────────────────────────────────────────────────

// POST /projects/{id}/members/{clientId}
export const addMember = async (projectId, clientId) => {
  await API.post(`/projects/${projectId}/members/${clientId}`);
};

// DELETE /projects/{id}/members/{clientId}
export const removeMember = async (projectId, clientId) => {
  await API.delete(`/projects/${projectId}/members/${clientId}`);
};

// GET /projects/{id}/my-role
export const getMyRole = async (projectId) => {
  const response = await API.get(`/projects/${projectId}/my-role`);
  return response.data.role; // "MANAGER", "MEMBER", or "ADMIN"
};