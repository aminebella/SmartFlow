'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

export default function ProjectDescription({ project }) {
  return (
    <div className={styles.pdCard}>
      <div className={styles.cardHeader}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
          <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
        </svg>
        Description
      </div>
      {/* TODO: field = project.description */}
      {project.description ? (
        <p className={styles.pdText}>{project.description}</p>
      ) : (
        <p className={styles.pdTextEmpty}>No description provided for this project.</p>
      )}
    </div>
  )
}
