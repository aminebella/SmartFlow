"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

import { useAuth }     from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';

import Loading                from '@/app/loading';
import GlobalClientHeader     from '@/components/client/layoutClient/GlobalClientHeader';
import ProjectsPageList       from '@/components/client/projectsClient/ProjectsPageList';

import styles from '@/styles/client/MyListOfprojects/ProjectsPage.module.css';

export default function ProjectsListPage() {
  const { user, loading: authLoading } = useAuth();

  // Fetch ALL projects for this client (no status filter — we filter client-side)
  const { projects = [], loading: projectsLoading, error } = useProjects('CLIENT');

  const [query,  setQuery]  = useState('');
  const [sort,   setSort]   = useState('name');
  const [status, setStatus] = useState('all');   // 'all' | 'ACTIVE' | 'ARCHIVED' | 'FINISHED'
  const [tab,    setTab]    = useState('all');   // 'all' | 'manager' | 'member'

  // ── Counts for tab badges ──────────────────────────────────────────────
  const managerCount = projects.filter(p => p.myRole === 'MANAGER').length;
  const memberCount  = projects.filter(p => p.myRole === 'MEMBER').length;

  // ── Filter + sort (client-side) ────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects
      .filter(p => {
        const matchQuery  = !query  || (p.name || '').toLowerCase().includes(query.toLowerCase());
        const matchStatus = status === 'all' || p.status === status;
        // tab filter uses myRole — backend must include myRole in ProjectResponse for /projects/my
        // see NOTE in DashboardProjects.jsx
        const matchTab    = tab === 'all'
          || (tab === 'manager' && p.myRole === 'MANAGER')
          || (tab === 'member'  && p.myRole === 'MEMBER');
        return matchQuery && matchStatus && matchTab;
      })
      .sort((a, b) => {
        if (sort === 'name')        return (a.name || '').localeCompare(b.name || '');
        if (sort === 'progression') return (b.progression ?? 0) - (a.progression ?? 0);
        if (sort === 'status')      return (a.status || '').localeCompare(b.status || '');
        return 0;
      });
  }, [projects, query, sort, status, tab]);

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

      <div className={styles.pageWrapper}>

        {/* ── Page header ── */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Mes projets</h1>
            <p className={styles.pageSub}>
              {projects.length} projet{projects.length !== 1 ? 's' : ''} · Dernière mise à jour à l&apos;instant
            </p>
          </div>
          <Link href="/EspaceClient/projects/new" className={styles.createButton}>
            + Créer un projet
          </Link>
        </div>

        {/* ── Role tabs ── */}
        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            {[
              { key: 'all',     label: 'Tous',     count: projects.length },
              { key: 'manager', label: 'Manager',  count: managerCount, countColor: '#3C3489' },
              { key: 'member',  label: 'Membre',   count: memberCount,  countColor: '#854F0B' },
            ].map(t => (
              <button
                key={t.key}
                className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                <span
                  className={styles.tabBadge}
                  style={tab === t.key && t.countColor ? { background: t.countColor } : {}}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className={styles.filterBar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              className={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher un projet ou manager…"
            />
          </div>

          <select
            className={styles.select}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="FINISHED">Terminé</option>
            <option value="ARCHIVED">Archivé</option>
          </select>

          <select
            className={styles.select}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="name">Trier : Nom</option>
            <option value="progression">Trier : Progression</option>
            <option value="status">Trier : Statut</option>
          </select>
        </div>

        {/* ── Project list ── */}
        {error ? (
          <div className={styles.errorMsg}>{error?.message || String(error)}</div>
        ) : (
          <ProjectsPageList projects={filtered} />
        )}
      </div>
    </div>
  );
}