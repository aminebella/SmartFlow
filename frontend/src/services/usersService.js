// ← getAllClients, getClientById, blockClient, unblockClient...
import API from "@/api/axios";


// GET /admin/clients
export const getAllClients = async () => {
  const response = await API.get("/admin/clients");
  return response.data; // List<ClientResponse>
};

// GET /admin/clients/:id
export const getClientById = async (id) => {
  const response = await API.get(`/admin/clients/${id}`);
  return response.data; // ClientResponse
};

// PUT /admin/clients/:id/block
export const blockClient = async (id) => {
  const response = await API.put(`/admin/clients/${id}/block`);
  return response.data; // void → 200 OK
};

// PUT /admin/clients/:id/unblock
export const unblockClient = async (id) => {
  const response = await API.put(`/admin/clients/${id}/unblock`);
  return response.data; // void → 200 OK
};