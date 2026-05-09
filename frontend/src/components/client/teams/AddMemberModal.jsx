'use client';

import { ClientSearchInput } from '@/components/client/teams/ClientSearchInput';
import styles from '@/styles/client/teams/teams.module.css';

export function AddMemberModal({ projectId, memberIds, onAdd, onClose, addingId }) {
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdrop}>
      <div className={styles.modalPanel}>

        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ flex: 1 }}>
            <h2 className={styles.modalTitle}>Ajouter des membres a l'equipe</h2>
            <p className={styles.modalSubtitle}>
              Agrandissez votre equipe et ameliorez la collaboration.
              Si vous ajoutez des personnes a cette equipe, elles auront acces a tout son travail.
            </p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#6b3a1f" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <label className={styles.modalLabel}>Noms ou adresses e-mail</label>
          <ClientSearchInput
            projectId={projectId}
            memberIds={memberIds}
            onAdd={onAdd}
            addingId={addingId}
          />
        </div>

      </div>
    </div>
  );
}