import styles from '@/styles/admin/reports/ReportsPage.module.css';

export default function ReportsSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Rapports</h2>
        <div className={styles.yearSelector}>
          <div className={styles.select} style={{ width: '80px', height: '32px', background: '#f0f0f0' }}></div>
        </div>
      </div>

      <div className={styles.statsRow}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statLabel} style={{ background: '#f0f0f0', width: '60px', height: '12px' }}></div>
            <div className={styles.statValue} style={{ background: '#f0f0f0', width: '40px', height: '26px' }}></div>
            <div className={styles.statSub} style={{ background: '#f0f0f0', width: '40px', height: '14px' }}></div>
          </div>
        ))}
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle} style={{ background: '#f0f0f0', width: '200px', height: '16px' }}></h3>
        </div>
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAA' }}>
          Chargement...
        </div>
      </div>
    </div>
  );
}
