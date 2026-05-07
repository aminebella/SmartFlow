'use client'

import { useEffect, useState, useCallback } from 'react'
import { getProjectById, getProjectMembers } from '@/services/projectService'

import ProjectHeader from './ProjectHeader'
import ProjectDescription from './ProjectDescription'
import ProjectProgression from './ProjectProgression'
import ProjectDates from './ProjectDates'
import ProjectBudget from './ProjectBudget'
import ProjectTeam from './ProjectTeam'
import ProjectManager from './ProjectManager'
import ProjectActions from './ProjectActions'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

export default function ProjectDetails({ projectId }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProject = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Fetch project and its members in parallel
      const [data, members] = await Promise.all([
        getProjectById(projectId),
        getProjectMembers(projectId),
      ])

      // ensure members array is attached to the project object
      data.members = Array.isArray(members) ? members : []
      setProject(data)
    } catch {
      setError('Unable to load project.')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (projectId) loadProject()
  }, [projectId, loadProject])


  if (loading) return <div className={styles.apLoading}>Loading project…</div>
  if (error)   return <div className={styles.apError}>{error}</div>
  if (!project) return <div className={styles.apEmpty}>Project not found.</div>

  return (
    <div>
      <button className="au-back-btn" onClick={() => router.push('/EspaceAdmin/projects')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour aux projets
        </button>

      <div className={styles.projectDetailRoot}>
        {/* Header: project name, type, owner, status badge */}
        <ProjectHeader project={project} />

        <div className={styles.pdGrid}>
          {/* LEFT COLUMN */}
          <div className={styles.pdLeft}>
            {/* Description */}
            <ProjectDescription project={project} />

            {/* Progression */}
            <ProjectProgression 
              taskCount={project.taskCount}
              tasksDone={project.tasksDone}
              progress={project.progress}
            />

            {/* Timeline: estimated + real start/end dates */}
            <ProjectDates project={project} />

            {/* Budget: estimated vs real */}
            <ProjectBudget project={project} />

            {/* Team members */}
            <ProjectTeam project={project} />
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.pdRight}>
            {/* Project manager info */}
            <ProjectManager project={project} />

            {/* Archive / Restore actions */}
            <ProjectActions project={project} onProjectUpdate={loadProject} />
          </div>
        </div>
      </div>
    </div>
    
  )
}
