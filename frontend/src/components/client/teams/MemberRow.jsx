'use client';

import styles from '@/styles/client/teams/teams.module.css';
import { Avatar } from '@/components/ui/Avatar';

export function MemberRow({ m, canManage, removingId, onRemove }) {
  const clientId   = m.clientId ?? m.id;
  const name       = m.fullName || m.name || m.email || 'Utilisateur';
  const email      = m.email || '';
  const role       = m.role || m.projectRole || 'MEMBER';
  const isManager  = role === 'MANAGER';
  const isRemoving = removingId === clientId;

  return (
    <div className={styles.memberRow}>

      {/* Avatar + name */}
      <div className={`${styles.memberCell} ${styles['memberCell--wide']}`}>
        <Avatar src={m.memberPicture} name={name} size={36} />
        <div>
          <div className={styles.memberName}>{name}</div>
          <div className={styles.memberEmail}>{email}</div>
        </div>
      </div>

      {/* Role */}
      <div className={styles.memberCell}>
        <span className={`${styles.roleBadgeBase} ${styles[isManager ? 'roleBadge--managerRow' : 'roleBadge--memberRow']}`}>
          {isManager ? 'Manager' : 'Membre'}
        </span>
      </div>

      {/* Status */}
      <div className={styles.memberCell}>
        <span className={styles.statusDot} />
        <span className={styles.statusText}>Actif</span>
      </div>

      {/* Remove */}
      {canManage && (
        <div className={`${styles.memberCell} ${styles['memberCell--right']}`}>
          {!isManager && (
            <button
              className={styles.removeBtn}
              disabled={isRemoving}
              onClick={() => onRemove(clientId)}
            >
              {isRemoving ? '...' : 'Retirer'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}