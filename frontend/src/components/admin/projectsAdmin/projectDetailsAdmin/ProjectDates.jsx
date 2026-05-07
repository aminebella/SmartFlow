'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function DaysRemaining({ endDate }) {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
  if (isNaN(diff)) return null
  if (diff < 0) return <span className={styles.dateLate}>{Math.abs(diff)}d overdue</span>
  if (diff <= 7) return <span className={styles.dateSoon}>{diff}d left</span>
  return <span className={styles.dateOk}>{diff}d remaining</span>
}

export default function ProjectDates({ project }) {
  return (
    <div className={styles.pdCard}>
      <div className={styles.cardHeader}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Timeline
      </div>

      <div className={styles.datesGrid}>
        {/* Estimated dates — from backend fields estimatedStartDate / estimatedEndDate */}
        {/* Estimated dates — fields: project.estimatedStartDate / project.estimatedEndDate */}
        <div className={styles.dateGroup}>
          <div className={styles.dateGroupLabel}>Estimated</div>
          <div className={styles.dateRow}>
            <div className={styles.dateItem}>
              <div className={styles.statLabel}>Start</div>
              <div className={styles.statValue}>{formatDate(project.estimatedStartDate)}</div>
            </div>
            <div className={styles.dateSeparator}>→</div>
            <div className={styles.dateItem}>
              <div className={styles.statLabel}>Deadline</div>
              <div className={styles.statValue}>{formatDate(project.estimatedEndDate)}</div>
              {/* Days remaining badge — shown whenever project is not yet finished */}
              {project.status !== 'FINISHED' && (
                <DaysRemaining endDate={project.estimatedEndDate} />
              )}
            </div>
          </div>
        </div>

        <div className={styles.dateDivider} />

        {/* Real dates — fields: project.realStartDate / project.realEndDate */}
        <div className={styles.dateGroup}>
          <div className={styles.dateGroupLabel}>Actual</div>
          <div className={styles.dateRow}>
            <div className={styles.dateItem}>
              <div className={styles.statLabel}>Start</div>
              <div className={styles.statValue}>{formatDate(project.realStartDate)}</div>
            </div>
            <div className={styles.dateSeparator}>→</div>
            <div className={styles.dateItem}>
              <div className={styles.statLabel}>End</div>
              <div className={styles.statValue}>{formatDate(project.realEndDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
