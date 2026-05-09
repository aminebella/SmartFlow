'use client';

import styles from '@/styles/client/teams/teams.module.css';

export function EmptyTeams({ isManager, onCreateClick }) {
  return (
    <div className={styles.emptyWrap}>

      <div className={styles.emptyIconWrap}>
        <div className={styles.emptyIconCard}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#6b3a1f" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="#6b3a1f" strokeWidth="1.8"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#a08c4a" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#a08c4a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        {isManager && (
          <div className={styles.emptyPlusBubble}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}
      </div>

      <h2 className={styles.emptyTitle}>
        Rassemblez tout le monde dans une seule équipe
      </h2>

      <p className={styles.emptyDesc}>
        {isManager
          ? "Ne restez pas seul, créez une équipe pour commencer à relier l'ensemble de votre travail sur les applications et à célébrer vos réussites collectives."
          : "Aucun membre n'a encore été ajouté à ce projet. Contactez le manager pour rejoindre l'équipe."}
      </p>

      {isManager && (
        <button className={styles.emptyBtn} onClick={onCreateClick}>
          + Créer une équipe
        </button>
      )}

    </div>
  );
}