'use client'

import styles from '@/styles/admin/projects/projectsListAdmin.module.css'

export default function LoadingState() {
  return (
    <div className={styles.loadingState}>
      Loading projects…
    </div>
  )
}
