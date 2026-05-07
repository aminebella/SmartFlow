'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const avatarColors = [
  { bg: '#EEF0FB', color: '#4A52B8' },
  { bg: '#E6F4EC', color: '#2D7A4F' },
  { bg: '#FAECE7', color: '#993C1D' },
  { bg: '#FFF3DC', color: '#996B00' },
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#FBEAF0', color: '#993556' },
]

function Initials({ name, index }) {
  const c = avatarColors[index % avatarColors.length]
  const initials = name
    ? name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  return (
    <div className={styles.memberAv} style={{ background: c.bg, color: c.color }}>
      {initials}
    </div>
  )
}

export default function ProjectTeam({ project }) {
  // Use real members from project object (fetched by ProjectDetails)
  // Expected member shape: { id, name, role, joinedDate, taskCount? }
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
                <Initials name={member.fullName} index={i} />
                <div>
                  {/* TODO: field = member.name */}
                  <div className={styles.memberName}>{member.fullName || '—'}</div>
                  <div className={styles.memberRole}>
                    {/* TODO: field = member.role */}
                    {member.role || '—'}
                  </div>
                </div>
              </div>
              <div className={styles.memberRight}>
                {/* TODO: field = member.joinedDate — add this to your backend Member DTO */}
                <div className={styles.memberJoined}>
                  Joined {formatDate(member.joinedAt)}
                </div>
                {/* TODO: field = member.taskCount — optional, add if available */}
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
