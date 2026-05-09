'use client';

import { useState } from 'react';
import { archiveProject, restoreProject, finishProject, restoreFinishedProject } from '@/services/projectService';

const STATUS_CONFIG = {
  ACTIVE: { label: 'Actif', color: 'var(--green)', bg: 'var(--green-bg)', icon: '▶' },
  ARCHIVED: { label: 'Archivé', color: 'var(--text3)', bg: 'var(--bg4)', icon: '📦' },
  FINISHED: { label: 'Terminé', color: 'var(--gold)', bg: 'var(--gold-bg)', icon: '✓' },
};

export default function ProjectStatusManager({ projectId, currentStatus, isManager, isAdmin, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.ACTIVE;

  const handleArchive = async () => {
    if (!confirm('Archiver ce projet ? Il pourra être restauré plus tard.')) return;
    
    setLoading(true);
    setError(null);
    try {
      await archiveProject(projectId);
      setSuccess('Projet archivé avec succès');
      if (onStatusChange) onStatusChange('ARCHIVED');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    setError(null);
    try {
      await restoreProject(projectId);
      setSuccess('Projet restauré avec succès');
      if (onStatusChange) onStatusChange('ACTIVE');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!confirm('Terminer ce projet ? Cette action est définitive (seul un admin pourra le restaurer).')) return;
    
    setLoading(true);
    setError(null);
    try {
      await finishProject(projectId);
      setSuccess('Projet terminé avec succès');
      if (onStatusChange) onStatusChange('FINISHED');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFinished = async () => {
    setLoading(true);
    setError(null);
    try {
      await restoreFinishedProject(projectId);
      setSuccess('Projet restauré avec succès');
      if (onStatusChange) onStatusChange('ACTIVE');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-manager">
      <div className="status-header">
        <h3 className="form-section-title">Statut du projet</h3>
        <div className="status-badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
          <span className="status-icon">{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="status-actions">
        {/* Projet ACTIF */}
        {currentStatus === 'ACTIVE' && isManager && (
          <div className="status-action-group">
            <button 
              className="btn-status btn-archive" 
              onClick={handleArchive}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="10" height="9" rx="1" />
                <line x1="4" y1="6" x2="10" y2="6" />
              </svg>
              Archiver le projet
            </button>
            <button 
              className="btn-status btn-finish" 
              onClick={handleFinish}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="3,7 6,10 11,4" />
              </svg>
              Terminer le projet
            </button>
          </div>
        )}

        {/* Projet ARCHIVÉ */}
        {currentStatus === 'ARCHIVED' && (isManager || isAdmin) && (
          <div className="status-action-group">
            <button 
              className="btn-status btn-restore" 
              onClick={handleRestore}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 7a5 5 0 1 0 10 0 5 5 0 0 0-10 0z" />
                <polyline points="7,5 7,7 9,8" />
              </svg>
              Restaurer le projet
            </button>
          </div>
        )}

        {/* Projet TERMINÉ */}
        {currentStatus === 'FINISHED' && isAdmin && (
          <div className="status-action-group">
            <button 
              className="btn-status btn-restore" 
              onClick={handleRestoreFinished}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 7a5 5 0 1 0 10 0 5 5 0 0 0-10 0z" />
                <polyline points="7,5 7,7 9,8" />
              </svg>
              Restaurer le projet (Admin)
            </button>
          </div>
        )}

        {/* Message pour Member qui voit un projet non actif */}
        {!isManager && currentStatus !== 'ACTIVE' && (
          <div className="status-info">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 4v4M8 10h.01" />
            </svg>
            <span>
              Ce projet est {currentStatus === 'ARCHIVED' ? 'archivé' : 'terminé'}. 
              Seul le manager peut le réactiver.
            </span>
          </div>
        )}

        {/* Message pour Member qui voit un projet actif */}
        {!isManager && currentStatus === 'ACTIVE' && (
          <div className="status-info status-info-active">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--green)" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M6 8l2 2 3-4" />
            </svg>
            <span>Projet actif - Vous pouvez consulter les tâches et sprints</span>
          </div>
        )}
      </div>
    </div>
  );
}