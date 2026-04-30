// ← fetch a project by role (ADMIN vs CLIENT) and optionally by status (ACTIVE, ARCHIVED, etc.)
'use client';

import { useState, useEffect } from "react";
import { getMyProjects, getAllProjects } from "@/services/projectService";

// Usage: const { projects, loading, error, refetch } = useProjects(role, status);
// role = "ADMIN" or "CLIENT" — determines which endpoint to call
export function useProjects(role, status = null) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = role === "ADMIN"
        ? await getAllProjects(status)
        : await getMyProjects(status);
      setProjects(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchProjects();
  }, [role, status]);

  return { projects, loading, error, refetch: fetchProjects };
}