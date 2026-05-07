'use client';

import StatCard from './StatCard';
import styles from '@/styles/client/globalDashboard/DashboardStatCards.module.css';

/**
 * Renders the row of 6 stat cards on the client dashboard.
 *
 * Props:
 *  totalProjects    – total number of projects (all statuses)
 *  activeProjects   – number of currently ACTIVE projects
 *  lateProjects     – number of active projects considered "late"
 *  tasksDone        – completed tasks across active projects
 *  tasksTodo        – TODO tasks across active projects
 *  tasksInProgress  – IN_PROGRESS tasks
 *  productivity     – integer 0-100 (tasksDone / tasksTotal * 100)
 *  finishedProjects – number of FINISHED projects
 *  loading          – show skeleton while computing
 */
export default function DashboardStatCards({
  totalProjects,
  activeProjects,
  tasksDone,
  tasksTodo,
  productivity,
  finishedProjects,
  loading,
}) {
  return (
    <div className={styles.grid}>
      <StatCard
        title="Total projets"
        value={loading ? '…' : totalProjects}
        hint={`${finishedProjects} terminé${finishedProjects !== 1 ? 's' : ''}`}
        accentColor="#B8860B"
      />
      <StatCard
        title="Projets actifs"
        value={loading ? '…' : activeProjects}
        hint="En cours"
        accentColor="#639922"
      />
      <StatCard
        title="Tâches terminées"
        value={loading ? '…' : tasksDone}
        hint="Complétées"
        accentColor="#639922"
      />
      <StatCard
        title="Tâches à faire"
        value={loading ? '…' : tasksTodo}
        hint="À traiter"
        badgeType={tasksTodo > 0 ? 'danger' : 'success'}
        accentColor="#D85A30"
      />
      <StatCard
        title="Productivité"
        value={loading ? '…' : `${productivity}%`}
        hint="Tâches complétées / assignées"
        accentColor="#534AB7"
      />
    </div>
  );
}
