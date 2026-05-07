'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function ProjectManager({ project }) {
  // TODO: fields needed from your Spring DTO:
  //   project.managerName   — full name of the project manager
  //   project.managerEmail  — email address
  //   project.managerRole   — optional, e.g. "Project Manager" (fallback used if missing)
  //
  // If your backend returns a nested object, adapt like:
  //   project.manager.name, project.manager.email, etc.

  const name  = project.managerName  ?? project.ownerName ?? null
  const email = project.managerEmail ?? null
  const role  = project.managerRole  ?? 'Project Manager'

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
          <div className={styles.managerAv}>
            {getInitials(name)}
          </div>
          <div className={styles.managerInfo}>
            <div className={styles.managerName}>{name}</div>
            <div className={styles.managerRole}>{role}</div>
            {email && (
              <a
                href={`mailto:${email}`}
                className={styles.managerEmail}
              >
                {email}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
