'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import Loading from '@/app/loading';
import GlobalClientHeader from '@/components/client/layoutClient/GlobalClientHeader';

// New dashboard components
import DashboardGreeting    from '@/components/client/globalDashboardClient/DashboardGreeting';
import DashboardStatCards   from '@/components/client/globalDashboardClient/DashboardStatCards';
import DashboardProjects    from '@/components/client/globalDashboardClient/DashboardProjects';
import DashboardTasks       from '@/components/client/globalDashboardClient/DashboardTasks';
import DashboardDonut       from '@/components/client/globalDashboardClient/DashboardDonut';

import { useAuth }     from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import clientDashboardService from '@/services/clientDashboardService.js';

export default function EspaceClientDashboard() {
  const { user, loading: authLoading } = useAuth();

  // Dashboard state from new backend service
  const [dashboardData, setDashboardData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Active projects for the project list
  const { projects: activeProjects = [], loading: projectsLoading } = useProjects('CLIENT', 'ACTIVE');

  // ── Fetch dashboard summary from backend ────────────────────────────
  useEffect(() => {
    let mounted = true;
    setStatsLoading(true);

    clientDashboardService.getClientSummary()
      .then(data => {
        if (mounted) {
          setDashboardData(data);
        }
      })
      .catch(error => {
        console.error('Failed to fetch client dashboard summary:', error);
      })
      .finally(() => {
        if (mounted) setStatsLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────
  const totalProjects    = dashboardData?.totalProjects ?? 0;
  const finishedProjects = dashboardData?.finishedProjects ?? 0;
  const productivity     = dashboardData?.productivity ?? 0;

  // Recent projects shown in the dashboard list (last 3)
  const recentProjects = activeProjects.length <= 3
    ? activeProjects
    : activeProjects.slice(-3).reverse();

  if (authLoading || projectsLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#EEF0F3' }}>
        <GlobalClientHeader />
        <Loading />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EEF0F3' }}>
      <GlobalClientHeader />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* ── Greeting ── */}
        <DashboardGreeting user={user} />

        {/* ── Stat cards row ── */}
        <DashboardStatCards
          totalProjects={totalProjects}
          activeProjects={dashboardData?.activeProjects ?? 0}
          tasksDone={dashboardData?.tasksDone ?? 0}
          tasksTodo={dashboardData?.tasksTodo ?? 0}
          productivity={productivity}
          finishedProjects={finishedProjects}
          loading={statsLoading}
        />

        {/* ── Main 2-column grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', marginBottom: '16px' }}>

          {/* Left: recent projects */}
          <DashboardProjects
            projects={recentProjects}
            showSeeAll={activeProjects.length > 3}
          />

          {/* Right: tasks to do */}
          <DashboardTasks tasks={dashboardData?.recentTasks ?? []} loading={statsLoading} />
        </div>

              </div>
    </div>
  );
}