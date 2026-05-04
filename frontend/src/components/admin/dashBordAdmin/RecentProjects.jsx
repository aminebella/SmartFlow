'use client';

import styles from '@/styles/admin/dashboard/RecentProjects.module.css';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};
const statusMeta = {
  ACTIVE: { label: 'Actif', color: '#3b82f6', bg: '#eff6ff' },
  FINISHED: { label: 'Terminé', color: '#22c55e', bg: '#f0fdf4' },
  ARCHIVED: { label: 'Archivé', color: '#6b7280', bg: '#f9fafb' },
};

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
function fmtDate(iso) {
  if (!iso) return '—';
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export default function RecentProjects() {
  const { role, loading: authLoading } = useAuth();
  const { projects, loading: projectsLoading, error } = useProjects(role, 'ACTIVE');

  const loading = authLoading || projectsLoading;
  const visibleProjects = Array.isArray(projects) ? projects.slice(0, 5) : [];

  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>Projets récents</h3>
          <a href="#" className={styles.link}>Voir tout →</a>
        </div>
        <div className={styles.table}>
          <div className={styles.skeletonRow}></div>
          <div className={styles.skeletonRow}></div>
          <div className={styles.skeletonRow}></div>
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
        <div className={styles.error}>
          Erreur lors du chargement des projets
        </div>
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
            const meta = statusMeta[project.status] ?? { label: project.status, color: '#6b7280', bg: '#f9fafb' };
            const progress = typeof project.progress === 'number' ? project.progress : 0;
            const membersCount = project.memberCount ?? project.members?.length ?? 0;

            return (
              <tr key={project.id}>
                <td className={styles.projectName}>{project.name || '—'}</td>
                <td className={styles.ownerName}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {project.ownerPicture ? (
                      <img
                        src={imgUrl(project.ownerPicture)}
                        alt={project.ownerName}
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#3b82f6', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 600
                      }}>
                        {project.ownerName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{project.ownerName || '—'}</span>
                  </div>
                </td>                <td>
                  <span
                    className={styles.badge}
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {meta.label}
                  </span>
                </td>
                <td className={styles.progressCell}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${progress}%`, background: meta.color }}
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
