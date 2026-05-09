'use client'

import styles from '@/styles/admin/projects/projectsListAdmin.module.css'
import { Avatar } from '@/components/ui/Avatar'

/* ── helpers ── */
const AVATAR_COLORS = [
  '#3b82f6','#6366f1','#8b5cf6','#ec4899',
  '#f97316','#10b981','#14b8a6','#0ea5e9',
  '#a855f7','#22c55e','#f59e0b','#ef4444',
]

const ACCENT_COLORS = ['#E0A820','#378ADD','#2D7A4F','#A32D2D','#534AB7','#E0A820','#0F6E56']
function accentColor(id) { return ACCENT_COLORS[id % ACCENT_COLORS.length] }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function DeadlineBadge({ dateStr }) {
  if (!dateStr) return <span className={styles.deadlineCell}>—</span>
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  if (isNaN(diff)) return <span className={styles.deadlineCell}>{fmtDate(dateStr)}</span>

  let chipClass = ''
  let chipLabel = ''
  if (diff < 0) {
    chipClass = styles.deadlineLate
    chipLabel = `${Math.abs(diff)}d overdue`
  } else if (diff <= 7) {
    chipClass = styles.deadlineSoon
    chipLabel = `${diff}d left`
  }

  return (
    <div className={styles.deadlineCell}>
      <div>{fmtDate(dateStr)}</div>
      {chipLabel && <div className={chipClass} style={{ fontSize: 10, marginTop: 2 }}>{chipLabel}</div>}
    </div>
  )
}

export default function ProjectRow({ project, onView, onArchive, onRestore, isActing }) {
  const statusCfg = {
    ACTIVE:   { label: 'Active',   cls: styles.badgeActive   },
    ARCHIVED: { label: 'Archived', cls: styles.badgeArchived },
    FINISHED: { label: 'Finished', cls: styles.badgeFinished },
  }[project.status] ?? { label: project.status, cls: styles.badgeArchived }

  const color = accentColor(project.id)

  return (
    <tr>
      {/* Project name + description */}
      <td>
        <div className={styles.projNameWrap}>
          <div className={styles.projAccent} style={{ background: color }} />
          <div>
            <div className={styles.projName}>{project.name}</div>
            {project.description && (
              <div className={styles.projDesc}>
                {project.description.length > 45
                  ? project.description.slice(0, 45) + '…'
                  : project.description}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Project type */}
      <td>
        <div className={styles.projTypeBadge}>
          {(project.type || 'No Type').toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </div>
      </td>

      {/* Manager / owner — Avatar remplace imgUrl + initials manuel */}
      <td>
        <div className={styles.managerCell}>
          <Avatar
            src={project.ownerPicture}
            name={project.ownerName}
            size={28}
          />
          <span className={styles.managerName}>{project.ownerName || '—'}</span>
        </div>
      </td>

      {/* Member count */}
      <td>
        <span className={styles.memberCount}>{project.memberCount}</span>
        <span className={styles.memberSuffix}>member{project.memberCount !== 1 ? 's' : ''}</span>
      </td>

      {/* Status badge */}
      <td>
        <span className={`${styles.badge} ${statusCfg.cls}`}>{statusCfg.label}</span>
      </td>

      {/* Progression */}
      <td>
        <div className={styles.progressionCell}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${project.progress || 0}%`,
                backgroundColor: project.progress >= 75 ? '#E0A820' :
                                 project.progress >= 50 ? '#F4C430' :
                                 project.progress >= 25 ? '#FFE066' : '#FFF3B2'
              }}
            />
          </div>
          <div className={styles.progressText}>{project.progress || 0}%</div>
          <div className={styles.progressDetails}>{project.tasksDone || 0}/{project.taskCount || 0} tasks</div>
        </div>
      </td>

      {/* Member avatars stack — placeholders numeriques, pas de photo disponible ici */}
      <td>
        {project.memberCount > 0 ? (
          <div className={styles.avatarStack}>
            {Array.from({ length: Math.min(project.memberCount, 3) }).map((_, i) => (
              <div
                key={i}
                className={styles.avSm}
                style={{
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  width: 24, height: 24, fontSize: 9,
                  marginLeft: i > 0 ? -7 : 0,
                  zIndex: 3 - i,
                }}
              >
                {i + 1}
              </div>
            ))}
            {project.memberCount > 3 && (
              <div
                className={`${styles.avSm} ${styles.avCount}`}
                style={{ width: 24, height: 24, fontSize: 9, marginLeft: -7 }}
              >
                +{project.memberCount - 3}
              </div>
            )}
          </div>
        ) : (
          <span style={{ color: '#DDD', fontSize: 12 }}>—</span>
        )}
      </td>

      {/* Deadline */}
      <td>
        <DeadlineBadge dateStr={project.estimatedEndDate} />
      </td>

      {/* Actions */}
      <td>
        <div className={styles.actionBtns}>
          <button className={styles.btnIcon} title="View project" onClick={() => onView(project.id)} disabled={isActing}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>

          {project.status === 'ACTIVE' && (
            <button className={`${styles.btnIcon} ${styles.btnIconWarn}`} title="Archive project" onClick={() => onArchive(project.id)} disabled={isActing}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="21 8 21 21 3 21 3 8"/>
                <rect x="1" y="3" width="22" height="5" rx="1"/>
                <line x1="10" y1="12" x2="14" y2="12"/>
              </svg>
            </button>
          )}

          {(project.status === 'ARCHIVED' || project.status === 'FINISHED') && (
            <button className={`${styles.btnIcon} ${styles.btnIconSuccess}`} title="Restore project" onClick={() => onRestore(project.id, project.status)} disabled={isActing}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}