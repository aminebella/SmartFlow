'use client'

import styles from '@/styles/admin/projects/projectsListAdmin.module.css'

export default function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📂</div>
      <div className={styles.emptyTitle}>No projects found</div>
      <div>Try adjusting your search or filter criteria</div>
    </div>
  )
}
