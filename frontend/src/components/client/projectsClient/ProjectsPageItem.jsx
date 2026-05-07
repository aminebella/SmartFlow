// For the /projects page (NOT the dashboard)
"use client";

import Link  from 'next/link';
import Image from 'next/image';
import styles from '@/styles/client/MyListOfprojects/ProjectsPageItem.module.css';

// ── Helpers ──────────────────────────────────────────────────────────────

function initials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

function statusConfig(status) {
  switch (status) {
    case 'ACTIVE':   return { label: 'Actif',    cls: 'active' };
    case 'FINISHED': return { label: 'Terminé',  cls: 'done' };
    case 'ARCHIVED': return { label: 'Archivé',  cls: 'archived' };
    default:         return { label: status,     cls: 'archived' };
  }
}

function roleConfig(role) {
  switch (role) {
    case 'MANAGER': return { label: 'Manager', cls: 'manager' };
    case 'MEMBER':  return { label: 'Membre',  cls: 'member' };
    default:        return null;
  }
}

function progressColor(pct, status) {
  if (status === 'ARCHIVED') return '#B4B2A9';
  if (pct >= 75) return '#639922';
  if (pct >= 40) return '#B8860B';
  return '#D85A30';
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * Props: project (ProjectResponse from backend)
 *
 * Fields used:
 *  id, name, description, status, progression, myRole, memberCount, members
 *
 * NOTE – myRole & memberCount must be present in your Spring ProjectResponse DTO.
 * If members array is returned (with fullName/avatar), avatars will show.
 * Otherwise memberCount is used for the "+N membres" label.
 */
export default function ProjectsPageItem({ project }) {
  const pct    = project.progression ?? 0;
  const st     = statusConfig(project.status);
  const rl     = roleConfig(project.myRole);
  const color  = progressColor(pct, project.status);

  // Members: show up to 3 avatars + overflow badge
  const members        = Array.isArray(project.members) ? project.members : [];
  const visibleMembers = members.slice(0, 3);
  const extraCount     = Math.max(0, (project.memberCount ?? members.length) - visibleMembers.length);
  // Fallback label when no members array is returned
  const memberLabel    = project.memberCount != null
    ? `${project.memberCount} membre${project.memberCount !== 1 ? 's' : ''}`
    : members.length > 0
      ? `${members.length} membre${members.length !== 1 ? 's' : ''}`
      : null;

  return (
    <div className={styles.item}>

      {/* Left accent stripe — colored by status */}
      <div
        className={styles.stripe}
        style={{ background: st.cls === 'active' ? '#B8860B' : st.cls === 'done' ? '#639922' : '#B4B2A9' }}
      />

      {/* Project icon */}
      <div className={styles.icon}>
        {initials(project.name || '')}
      </div>

      {/* Main info block */}
      <div className={styles.body}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{project.name}</span>
        </div>
        <p className={styles.desc}>{project.description || '—'}</p>

        {/* Member avatars row */}
        <div className={styles.membersRow}>
          {visibleMembers.length > 0 ? (
            <>
              <div className={styles.avatarStack}>
                {visibleMembers.map((m, i) => (
                  <div
                    key={i}
                    className={styles.avatar}
                    title={m.fullName || m.email || `Membre ${i + 1}`}
                  >
                    {m.avatar ? (
                      <Image
                        src={m.avatar}
                        alt={m.fullName || 'Membre'}
                        width={24}
                        height={24}
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {(m.fullName || m.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                ))}
                {extraCount > 0 && (
                  <div className={styles.avatarExtra}>+{extraCount}</div>
                )}
              </div>
              {memberLabel && (
                <span className={styles.memberLabel}>{memberLabel}</span>
              )}
            </>
          ) : memberLabel ? (
            <span className={styles.memberLabel}>{memberLabel}</span>
          ) : null}
        </div>
      </div>

      {/* Right side: pills + progress + button */}
      <div className={styles.right}>

        {/* Status + role pills */}
        <div className={styles.pills}>
          <span className={`${styles.pill} ${styles[`status_${st.cls}`]}`}>
            {st.label}
          </span>
          {rl && (
            <span className={`${styles.pill} ${styles[`role_${rl.cls}`]}`}>
              {rl.label}
            </span>
          )}
        </div>

        {/* Progress bar + % */}
        <div className={styles.progRow}>
          <div className={styles.progTrack}>
            <div
              className={styles.progFill}
              style={{ width: `${pct}%`, background: color }}
            />
          </div>
          <span className={styles.progPct}>{pct}%</span>
        </div>

        {/* Open button */}
        <Link
          href={`/EspaceClient/projects/${project.id}/dashboard`}
          className={styles.openBtn}
        >
          Ouvrir →
        </Link>
      </div>
    </div>
  );
}

