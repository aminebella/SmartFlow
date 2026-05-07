'use client';

import styles from '@/styles/client/globalDashboard/DashboardGreeting.module.css';

// Formats today's date in French locale
function todayLabel() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function DashboardGreeting({ user }) {
  const firstName = user?.fullName?.split(' ')[0] || 'vous';

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Bonjour, {firstName} 👋</h1>
      <p className={styles.subtitle}>
        Voici un résumé de vos projets actifs —{' '}
        <span className={styles.date}>{todayLabel()}</span>
      </p>
    </div>
  );
}
