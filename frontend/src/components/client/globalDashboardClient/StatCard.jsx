'use client';

import styles from '@/styles/client/globalDashboard/StatCard.module.css';

/**
 * Single metric card.
 *
 * Props:
 *  title       – card label (small text above value)
 *  value       – main number / string
 *  hint        – small helper text below value
 *  accentColor – bottom-border accent color (hex)
 *  badgeType   – 'success' | 'warn' | 'danger' | 'info'  → colors the hint text
 */
export default function StatCard({ title, value, hint, accentColor, badgeType }) {
  const hintClass = badgeType ? styles[`hint_${badgeType}`] : styles.hintDefault;

  return (
    <div className={styles.card}>
      {/* Colored bottom accent bar */}
      {accentColor && (
        <div className={styles.accent} style={{ background: accentColor }} />
      )}

      <div className={styles.label}>{title}</div>
      <div className={styles.value}>{value}</div>
      {hint && <div className={`${styles.hint} ${hintClass}`}>{hint}</div>}
    </div>
  );
}
