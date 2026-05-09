'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'
import { Avatar } from '@/components/ui/Avatar'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ProjectTeam({ project }) {
  const members = Array.isArray(project.members) ? project.members : []

  return (
    <div className={styles.pdCard}>
      <div className={styles.cardHeader}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Team members
        <span className={styles.cardCount}>{members.length}</span>
      </div>

      {members.length === 0 ? (
        <p className={styles.pdTextEmpty}>No team members assigned yet.</p>
      ) : (
        <div className={styles.memberList}>
          {members.map((member, i) => (
            <div key={member.clientId ?? i} className={styles.memberRow}>
              <div className={styles.memberLeft}>

                {/* Avatar — affiche memberPicture ou initiales en fallback */}
                <Avatar
                  src={member.memberPicture}
                  name={member.fullName}
                  size={36}
                  className={styles.memberAv}
                />

                <div>
                  <div className={styles.memberName}>{member.fullName || '—'}</div>
                  <div className={styles.memberRole}>{member.role || '—'}</div>
                </div>
              </div>

              <div className={styles.memberRight}>
                <div className={styles.memberJoined}>
                  Joined {formatDate(member.joinedAt)}
                </div>
                {member.taskCount != null && (
                  <span className={styles.memberTasks}>{member.taskCount} tasks</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}