'use client';

import { useState, useEffect } from 'react';
import { getMyRole } from '@/services/projectService';

/**
 * Hook to get current user's role in a specific project
 * Usage: const { role, isManager, isMember, isAdmin, loading } = useProjectRole(projectId);
 */
export function useProjectRole(projectId) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        const userRole = await getMyRole(projectId);
        setRole(userRole);
      } catch (err) {
        setError(err.message);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [projectId]);

  return {
    role,
    isManager: role === 'MANAGER',
    isMember: role === 'MEMBER',
    isAdmin: role === 'ADMIN',
    canEdit: role === 'MANAGER' || role === 'ADMIN',
    loading,
    error,
  };
}