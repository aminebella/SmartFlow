// ← check the user role(MANAGER or MEMBER) in current project
'use client';

import { useState, useEffect } from "react";
import API from "@/api/axios";

// Usage: const { projectRole, isManager } = useRole(projectId);
// This tells you: is the current user a MANAGER or MEMBER in THIS project?
export function useRole(projectId) {
  const [projectRole, setProjectRole] = useState(null);
  // projectRole = "MANAGER" or "MEMBER" or null

  useEffect(() => {
    if (!projectId) return; // don't fetch if no project selected

    // This will call your backend: GET /projects/{id}/my-role
    // You'll need to create this endpoint in Spring Boot later
    API.get(`/projects/${projectId}/my-role`)
      .then(res => setProjectRole(res.data.role))
      .catch(() => setProjectRole(null));
  }, [projectId]); // re-run if projectId changes

  return {
    projectRole,
    isManager: projectRole === "MANAGER",
    isMember: projectRole === "MEMBER",
  };
}