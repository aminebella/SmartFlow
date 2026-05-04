import styles from '@/styles/admin/dashboard/StatsSkeleton.module.css';

export default function StatsSkeleton() {
  return (
    <div className={styles.statsGrid}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.shimmer} ${styles.label}`} />
          <div className={`${styles.shimmer} ${styles.value}`} />
          <div className={`${styles.shimmer} ${styles.badge}`} />
        </div>
      ))}
    </div>
  );
}
