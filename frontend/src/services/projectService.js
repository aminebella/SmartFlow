// ← getProjects, createProject, getById...
import API from "@/api/axios";

// ─── ADMIN ────────────────────────────────────────────────────────────────

// GET /projects?status=ACTIVE  (status optional)
export const getAllProjects = async ({ status = null, page = 0, size = 2 }) => {
  try {
    const params = {
      ...(status && { status }),
      page,
      size,
    };

    const response = await API.get("/projects", { params });
    return response.data; // List<ProjectResponse>
  } catch (error) {
    throw new Error("Failed to fetch projects");
  }
};

// ─── CLIENT ───────────────────────────────────────────────────────────────

// GET /projects/my?status=ACTIVE  (status optional, default = all)
export const getMyProjects = async ({ status = null, page = 0, size = 10 }) => {
  try {
    const params = {
      ...(status && { status }),
      page,
      size,
    };
    const response = await API.get("/projects/my", { params });
    
    // Backend returns List<ProjectResponse> directly, not paginated
    // Convert to paginated format for consistency
    const projects = response.data;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedProjects = Array.isArray(projects) ? projects.slice(startIndex, endIndex) : [];
    
    return {
      content: paginatedProjects,
      number: page,
      totalPages: Math.ceil((projects?.length || 0) / size),
      totalElements: projects?.length || 0,
      first: page === 0,
      last: endIndex >= (projects?.length || 0),
    };
  } catch (error) {
    throw new Error("Failed to fetch my projects");
  }
};

// GET /projects/{id}
export const getProjectById = async (id) => {
  try {
    const response = await API.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch project");
  }
  return response.data; // ProjectResponse
};

// POST /projects
export const createProject = async (projectData) => {
  try {
    const response = await API.post("/projects", projectData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create project");
  }
};

// PUT /projects/{id}
export const updateProject = async (id, projectData) => {
  try{
    const response = await API.put(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update project");
  }
};

// ─── STATUS CHANGES ───────────────────────────────────────────────────────

// PATCH /projects/{id}/archive
export const archiveProject = async (id) => {
  try {
    await API.patch(`/projects/${id}/archive`);
  } catch (error) {
    throw new Error("Failed to archive project");
  }
};

// PATCH /projects/{id}/restore
export const restoreProject = async (id) => {
  try {
    await API.patch(`/projects/${id}/restore`);
  } catch (error) {
    throw new Error("Failed to restore project");
  }
};

// PATCH /projects/{id}/finish
export const finishProject = async (id) => {
  try{
    await API.patch(`/projects/${id}/finish`);
  } catch (error) {
    throw new Error("Failed to finish project");
  }
};

// PATCH /projects/{id}/restore-finished
export const restoreFinishedProject = async (id) => {
  try {
    await API.patch(`/projects/${id}/restore-finished`);
  } catch (error) {
    throw new Error("Failed to restore finished project");
  }
};

// ─── MEMBERS ──────────────────────────────────────────────────────────────

// GET /api/projects/{id}/members
export const getProjectMembers = async (projectId) => {
  try{
    const response = await API.get(`/projects/${projectId}/members`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch project members");
  }
};

// POST /projects/{id}/members/{clientId}
export const addMember = async (projectId, clientId) => {
  try {
    await API.post(`/projects/${projectId}/members/${clientId}`);
  } catch (error) {
    throw new Error("Failed to add member");
  }
};

// DELETE /projects/{id}/members/{clientId}
export const removeMember = async (projectId, clientId) => {
  try {
    await API.delete(`/projects/${projectId}/members/${clientId}`);
  } catch (error) {
    throw new Error("Failed to remove member");
  }
};

// GET /projects/{id}/my-role
export const getMyRole = async (projectId) => {
  try {
    const response = await API.get(`/projects/${projectId}/my-role`);
    return response.data.role; // "MANAGER", "MEMBER", or "ADMIN"
  } catch (error) {
    throw new Error("Failed to fetch my role");
  }
};


// Imane Part:
