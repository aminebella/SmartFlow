// For the /projects page (NOT the dashboard)
"use client";

import React from 'react';
import ProjectsPageItem from './ProjectsPageItem';
import styles from '@/styles/client/MyListOfprojects/ProjectsPageList.module.css';

/**
 * Renders the full project list for the projects page.
 * Uses ProjectsPageItem (richer than the dashboard ProjectPreview).
 */
export default function ProjectsPageList({ projects = [] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📂</span>
        <p className={styles.emptyText}>Aucun projet trouvé.</p>
        <p className={styles.emptySub}>Essayez de modifier vos filtres.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {projects.map(p => (
        <ProjectsPageItem key={p.id} project={p} />
      ))}
    </div>
  );
}
