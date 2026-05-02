"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';

import Loading from '@/app/loading';
import TopNavbar from '@/components/client/layoutClient/GlobalClientHeader';
import ProjectsClientList from '@/components/client/projectsClient/ProjectsClientList';


export default function ProjectsListPage() {
  const { user, loading: authLoading } = useAuth();
  const { projects = [], loading: projectsLoading, error } = useProjects('CLIENT');

  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('name');

  // Filter and sort projects client-side
  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects
      .filter(p => !query || (p.name || '').toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (a[sort] > b[sort] ? 1 : -1));
  }, [projects, query, sort]);

  // Loading and error handling
  if (authLoading || projectsLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopNavbar />
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Mes projets</h1>
          <div className="flex items-center gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..."
              className="px-3 py-2 border border-slate-200 rounded-lg" />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 border rounded-lg">
              <option value="name">Nom</option>
              <option value="status">Statut</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="text-red-600">{error?.message || error}</div>
        ) : (
          <ProjectsClientList projects={filtered} />
        )}
      </div>
    </div>
  );
}
