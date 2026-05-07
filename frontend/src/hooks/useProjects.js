// ← fetch a project by role (ADMIN vs CLIENT) and optionally by status (ACTIVE, ARCHIVED, etc.)
'use client';

import { useState, useEffect } from "react";
import { getMyProjects, getAllProjects } from "@/services/projectService";

// Usage: const { projects, loading, error, refetch } = useProjects(role, status);
// role = "ADMIN" or "CLIENT" — determines which endpoint to call
export function useProjects(role, status = null, page = 0, size = 10) {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = role === "ADMIN"
        ? await getAllProjects({ status, page, size })
        : await getMyProjects({ status, page, size });
      setProjects(data.content);
      setPagination({
        page: data.number,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchProjects();
  }, [role, status, page, size]);

  return { projects, pagination, loading, error, refetch: fetchProjects };
}