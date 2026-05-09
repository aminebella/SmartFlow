'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

import { useRole }           from '@/hooks/useRole';
import { useProjectMembers } from '@/hooks/useProjectMembers';
import { addMember, removeMember } from '@/services/projectService';

import { EmptyTeams }        from '@/components/client/teams/EmptyTeams';
import { AddMemberModal }    from '@/components/client/teams/AddMemberModal';
import { MembersList }       from '@/components/client/teams/MembersList';
import { MemberRowSkeleton } from '@/components/skeleton/client/TeamsSkeleton';

import styles from '@/styles/client/teams/teams.module.css';

function Toast({ message, type }) {
  return (
    <div className={`${styles.toast} ${styles[`toast--${type}`]}`}>
      <span>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
export default function TeamsPage() {
  const { id: projectId } = useParams();

  // ── data ──
  const { projectRole, isManager } = useRole(projectId);
  const roleLoading = projectRole === null;

  const { members, loading: membersLoading, refetch } =
    useProjectMembers(projectId, projectRole);

  const memberIds = new Set(members.map(m => m.clientId ?? m.id));

  // ── local UI state ──
  const [modalOpen,  setModalOpen]  = useState(false);
  const [addingId,   setAddingId]   = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [toast,      setToast]      = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── handlers ──
  const handleAdd = async (clientId) => {
    setAddingId(clientId);
    try {
      await addMember(projectId, clientId);
      showToast('Membre ajouté avec succès');
      refetch();
    } catch {
      showToast("Erreur lors de l'ajout", 'error');
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (clientId) => {
    setRemovingId(clientId);
    try {
      await removeMember(projectId, clientId);
      showToast('Membre retiré');
      refetch();
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className={styles.page}>

      {toast && <Toast {...toast} />}

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Teams</h1>
          <p className={styles.subtitle}>
            {isManager
              ? 'Gérez les membres et les rôles du projet'
              : "Vue de l'équipe du projet"}
          </p>
        </div>
        <div className={styles.headerRight}>
          {projectRole && (
            <span className={`${styles.roleBadge} ${styles[isManager ? 'roleBadge--manager' : 'roleBadge--member']}`}>
              {isManager ? 'Manager' : ' Membre'}
            </span>
          )}
          {isManager && (
            <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
              + Ajouter un membre
            </button>
          )}
        </div>
      </div>

      {/* ── Count row ── */}
      <div className={styles.countRow}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#a08c4a" strokeWidth="1.8" strokeLinecap="round"/>
          <circle cx="9" cy="7" r="4" stroke="#a08c4a" strokeWidth="1.8"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#a08c4a" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span className={styles.countLabel}>Membres du projet</span>
        <span className={styles.countBadge}>{membersLoading ? '…' : members.length}</span>
      </div>

      {/* ── 3 states ── */}
      {roleLoading || membersLoading ? (
        <div className={styles.membersWrap}>
          {[...Array(3)].map((_, i) => <MemberRowSkeleton key={i} />)}
        </div>
      ) : members.length === 0 ? (
        <EmptyTeams
          isManager={isManager}
          onCreateClick={() => setModalOpen(true)}
        />
      ) : (
        <MembersList
          members={members}
          loading={false}
          canManage={isManager}
          removingId={removingId}
          onRemove={handleRemove}
        />
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <AddMemberModal
          projectId={projectId}
          memberIds={memberIds}
          onAdd={handleAdd}
          onClose={() => setModalOpen(false)}
          addingId={addingId}
        />
      )}

    </div>
  );
}