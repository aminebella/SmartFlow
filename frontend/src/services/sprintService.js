const API_URL = process.env.NEXT_PUBLIC_API_URL;

function buildUrl(path) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL n'est pas défini dans .env");
  return `${API_URL}${path}`;
}

async function handleResponse(res) {
  const text = await res.text();
  if (!res.ok) throw new Error(`API ERROR ${res.status}: ${text}`);
  return text ? JSON.parse(text).data : null;
}

export async function listSprintsByProject(projectId) {
  const res = await fetch(buildUrl(`/projects/${projectId}/sprints`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return handleResponse(res);
}

export async function createSprint(projectId, data) {
  const res = await fetch(buildUrl(`/projects/${projectId}/sprints`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateSprint(id, data) {
  const res = await fetch(buildUrl(`/sprints/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteSprint(id) {
  const res = await fetch(buildUrl(`/sprints/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ERROR ${res.status}: ${text}`);
  }
}