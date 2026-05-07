'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

// TODO: Replace with real status badge colors from your design system if needed
export default function ProjectHeader({ project }) {
  const statusClass =
    project.status === 'ACTIVE'
      ? styles.badgeActive
      : project.status === 'ARCHIVED'
      ? styles.badgeArchived
      : project.status === 'FINISHED'
      ? styles.badgeFinished
      : styles.badgeDefault

  return (
    <header className={styles.pdHeader}>
      <div className={styles.pdHeaderLeft}>
        {/* Project icon/emoji — you can replace this with a real icon or image */}
        <div className={styles.pdProjectIcon}>📊</div>
        <div>
          <h1 className={styles.pdTitle}>{project.name}</h1>
          {/* TODO: Replace project.type with your real field name from backend once added */}
          <div className={styles.pdMeta}>
            <span className={styles.projTypeBadgeDetails}>{(project.type || 'No Type').toString().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
            <span className={styles.pdDot}>·</span>
            <span className={styles.pdOwner}>Managed by {project.ownerName || '—'}</span>
          </div>
        </div>
      </div>
      <div className={styles.pdHeaderRight}>
        <span className={`${styles.badge} ${statusClass}`}>{project.status}</span>
      </div>
    </header>
  )
}
