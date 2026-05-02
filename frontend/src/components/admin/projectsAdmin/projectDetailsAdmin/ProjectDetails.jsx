'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getProjectById, restoreProject, restoreFinishedProject } from '@/services/projectService'


export default function ProjectDetails({ projectId }) {
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await getProjectById(projectId)
        setProject(data)
      } catch (e) {
        setError('Impossible de charger le projet.')
      } finally {
        setLoading(false)
      }
    }
    if (projectId) fetch()
  }, [projectId])

  const handleRestore = async () => {
    if (!confirm('Restaurer ce projet ?')) return
    setActionLoading(true)
    try {
      if (project.status === 'FINISHED') await restoreFinishedProject(projectId)
      else await restoreProject(projectId)
      const updated = await getProjectById(projectId)
      setProject(updated)
    } catch (e) {
      alert('Erreur lors de la restauration.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <div className="ap-loading">Chargement…</div>
  if (error) return <div className="ap-error">{error}</div>
  if (!project) return <div className="ap-empty">Projet introuvable.</div>

  return (
    <div className="project-detail-root">
      <header className="pd-header">
        <div>
          <h1 className="pd-title">{project.name}</h1>
          <div className="pd-sub">Par {project.ownerName || '—'}</div>
        </div>
        <div className="pd-actions">
          <span className={`badge ${project.status === 'ACTIVE' ? 'badge-blue' : project.status === 'ARCHIVED' ? 'badge-gray' : 'badge-green'}`}>{project.status}</span>
        </div>
      </header>

      <div className="pd-grid">
        <section className="pd-left">
          <div className="ap-card pd-card">
            <h3>Description</h3>
            <p className="pd-text">{project.description || '—'}</p>
          </div>

          <div className="ap-card pd-card">
            <h3>Dates</h3>
            <div className="pd-stats">
              <div>
                <div className="pd-stat-label">Début estimé</div>
                <div className="pd-stat-value">{project.estimatedStartDate || '—'}</div>
              </div>
              <div>
                <div className="pd-stat-label">Fin estimée</div>
                <div className="pd-stat-value">{project.estimatedEndDate || '—'}</div>
              </div>
              <div>
                <div className="pd-stat-label">Début réel</div>
                <div className="pd-stat-value">{project.realStartDate || '—'}</div>
              </div>
              <div>
                <div className="pd-stat-label">Fin réelle</div>
                <div className="pd-stat-value">{project.realEndDate || '—'}</div>
              </div>
            </div>
          </div>

          <div className="ap-card pd-card">
            <h3>Budget</h3>
            <div className="pd-stats">
              <div>
                <div className="pd-stat-label">Budget estimé</div>
                <div className="pd-stat-value">{project.estimatedBudget ?? '—'}</div>
              </div>
              <div>
                <div className="pd-stat-label">Budget réel</div>
                <div className="pd-stat-value">{project.realBudget ?? '—'}</div>
              </div>
            </div>
          </div>
        </section>

        <aside className="pd-right">
          <div className="ap-card pd-card">
            <h3>État & équipe</h3>
            <div className="pd-meta-row">
              <div>
                <div className="pd-stat-label">Membres</div>
                <div className="pd-stat-value">{project.memberCount}</div>
              </div>
              <div>
                <div className="pd-stat-label">Mon rôle</div>
                <div className="pd-stat-value">{project.myRole || '—'}</div>
              </div>
            </div>
          </div>

          <div className="ap-card pd-card">
            <h3>Actions</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => router.push('/EspaceAdmin/projects')}>Retour</button>
              {project.status !== 'ACTIVE' && (
                <button className="btn-primary" onClick={handleRestore} disabled={actionLoading}>Restaurer</button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
