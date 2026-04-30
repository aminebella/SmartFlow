'use client'

import ProjectRow from './ProjectRow'

export default function ProjectsTable({ projects = [], onView, onArchive, onRestore, actionLoading }) {
  return (
    <table className="ap-table">
      <thead>
        <tr>
          <th>Projet</th>
          <th>Chef de Projet</th>
          <th>Équipe</th>
          <th>Statut</th>
          <th>Membres</th>
          <th>Échéance estimée</th>
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
  )
}
