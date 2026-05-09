'use client';

import styles from '@/styles/client/teams/teams.module.css';

function getInitials(member) {
  const first = member.firstName?.[0] ?? member.name?.[0] ?? '';
  const last = member.lastName?.[0] ?? '';
  return (first + last).toUpperCase() || '?';
}

function getAvatarColor(id) {
  const colors = ['#a08c4a', '#8a9e6b', '#c47a5a', '#6b3a1f', '#d4c48a'];
  return colors[id % colors.length];
}

export function MemberCard({ member, canManage, isRemoving, onRemove }) {
  const id = member.clientId ?? member.id;
  const initials = getInitials(member);
  const avatarColor = getAvatarColor(id);
  const role = member.role ?? 'MEMBER';

  return (
    <div className={styles.memberCard}>
      <div className={styles.cardAvatar} style={{ background: avatarColor }}>
        {initials}
      </div>

      <div className={styles.cardInfo}>
        <p className={styles.cardName}>
          {member.firstName ?? member.name} {member.lastName ?? ''}
        </p>
        <p className={styles.cardEmail}>{member.email}</p>
      </div>

      <div className={styles.memberMeta}>
        <span className={styles.rolePill} data-role={role.toLowerCase()}>
          {role}
        </span>

        {canManage && role !== 'MANAGER' && (
          <button
            className={styles.removeBtn}
            onClick={onRemove}
            disabled={isRemoving}
            title="Remove member"
          >
            {isRemoving ? <span className={styles.spinner} /> : '✕'}
          </button>
        )}
      </div>
    </div>
  );
}