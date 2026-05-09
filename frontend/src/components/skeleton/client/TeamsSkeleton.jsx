'use client';

import styles from '@/styles/client/teams/teams.module.css';

export function MemberRowSkeleton() {
  return (
    <div className={styles.skeletonRow}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonLines}>
        <div className={`${styles.skeletonLine} ${styles['skeletonLine--short']}`} />
        <div className={`${styles.skeletonLine} ${styles['skeletonLine--long']}`} />
      </div>
      <div className={styles.skeletonBadge} />
    </div>
  );
}

// backward compat
export const MemberCardSkeleton = MemberRowSkeleton;