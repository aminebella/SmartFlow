import styles from '@/styles/admin/dashboard/StatusDonutSkeleton.module.css';

export default function StatusDonutSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.shimmer} ${styles.title}`} />
      <div className={`${styles.shimmer} ${styles.donut}`} />
      <div className={styles.rows}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.row}>
            <div className={`${styles.shimmer} ${styles.dot}`} />
            <div className={`${styles.shimmer} ${styles.rowLabel}`} />
            <div className={`${styles.shimmer} ${styles.rowVal}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
