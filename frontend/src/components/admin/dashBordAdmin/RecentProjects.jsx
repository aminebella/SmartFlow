'use client';

import styles from '@/styles/admin/dashboard/RecentProjects.module.css';
import { useProjects } from '@/hooks/useProjects';
import { useAuth }     from '@/hooks/useAuth';
import { Avatar }      from '@/components/ui/Avatar';

const statusMeta = {
  ACTIVE:   { label: 'Active',   color: '#2D7A4F', bg: '#E6F4EC' },
  FINISHED: { label: 'Finished', color: '#4A52B8', bg: '#EEF0FB' },
  ARCHIVED: { label: 'Archived', color: '#5F5E5A', bg: '#F1EFE8' },
};

const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function RecentProjects() {
  const { role, loading: authLoading }         = useAuth();
  const { projects, loading: projectsLoading, error } = useProjects(role, 'ACTIVE');

  const loading         = authLoading || projectsLoading;
  const visibleProjects = Array.isArray(projects) ? projects.slice(0, 5) : [];

  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>Projets récents</h3>
          <a href="#" className={styles.link}>Voir tout →</a>
        </div>
        <div className={styles.table}>
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>Projets récents</h3>
          <a href="#" className={styles.link}>Voir tout →</a>
        </div>
        <div className={styles.error}>Erreur lors du chargement des projets</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Projets récents</h3>
        <a href="/EspaceAdmin/projects" className={styles.link}>Voir tout →</a>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nom du projet</th>
            <th>Chef de projet</th>
            <th>Statut</th>
            <th>Progression</th>
            <th>Membres</th>
            <th>Échéance</th>
          </tr>
        </thead>
        <tbody>
          {visibleProjects.map((project) => {
            const meta         = statusMeta[project.status] ?? { label: project.status, color: '#6b7280', bg: '#f9fafb' };
            const progress     = typeof project.progress === 'number' ? project.progress : 0;
            const membersCount = project.memberCount ?? project.members?.length ?? 0;

            return (
              <tr key={project.id}>
                <td className={styles.projectName}>{project.name || '—'}</td>

                <td className={styles.ownerName}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar src={project.ownerPicture} name={project.ownerName} size={28} />
                    <span>{project.ownerName || '—'}</span>
                  </div>
                </td>

                <td>
                  <span className={styles.badge} style={{ color: meta.color, background: meta.bg }}>
                    {meta.label}
                  </span>
                </td>

                <td className={styles.progressCell}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress >= 75 ? '#E0A820' :
                                         progress >= 50 ? '#F4C430' :
                                         progress >= 25 ? '#FFE066' : '#FFF3B2',
                      }}
                    />
                  </div>
                  <span className={styles.progressLabel}>{progress}%</span>
                </td>

                <td className={styles.members}>{membersCount}</td>
                <td className={styles.deadline}>{fmtDate(project.estimatedEndDate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}