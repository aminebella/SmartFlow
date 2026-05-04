'use client';

import { FolderKanban, Users, CheckSquare, Zap } from 'lucide-react';
import styles from '@/styles/admin/dashboard/StatsWidget.module.css';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';

import { useClients } from '@/hooks/useClient';
export default function StatsWidget() {
  const { role, loading: authLoading } = useAuth();

  const { projects, loading: projectsLoading } = useProjects(role, 'ACTIVE');

  const { count: clientsCount, loading: clientsLoading } = useClients(role);

  const loading = authLoading || projectsLoading || clientsLoading;

  const stats = [
    {
      key: 'activeProjects',
      label: 'Projets actifs',
      icon: FolderKanban,
      value: projects.length,
      positive: true,
    },
    {
      key: 'users',
      label: 'Utilisateurs',
      icon: Users,
      value: clientsCount,
      positive: true,
    },
    {
      key: 'completedTasks',
      label: 'Tâches finies',
      icon: CheckSquare,
      value: 1284,
      positive: true,
    },
    {
      key: 'productivity',
      label: 'Productivité',
      icon: Zap,
      value: '98.4%',
      positive: null,
    },
  ];

  if (loading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.statCard} ${styles.skeleton}`} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsGrid}>
      {stats.map(({ key, label, icon: Icon, value, change, positive }) => (
        <div key={key} className={styles.statCard}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>{label}</span>
            <Icon size={16} className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </div>
        </div>
      ))}
    </div>
  );
}