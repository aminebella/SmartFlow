'use client';

import { FolderKanban, Users, CheckSquare, Zap } from 'lucide-react';
import styles from '@/styles/admin/dashboard/StatsWidget.module.css';
import { useEffect, useState } from 'react';
import dashboardAPI from '@/services/dashboardAdminService';

export default function StatsWidget() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let mounted = true;
    dashboardAPI
      .getSummary()
      .then((data) => {
        if (mounted) setSummary(data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`${styles.statCard} ${styles.skeleton}`} />
        ))}
      </div>
    );
  }

  const stats = [
    {
      key: 'activeProjects',
      label: 'Projets actifs',
      icon: FolderKanban,
      value: summary?.activeProjects ?? 0,
      positive: true,
    },
    {
      key: 'users',
      label: 'Utilisateurs',
      icon: Users,
      value: summary?.users ?? 0,
      positive: true,
    },
    {
      key: 'completedTasks',
      label: 'Tâches finies',
      icon: CheckSquare,
      value: summary?.tasksDone ?? 0,
      positive: true,
    },
    {
      key: 'productivity',
      label: 'Productivité',
      icon: Zap,
      value: `${(summary?.productivity ?? 0).toFixed(1)}%`,
      positive: null,
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map(({ key, label, icon: Icon, value }) => (
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