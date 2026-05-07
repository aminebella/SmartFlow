'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { archiveProject, restoreProject, restoreFinishedProject } from '@/services/projectService'

import ProjectsToolbar from './ProjectsToolbar'
import ProjectsTable from './ProjectsTable'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'

import styles from '@/styles/admin/projects/projectsListAdmin.module.css'

export default function ProjectsPage({ role = 'ADMIN' }) {
  const router = useRouter()
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy]           = useState('name')
  const [sortDir, setSortDir]         = useState('asc')
  const [actionLoading, setActionLoading] = useState(null)
  const [exportMessage, setExportMessage] = useState(null)
  const [page, setPage] = useState(0);
  // Use 2 items per page for testing (change to 10 later)
  const size = 10;

  const { projects, pagination, loading, error, refetch } = useProjects(role, statusFilter || null, page, size);

  /* ── client-side filter + sort ── */
  const displayed = useMemo(() => {
    let list = [...(projects || [])]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.ownerName || '').toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortBy === 'name')            return dir * a.name.localeCompare(b.name)
      if (sortBy === 'estimatedEndDate') return dir * (new Date(a.estimatedEndDate || 0) - new Date(b.estimatedEndDate || 0))
      if (sortBy === 'memberCount')     return dir * (a.memberCount - b.memberCount)
      return 0
    })
    return list
  }, [projects, search, sortBy, sortDir])

  useEffect(() => {
    setPage(0);
  }, [statusFilter]);

  /* ── derived stats from full project list ── */
  const allProjects = projects || []
  const totalCount    = pagination.totalElements
  const activeCount   = allProjects.filter(p => p.status === 'ACTIVE').length
  const archivedCount = allProjects.filter(p => p.status === 'ARCHIVED').length
  const finishedCount = allProjects.filter(p => p.status === 'FINISHED').length

  /* ── handlers ── */
  const handleView = (id) => router.push(`/EspaceAdmin/projects/${id}`)

  const handleArchive = async (id) => {
    if (!confirm('Archive this project?')) return
    setActionLoading(id)
    try {
      await archiveProject(id)
      await refetch()
    } catch {
      alert('Failed to archive project.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestore = async (id, status) => {
    if (!confirm('Restore this project?')) return
    setActionLoading(id)
    try {
      if (status === 'FINISHED') await restoreFinishedProject(id)
      else await restoreProject(id)
      await refetch()
    } catch {
      alert('Failed to restore project.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleExport = (selectedCols = null) => {
    try {
      const allHeaders = ['id', 'name', 'status', 'ownerName', 'memberCount', 'estimatedEndDate']
      const headers = Array.isArray(selectedCols) && selectedCols.length > 0 ? selectedCols : allHeaders
      const rows = displayed.map(p =>
        headers.map(h => {
          const v = p[h]
          return v == null ? '' : String(v).replace(/"/g, '""')
        })
      )
      const csv = [headers.join(','), ...rows.map(r => `"${r.join('","')}"`)] .join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `projects_${new Date().toISOString().slice(0,10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setExportMessage('Export successful — file downloaded')
      setTimeout(() => setExportMessage(null), 3000)
    } catch {
      alert('Export failed.')
    }
  }

  return (
    <div className={styles.pageRoot}>

      {/* Page heading */}
      <div>
        <h1 className={styles.pageHeading}>Project Management</h1>
        <div className={styles.pageSub}>
          {loading ? 'Loading…' : `${displayed.length} project${displayed.length !== 1 ? 's' : ''} · Last refreshed just now`}
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total projects</div>
          <div className={styles.statValue}>{totalCount}</div>
          <div className={styles.statSub}>All statuses</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active</div>
          <div className={styles.statValue} style={{ color: '#2D7A4F' }}>{activeCount}</div>
          <div className={styles.statSub}>
            <span className={styles.statDot} style={{ background: '#2D7A4F' }} />
            In progress
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Finished</div>
          <div className={styles.statValue} style={{ color: '#4A52B8' }}>{finishedCount}</div>
          <div className={styles.statSub}>
            <span className={styles.statDot} style={{ background: '#4A52B8' }} />
            Completed
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Archived</div>
          <div className={styles.statValue} style={{ color: '#888' }}>{archivedCount}</div>
          <div className={styles.statSub}>
            <span className={styles.statDot} style={{ background: '#BBB' }} />
            Inactive
          </div>
        </div>
      </div>

      {/* Main table card */}
      <div className={styles.mainCard}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>All Projects</div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
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

        {/* Export toast */}
        {exportMessage && (
          <div className={styles.exportToast}>{exportMessage}</div>
        )}

        {/* Error */}
        {error && <div className={styles.errorMsg}>Failed to load projects. Please try again.</div>}

        {/* Table / states */}
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

        {/* Pagination */}
        {!loading && displayed.length > 0 && (
          <div className={styles.pagination}>
            <button
              disabled={page === 0}
              onClick={() => setPage(prev => prev - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>

            <button
              disabled={page >= pagination.totalPages - 1}
              onClick={() => setPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
