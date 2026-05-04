'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import ProjectsToolbar from './ProjectsToolbar'
import ProjectsTable from './ProjectsTable'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'
import { archiveProject, restoreProject, restoreFinishedProject } from '@/services/projectService'

export default function ProjectsPage({ role = 'ADMIN' }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [actionLoading, setActionLoading] = useState(null)

  const { projects, loading, error, refetch } = useProjects(role, statusFilter || null)

  // Client-side search + sort
  const displayed = useMemo(() => {
    let list = [...(projects || [])]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.ownerName || '').toLowerCase().includes(q))
    }

    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'name') return dir * a.name.localeCompare(b.name)
      if (sortBy === 'estimatedEndDate') return dir * (new Date(a.estimatedEndDate || 0) - new Date(b.estimatedEndDate || 0))
      if (sortBy === 'memberCount') return dir * (a.memberCount - b.memberCount)
      return 0
    })

    return list
  }, [projects, search, sortBy, sortDir, statusFilter])

  const handleView = (id) => router.push(`/EspaceAdmin/projects/${id}`)

  const handleArchive = async (id) => {
    if (!confirm('Archiver ce projet ?')) return
    setActionLoading(id)
    try {
      await archiveProject(id)
      await refetch()
    } catch (e) {
      alert("Erreur lors de l'archivage.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestore = async (id, status) => {
    if (!confirm('Restaurer ce projet ?')) return
    setActionLoading(id)
    try {
      if (status === 'FINISHED') {
        await restoreFinishedProject(id)
      } else {
        await restoreProject(id)
      }
      await refetch()
    } catch (e) {
      alert('Erreur lors de la restauration.')
    } finally {
      setActionLoading(null)
    }
  }

  // Export currently displayed projects to CSV
  const [exportMessage, setExportMessage] = useState(null)

  const handleExport = (selectedCols = null) => {
    try {
      const allHeaders = ["id", "name", "status", "ownerName", "memberCount", "estimatedEndDate"];
      const headers = Array.isArray(selectedCols) && selectedCols.length > 0 ? selectedCols : allHeaders;

      const rows = displayed.map(p => headers.map(h => {
        const v = p[h];
        return v == null ? '' : String(v).replace(/"/g, '""');
      }));

      const csv = [headers.join(','), ...rows.map(r => `"${r.join('","') }"`)].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projects_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'_')}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setExportMessage('Export réussi — fichier téléchargé');
      setTimeout(() => setExportMessage(null), 3000);
    } catch (e) {
      alert('Erreur lors de l\'export.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div className="ap-heading">Gestion des Projets</div>
        <div className="ap-sub">{loading ? 'Chargement…' : `${displayed.length} projet${displayed.length !== 1 ? 's' : ''} · Dernière mise à jour à l'instant`}</div>
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <div className="ap-card-title">Tous les Projets</div>
        </div>

        <div className="ap-toolbar">
          <ProjectsToolbar
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortDir={sortDir}
            onSortDirChange={setSortDir}
            onExport={handleExport}
          />
        </div>

        {exportMessage && (
          <div style={{ marginTop: 8, color: '#065f46', background: '#ecfdf5', padding: '8px 12px', borderRadius: 8 }}>
            {exportMessage}
          </div>
        )}

        <div className="ap-table-wrap">
          {error && <div className="ap-error">Erreur lors du chargement des projets.</div>}

          {loading ? (
            <LoadingState />
          ) : displayed.length === 0 ? (
            <EmptyState />
          ) : (
            <ProjectsTable
              projects={displayed}
              onView={handleView}
              onArchive={handleArchive}
              onRestore={handleRestore}
              actionLoading={actionLoading}
            />
          )}
        </div>

        {!loading && displayed.length > 0 && (
          <div className="ap-pagination">
            <span>Affichage de {displayed.length} projet{displayed.length !== 1 ? 's' : ''}</span>
            <span style={{ color: '#c5cce0' }}>Pagination à implémenter si nécessaire</span>
          </div>
        )}
      </div>
    </div>
  )
}
