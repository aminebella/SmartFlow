'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

// TODO: import your real service functions
// import { archiveProject, restoreProject, restoreFinishedProject } from '@/services/projectService'

export default function ProjectActions({ project, onProjectUpdate }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isArchived = project.status === 'ARCHIVED'
  const isFinished = project.status === 'FINISHED'
  const isActive = project.status === 'ACTIVE'

  const handleArchive = async () => {
    if (!confirm('Archive this project? It will be hidden from active views.')) return
    setLoading(true)
    try {
      // TODO: call your archive API
      // await archiveProject(project.id)
      console.log('Archive project', project.id)
      onProjectUpdate?.()
    } catch {
      alert('Failed to archive project.')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!confirm('Restore this project to active status?')) return
    setLoading(true)
    try {
      // TODO: call your restore API depending on status
      // if (isFinished) await restoreFinishedProject(project.id)
      // else await restoreProject(project.id)
      console.log('Restore project', project.id)
      onProjectUpdate?.()
    } catch {
      alert('Failed to restore project.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.pdCard}>
      <div className={styles.cardHeader}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
        </svg>
        Actions
      </div>

      <div className={styles.actionsGrid}>
        <button
          className={styles.btnSecondary}
          onClick={() => router.push('/EspaceAdmin/projects')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to projects
        </button>

        {isActive && (
          <button
            className={styles.btnArchive}
            onClick={handleArchive}
            disabled={loading}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="21 8 21 21 3 21 3 8"/>
              <rect x="1" y="3" width="22" height="5"/>
              <line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            {loading ? 'Archiving…' : 'Archive project'}
          </button>
        )}

        {(isArchived || isFinished) && (
          <button
            className={styles.btnRestore}
            onClick={handleRestore}
            disabled={loading}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
            </svg>
            {loading ? 'Restoring…' : 'Restore project'}
          </button>
        )}
      </div>
    </div>
  )
}
