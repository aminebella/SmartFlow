'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlobalClientHeader from '@/components/client/layoutClient/GlobalClientHeader';
import CreateProjectForm from '@/components/client/projectsClient/CreateProjectForm';
import { createProject } from '@/services/projectService';
import styles from '@/styles/client/projects/CreateProjectPage.module.css';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleProjectCreate = async (projectData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newProject = await createProject(projectData);
      
      // Redirect to the new project dashboard
      router.push(`/EspaceClient/projects/${newProject.id}/dashboard`);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la création du projet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <GlobalClientHeader />
      
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.breadcrumb}>
              <Link href="/EspaceClient/projects" className={styles.breadcrumbLink}>
                Mes Projets
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>Créer un projet</span>
            </div>
            
            <h1 className={styles.title}>Créer un nouveau projet</h1>
            <p className={styles.subtitle}>
              Vous deviendrez automatiquement le manager de ce projet
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Form */}
        <div className={styles.formContainer}>
          <CreateProjectForm 
            onSubmit={handleProjectCreate}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link 
            href="/EspaceClient/projects" 
            className={styles.cancelButton}
          >
            Annuler
          </Link>
        </div>
      </div>
    </div>
  );
}
