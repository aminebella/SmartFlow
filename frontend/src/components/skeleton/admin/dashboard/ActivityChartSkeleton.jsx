import styles from '@/styles/admin/dashboard/ActivityChartSkeleton.module.css';

export default function ActivityChartSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.shimmer} ${styles.title}`} />
        <div className={`${styles.shimmer} ${styles.link}`} />
      </div>
      <div className={`${styles.shimmer} ${styles.chart}`} />
    </div>
  );
}
