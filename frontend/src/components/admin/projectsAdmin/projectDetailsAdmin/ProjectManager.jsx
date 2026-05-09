'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'
import { Avatar } from '@/components/ui/Avatar'

export default function ProjectManager({ project }) {
  const name    = project.managerName    ?? project.ownerName    ?? null
  const email   = project.managerEmail   ?? null
  const role    = project.managerRole    ?? 'Project Manager'
  const picture = project.managerPicture ?? project.ownerPicture ?? null

  return (
    <div className={styles.pdCard}>
      <div className={styles.cardHeader}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Project manager
      </div>

      {!name ? (
        <p className={styles.pdTextEmpty}>No manager assigned.</p>
      ) : (
        <div className={styles.managerRow}>
          <Avatar
            src={picture}
            name={name}
            size={40}
            className={styles.managerAv}
          />
          <div className={styles.managerInfo}>
            <div className={styles.managerName}>{name}</div>
            <div className={styles.managerRole}>{role}</div>
            {email && (
              <a href={`mailto:${email}`} className={styles.managerEmail}>
                {email}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}