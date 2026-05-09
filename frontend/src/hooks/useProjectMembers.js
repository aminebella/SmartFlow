'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProjectMembers } from '@/services/projectService'; // ← réutilise

export function useProjectMembers(projectId, myRole) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    if (!projectId || !myRole) return;
    try {
      setLoading(true);
      const data = await getProjectMembers(projectId);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [projectId, myRole]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers, count: members.length };
}