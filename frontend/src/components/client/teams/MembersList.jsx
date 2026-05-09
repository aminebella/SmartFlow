'use client';

import { MemberRowSkeleton } from '@/components/skeleton/client/TeamsSkeleton';
import styles from '@/styles/client/teams/teams.module.css';
import { MemberRow } from '@/components/client/teams/MemberRow';

export function MembersList({ members, loading, canManage, removingId, onRemove }) {
  if (loading) {
    return (
      <div className={styles.membersWrap}>
        {[...Array(3)].map((_, i) => <MemberRowSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className={styles.membersWrap}>

      {/* Table header */}
      <div className={styles.membersThead}>
        <span className={`${styles.membersTh} ${styles['membersTh--wide']}`}>Membre</span>
        <span className={styles.membersTh}>Role</span>
        <span className={styles.membersTh}>Statut</span>
        {canManage && (
          <span className={`${styles.membersTh} ${styles['membersTh--right']}`}>Action</span>
        )}
      </div>

      {/* Rows */}
      {members.map(m => (
        <MemberRow
          key={m.clientId ?? m.id}
          m={m}
          canManage={canManage}
          removingId={removingId}
          onRemove={onRemove}
        />
      ))}

    </div>
  );
}