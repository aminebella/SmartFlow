import API from "@/api/axios";

// ─── Admin endpoints ───────────────────────────────────────────────────────────

export const getAllClients = async () => {
  const response = await API.get("/admin/clients");
  return response.data;
};

export const getClientById = async (id) => {
  const response = await API.get(`/admin/clients/${id}`);
  return response.data;
};

export const blockClient = async (id) => {
  const response = await API.put(`/admin/clients/${id}/block`);
  return response.data;
};

export const unblockClient = async (id) => {
  const response = await API.put(`/admin/clients/${id}/unblock`);
  return response.data;
};

// ─── Client profile endpoints ──────────────────────────────────────────────────

export const getClientProfile = async (id) => {
const response = await API.get(`/client/${id}`);
  return response.data;
};

export const updateClientProfile = async (
  id,
  fields,
  profilePictureFile = null,
  coverPictureFile = null
) => {
  const body = new FormData();

  body.append("fullName",  fields.fullName  ?? "");
  body.append("postTitle", fields.postTitle ?? "");
  body.append("location",  fields.location  ?? "");

  if (profilePictureFile) body.append("profilePicture", profilePictureFile);
  if (coverPictureFile)   body.append("coverPicture",   coverPictureFile);

  const response = await API.put(`/client/${id}/profile`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
// ─── manager endpoints ───────────────────────────────────────────────────────────

export const searchClientsByEmail = async (projectId, email) => {
  const response = await API.get(`/manager/projects/${projectId}/clients/search`, {
    params: { email },
  });
  return response.data; // [{ id, email, fullName, profilePicture }]
};