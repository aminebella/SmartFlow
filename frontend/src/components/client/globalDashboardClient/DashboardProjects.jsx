'use client';

import Link from 'next/link';
import styles from '@/styles/client/globalDashboard/DashboardProjects.module.css';

// Generates 2-letter initials from a project name
function initials(name = '') {
  const words = name.trim().split(/\s+/);
  return words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

// Status pill label + style key
function statusInfo(status) {
  switch (status) {
    case 'ACTIVE':   return { label: 'Actif',    cls: 'active' };
    case 'FINISHED': return { label: 'Terminé',  cls: 'done' };
    case 'ARCHIVED': return { label: 'Archivé',  cls: 'archived' };
    default:         return { label: status,     cls: 'archived' };
  }
}

// Role pill label + style key
function roleInfo(role) {
  switch (role) {
    case 'MANAGER': return { label: 'Manager', cls: 'manager' };
    case 'MEMBER':  return { label: 'Membre',  cls: 'member' };
    default:        return { label: role,      cls: 'member' };
  }
}

// Progress bar color based on completion %
function progressColor(pct) {
  if (pct >= 75) return '#639922';
  if (pct >= 40) return '#B8860B';
  return '#D85A30';
}

/**
 * Props:
 *  projects  – array of ProjectResponse objects from backend
 *  showSeeAll – boolean, show "Voir tous →" link
 *
 * ProjectResponse shape (from your backend):
 *  { id, name, description, status, progression, memberCount, myRole, ... }
 *
 * NOTE: `myRole` and `memberCount` must be returned by GET /projects/my.
 * If your backend doesn't return them yet, add them to ProjectResponse DTO:
 *   - myRole     : String  ("MANAGER" | "MEMBER")
 *   - memberCount: int
 */
export default function DashboardProjects({ projects = [], showSeeAll = false }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Mes Projets</h3>
        <div className={styles.headerActions}>
          <Link href="/EspaceClient/projects/new" className={styles.addBtn} title="Créer un projet">
            + Créer
          </Link>
          {showSeeAll && (
            <Link href="/EspaceClient/projects" className={styles.seeAll}>
              Voir tous →
            </Link>
          )}
        </div>
      </div>

      <div className={styles.list}>
        {projects.length === 0 && (
          <p className={styles.empty}>Aucun projet actif pour le moment.</p>
        )}

        {projects.map(p => {
          const pct  = p.progression ?? 0;
          const st   = statusInfo(p.status);
          // myRole comes from backend — see NOTE above
          const rl   = roleInfo(p.myRole ?? 'MEMBER');
          // memberCount comes from backend — see NOTE above
          const mc   = p.memberCount ?? '–';

          return (
            <Link
              key={p.id}
              href={`/EspaceClient/projects/${p.id}/dashboard`}
              className={styles.row}
            >
              {/* Icon */}
              <div className={styles.icon}>
                {initials(p.name)}
              </div>

              {/* Info */}
              <div className={styles.info}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.meta}>
                  {/* memberCount: backend must include this in ProjectResponse */}
                  {mc} membre{mc !== 1 ? 's' : ''}
                </span>
                <div className={styles.progBar}>
                  <div
                    className={styles.progFill}
                    style={{ width: `${pct}%`, background: progressColor(pct) }}
                  />
                </div>
              </div>

              {/* Right side */}
              <div className={styles.right}>
                <span className={`${styles.pill} ${styles[`status_${st.cls}`]}`}>
                  {st.label}
                </span>
                {/* myRole: backend must include this in ProjectResponse for /projects/my */}
                <span className={`${styles.pill} ${styles[`role_${rl.cls}`]}`}>
                  {rl.label}
                </span>
                <span className={styles.pct}>{pct}%</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
