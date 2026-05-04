'use client';

import React from "react";
// import { useParams, useRouter } from "next/navigation";

import StatsGrid        from "@/components/client/projectDashboardClient/StatsGrid";
import ActiveSprint     from "@/components/client/projectDashboardClient/ActiveSprint";
import TeamMembers      from "@/components/client/projectDashboardClient/TeamMembers";
import RecentTickets    from "@/components/client/projectDashboardClient/RecentTickets";
import ActivityTimeline from "@/components/client/projectDashboardClient/ActivityTimeline";

import "@/styles/client/projectDashboard/dashboard.css";


export default function EspaceClientProjectDashboard() {
  // const { id } = useParams();
  // const router = useRouter();

  return (
    <div className="dashboard-root">

      {/* ── Page header ─────────────────────────── */}
      <div className="section-hdr">
        <div className="section-hdr-left">
          <h2>Project Overview</h2>
          <p>Sprint 4 · March 1 – 22, 2026 · 10 days remaining</p>
        </div>
        <div className="section-hdr-actions">
          <button className="btn btn-outline">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="2" width="10" height="9" rx="1" />
              <line x1="4" y1="1" x2="4" y2="4" />
              <line x1="8" y1="1" x2="8" y2="4" />
              <line x1="1" y1="6" x2="11" y2="6" />
            </svg>
            View Timeline
          </button>
          <button className="btn btn-primary">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 1l1.1 2.2 2.6.4-1.9 1.8.4 2.6L6 6.8 3.8 8l.4-2.6L2.3 3.6l2.6-.4z" />
            </svg>
            AI Analysis
          </button>
        </div>
      </div>

      {/* ── KPI stats ───────────────────────────── */}
      <StatsGrid />

      {/* ── Sprint overview + Team ───────────────── */}
      <div className="two-col">
        <ActiveSprint />
        <TeamMembers />
      </div>

      {/* ── Recent tickets + Activity ────────────── */}
      <div className="two-col">
        <RecentTickets />
        <ActivityTimeline />
      </div>

    </div>
  );
}