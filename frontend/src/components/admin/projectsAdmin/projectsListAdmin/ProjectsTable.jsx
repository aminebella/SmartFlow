'use client'

import styles from '@/styles/admin/projects/projectsListAdmin.module.css'
import ProjectRow from './ProjectRow'

export default function ProjectsTable({ projects = [], onView, onArchive, onRestore, actionLoading }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.sfTable}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Type</th>
            <th>Manager</th>
            <th>Team size</th>
            <th>Status</th>
            <th>Progression</th>
            <th>Members</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <ProjectRow
              key={project.id}
              project={project}
              onView={onView}
              onArchive={onArchive}
              onRestore={onRestore}
              isActing={actionLoading === project.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
