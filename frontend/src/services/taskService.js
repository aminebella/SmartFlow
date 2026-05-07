import API from "../api/axios.js";

// GET /api/tasks/project/{projectId}
export const getTickets = async (projectId) => {
  const res = await API.get(`/tasks/project/${projectId}`);
  return res.data?.data ?? res.data ?? [];
};

// GET /api/tasks/{id}
export const getTicketById = async (ticketId) => {
  const res = await API.get(`/tasks/${ticketId}`);
  return res.data?.data ?? res.data;
};

// POST /api/tasks
export const createTicket = async (projectId, data) => {
  const res = await API.post(`/tasks`, { ...data, projectId });
  return res.data?.data ?? res.data;
};

// PUT /api/tasks/{id}
export const updateTicket = async (projectId, ticketId, data) => {
  const res = await API.put(`/tasks/${ticketId}`, { ...data, projectId });
  return res.data?.data ?? res.data;
};

// DELETE /api/tasks/{id}
export const deleteTicket = async (projectId, ticketId) => {
  const res = await API.delete(`/tasks/${ticketId}`);
  return res.data?.data ?? res.data;
};

// PATCH /api/tasks/{id}/status?status=DONE
export const updateTicketStatus = async (ticketId, status) => {
  const res = await API.patch(`/tasks/${ticketId}/status`, null, { params: { status } });
  return res.data?.data ?? res.data;
};

// PATCH /api/tasks/{id}/assign?userId=xxx
export const assignTicket = async (ticketId, userId) => {
  const res = await API.patch(`/tasks/${ticketId}/assign`, null, { params: { userId } });
  return res.data?.data ?? res.data;
};

// PATCH /api/tasks/{id}/move-to-sprint?sprintId=xxx
export const moveTicketToSprint = async (ticketId, sprintId) => {
  const res = await API.patch(`/tasks/${ticketId}/move-to-sprint`, null, { params: { sprintId } });
  return res.data?.data ?? res.data;
};

// GET /api/tasks/project/{projectId}/backlog
export const getBacklogTickets = async (projectId) => {
  const res = await API.get(`/tasks/project/${projectId}/backlog`);
  return res.data?.data ?? res.data ?? [];
};

// GET /api/tasks/project/{projectId}/status?status=IN_PROGRESS
export const getTicketsByStatus = async (projectId, status) => {
  const res = await API.get(`/tasks/project/${projectId}/status`, { params: { status } });
  return res.data?.data ?? res.data ?? [];
};