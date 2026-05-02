'use client';

import Link from 'next/link';
import { useState, useEffect} from 'react';

import Loading from '@/app/loading';
import StatCard from '@/components/client/globalDashboardClient/StatCard';
import GlobalClientHeader from '@/components/client/layoutClient/GlobalClientHeader';
import ProjectsList from '@/components/client/projectsClient/ProjectsList';

import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { getTicketsByStatus } from '@/services/taskService.js';

// Client dashboard: shows user greeting, stats and a short list of projects.
export default function EspaceClientDashboard() {
  // Get current user and loading state from central auth hook
  const { user, loading: authLoading } = useAuth();

  // Fetch projects for the current role (CLIENT)
  const { projects = [], loading: projectsLoading, error, refetch } = useProjects('CLIENT');

  // Compute ticket counts across projects (simple aggregation)
  const [ticketsOpen, setTicketsOpen] = useState(0);
  const [ticketsInProgress, setTicketsInProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const compute = async () => {
      try {
        let open = 0, inProgress = 0;
        for (const p of projects || []) {
          try {
            const openList = await getTicketsByStatus(p.id, 'TODO');
            const inProgList = await getTicketsByStatus(p.id, 'IN_PROGRESS');
            open += Array.isArray(openList) ? openList.length : (openList?.data?.length || 0);
            inProgress += Array.isArray(inProgList) ? inProgList.length : (inProgList?.data?.length || 0);
          } catch (e) {
            // ignore per-project failure
          }
        }
        if (!mounted) return;
        setTicketsOpen(open);
        setTicketsInProgress(inProgress);
      } catch (e) {
        console.error(e);
      }
    };
    compute();
    return () => { mounted = false; };
  }, [projects]);

  // Derived values
  const totalProjects = (projects && projects.length) || 0;
  const totalTickets = ticketsOpen + ticketsInProgress;

  // Recent projects: keep last 3 (or fewer)
  const recentProjects = (projects && projects.length > 0)
    ? (projects.length <= 3 ? projects : projects.slice(-3).reverse())
    : [];

  // Loading fallback
  if (authLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <GlobalClientHeader />
        <Loading/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <GlobalClientHeader />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="mb-7">
          <h1 className="font-syne text-2xl font-bold text-slate-900 mb-1">Bonjour, {user?.fullName?.split(' ')[0] || 'vous'}</h1>
          <p className="text-sm text-slate-500">Voici un résumé de vos projets actifs</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3 mb-7">
          <StatCard title="Projets" value={totalProjects} hint="Total projets" accent />
          <StatCard title="Tickets ouverts" value={ticketsOpen} hint="À traiter" />
          <StatCard title="En cours" value={ticketsInProgress} hint="En développement" />
          <StatCard title="Total tickets" value={totalTickets} hint="Ouverts + en cours" />
        </div>

        {/* Projects list — show recent projects */}
        <ProjectsList projects={recentProjects} limit={3} title="Mes derniers projets" />

        {/* See all link if more projects exist */}
        {projects.length > 3 && (
          <div className="mt-4 text-right">
            <Link href="/EspaceClient/projects" className="text-sm text-blue-600 hover:underline">Voir tous les projets</Link>
          </div>
        )}
      </div>
    </div>
  );
}