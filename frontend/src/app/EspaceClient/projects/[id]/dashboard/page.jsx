'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useProjectDashboard } from '@/hooks/useProjectDashboard';

import StatsGrid    from '@/components/client/projectDashboardClient/StatsGrid';
import ActiveSprint from '@/components/client/projectDashboardClient/ActiveSprint';
import TeamMembers  from '@/components/client/projectDashboardClient/TeamMembers';
import RecentTasks  from '@/components/client/projectDashboardClient/RecentTasks';

import '@/styles/client/projectDashboard/dashboard.css';

export default function EspaceClientProjectDashboard() {
  const { id }   = useParams();           // project id from URL
  const router   = useRouter();
  const projectId = Number(id);

  const { dashboard, loading, error } = useProjectDashboard(projectId);

  // ── Loading skeleton ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="dashboard-root">
        <div className="dash-loading">Loading dashboard…</div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="dashboard-root">
        <div className="dash-error">Failed to load dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">

      {/* ── Page header ─────────────────────────── */}
      <div className="section-hdr">
        <div className="section-hdr-left">
          <h2>Project Overview</h2>
          {/* Show active sprint title in subtitle if there is one */}
          {dashboard?.activeSprints?.length > 0 && (
            <p>
              {dashboard.activeSprints[0].title}
              {dashboard.activeSprints[0].startDate && ` · ${dashboard.activeSprints[0].startDate}`}
              {dashboard.activeSprints[0].endDate   && ` – ${dashboard.activeSprints[0].endDate}`}
            </p>
          )}
        </div>
        <div className="section-hdr-actions">
          {/* Redirect to sprints list */}
          <button
            className="btn btn-outline"
            onClick={() => router.push(`/EspaceClient/projects/${projectId}/sprints`)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="2" width="10" height="9" rx="1" />
              <line x1="4" y1="1" x2="4" y2="4" />
              <line x1="8" y1="1" x2="8" y2="4" />
              <line x1="1" y1="6" x2="11" y2="6" />
            </svg>
            View Sprints
          </button>
          <button
            className="btn btn-primary"
            onClick={() => router.push(`/EspaceClient/projects/${projectId}/ai`)}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 1l1.1 2.2 2.6.4-1.9 1.8.4 2.6L6 6.8 3.8 8l.4-2.6L2.3 3.6l2.6-.4z" />
            </svg>
            AI Analysis
          </button>
        </div>
      </div>

      {/* ── KPI stats ───────────────────────────── */}
      <StatsGrid dashboard={dashboard} />

      {/* ── Active sprint + Team ─────────────────── */}
      <div className="two-col">
        <ActiveSprint
          sprints={dashboard?.activeSprints ?? []}
          projectId={projectId}
          router={router}
        />
        <TeamMembers members={dashboard?.members ?? []} />
      </div>

      {/* ── Task list ────────────────────────────── */}
      <RecentTasks tasks={dashboard?.tasks ?? []} projectId={projectId} router={router} />

    </div>
  );
}