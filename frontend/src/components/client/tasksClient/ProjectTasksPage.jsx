'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlobalClientHeader from '@/components/client/layoutClient/GlobalClientHeader';
import ProjectTasksList from '@/components/client/tasksClient/ProjectTasksList';
import { getTickets } from '@/services/taskService';
import { getProjectById } from '@/services/projectService';
import styles from '@/styles/client/tasks/ProjectTasksPage.module.css';

export default function ProjectTasksPage({ projectId }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch project details
        const projectData = await getProjectById(projectId);
        setProject(projectData);
        
        // Fetch project tasks
        const tasksData = await getTickets(projectId);
        setTasks(tasksData);
        
      } catch (err) {
        setError(err.message || 'Failed to load project tasks');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F4F1' }}>
        <GlobalClientHeader />
        <div className={styles.container}>
          <div className={styles.loading}>Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F4F1' }}>
        <GlobalClientHeader />
        <div className={styles.container}>
          <div className={styles.error}>
            <h3>Erreur</h3>
            <p>{error}</p>
            <Link href="/EspaceClient/projects" className={styles.backButton}>
              Retour aux projets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F1' }}>
      <GlobalClientHeader />
      
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/EspaceClient/projects" className={styles.breadcrumbLink}>
              Mes Projets
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Link 
              href={`/EspaceClient/projects/${projectId}/dashboard`} 
              className={styles.breadcrumbLink}
            >
              {project?.name || 'Projet'}
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Tâches</span>
          </div>
          
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Tâches du projet</h1>
            <p className={styles.subtitle}>
              {project?.name} · {tasks.length} tâche{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Tasks List */}
        <div className={styles.tasksSection}>
          <ProjectTasksList 
            tasks={tasks} 
            projectId={projectId}
            projectName={project?.name}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link 
            href={`/EspaceClient/projects/${projectId}/dashboard`} 
            className={styles.backButton}
          >
            ← Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
