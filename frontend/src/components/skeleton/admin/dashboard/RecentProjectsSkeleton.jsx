import styles from '@/styles/admin/dashboard/RecentProjectsSkeleton.module.css';

export default function RecentProjectsSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.shimmer} ${styles.title}`} />
        <div className={`${styles.shimmer} ${styles.link}`} />
      </div>
      <div className={styles.rows}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.row}>
            <div className={`${styles.shimmer} ${styles.name}`} />
            <div className={`${styles.shimmer} ${styles.badge}`} />
            <div className={`${styles.shimmer} ${styles.bar}`} />
            <div className={`${styles.shimmer} ${styles.num}`} />
            <div className={`${styles.shimmer} ${styles.date}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
