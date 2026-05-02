'use client';
import styles from '@/styles/client/globalDashboard/StatCard.module.css';

export default function StatCard({ title, value, hint, accent = false }) {
  return (
    <div className={`${styles.statCard} ${accent ? styles.statCardAccent : ''}`}>
      <div className={styles.statLabel}>{title}</div>
      <div className={styles.statValue}>{value}</div>
      {hint && <div className={styles.statHint}>{hint}</div>}
    </div>
  );
}