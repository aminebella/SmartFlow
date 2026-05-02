// For My Projects List in Projects page (not dashboard)
"use client";

import React from 'react';
import ProjectPreview from '@/components/client/projectsClient/ProjectPreview';
import styles from '@/styles/client/MyListOfprojects/ProjectsClient.module.css';

export default function ProjectsClientList({ projects = [] }) {
  if (!projects || projects.length === 0) {
    return <div className="text-sm text-slate-500">Aucun projet trouvé.</div>;
  }

  return (
    <div className={styles.list}>
      {projects.map((p) => (
        <div key={p.id} className={styles.row}>
          <ProjectPreview project={p} />
        </div>
      ))}
    </div>
  );
}
