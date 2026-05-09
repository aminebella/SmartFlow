'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useProjectRole } from '@/hooks/useProjectRole';
import { getProjectById } from '@/services/projectService';

import ProjectSettingsForm from '@/components/client/parameter/ProjectSettingsForm';
import ProjectStatusManager from '@/components/client/parameter/ProjectStatusManager';

import '@/styles/client/parameter/settings.css';

export default function EspaceClientProjectParameter() {
  const { id } = useParams();
  const router = useRouter();
  const projectId = Number(id);

  const { role, isManager, isAdmin, loading: roleLoading } = useProjectRole(projectId);
  const [projectStatus, setProjectStatus] = useState(null);
  const [projectName, setProjectName] = useState('');

  // Charger le projet pour obtenir le nom et le statut initial
  React.useEffect(() => {
    if (projectId && !roleLoading) {
      getProjectById(projectId)
        .then(project => {
          setProjectName(project.name);
          setProjectStatus(project.status);
        })
        .catch(err => console.error(err));
    }
  }, [projectId, roleLoading]);

  const handleStatusChange = (newStatus) => {
    setProjectStatus(newStatus);
  };

  if (roleLoading) {
    return (
      <div className="settings-root">
        <div className="settings-loading">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
      </div>
    );
  }

  // Accès non autorisé
  if (!role) {
    return (
      <div className="settings-root">
        <div className="settings-card">
          <div className="settings-card-body">
            <div className="alert alert-error">
              Vous n'avez pas accès à ce projet.
            </div>
            <button className="btn-primary" onClick={() => router.push('/EspaceClient/projects')}>
              Retour à mes projets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-root">
      <div className="settings-card">
        <div className="settings-card-header">
          <h2>Paramètres du projet</h2>
          <p>
            {projectName} · {isManager ? 'Manager' : isAdmin ? 'Administrateur' : 'Membre'}
          </p>
        </div>

        <div className="settings-card-body">
          {/* Gestion du statut */}
          {projectStatus && (
            <ProjectStatusManager
              projectId={projectId}
              currentStatus={projectStatus}
              isManager={isManager}
              isAdmin={isAdmin}
              onStatusChange={handleStatusChange}
            />
          )}

          {/* Formulaire d'édition */}
          <ProjectSettingsForm
            projectId={projectId}
            isManager={isManager}
            onUpdate={() => {
              // Recharger le statut après mise à jour
              getProjectById(projectId).then(p => setProjectStatus(p.status));
            }}
          />
        </div>
      </div>
    </div>
  );
}