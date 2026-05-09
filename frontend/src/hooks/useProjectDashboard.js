'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProjectDashboard } from '@/services/projectService';

/**
 * Hook for the project-specific dashboard.
 * Usage: const { dashboard, loading, error, refetch } = useProjectDashboard(projectId);
 *
 * `dashboard` shape mirrors ProjectDashboardSummary.java:
 * {
 *   sprintProgress,   tasksDone,   activeTasks,   teamMemberCount,
 *   activeSprints: [{ id, title, goal, startDate, endDate, status,
 *                     doneTasks, totalTasks, progress, tasksByStatus }],
 *   members:       [{ clientId, fullName, postTitle, role, assignedTasks }],
 *   tasks:         [{ id, title, priority, status, assignedUserId,
 *                     assignedUserFullName, sprintId }]
 * }
 */
export function useProjectDashboard(projectId) {
  const [dashboard, setDashboard] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetch = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProjectDashboard(projectId);
      setDashboard(data);
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { dashboard, loading, error, refetch: fetch };
}