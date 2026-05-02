// For Dashboard
'use client';

import Link from 'next/link';
import ProjectPreview from './ProjectPreview';
import styles from '@/styles/client/globalDashboard/ProjectsList.module.css';

export default function ProjectsList({
  projects = [],
  limit = 3,
  title = 'Mes derniers projets',
  showSeeAll = false,
  seeAllHref = '/EspaceClient/projects',
}) {
  const list = projects?.length
    ? (limit == null ? projects : projects.slice(-limit).reverse())
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.listHeader}>
        <span className={styles.listTitle}>{title}</span>
        {showSeeAll && (
          <Link href={seeAllHref} className={styles.seeAll}>
            Voir tous →
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {list.map(p => (
          <ProjectPreview key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}