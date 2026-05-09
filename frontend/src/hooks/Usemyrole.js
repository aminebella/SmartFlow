'use client';

import { useState, useEffect } from 'react';
import { getMyRole } from '@/services/projectService'; // ← réutilise ce qui existe

export function useMyRole(projectId) {
  const [myRole, setMyRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    getMyRole(projectId)
      .then((role) => setMyRole(role))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));

  }, [projectId]);

  return { myRole, loading, error };
}