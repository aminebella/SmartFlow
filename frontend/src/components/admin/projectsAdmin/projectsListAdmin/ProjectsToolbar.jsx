'use client'

import { useState } from 'react'
import styles from '@/styles/admin/projects/projectsListAdmin.module.css'

const COL_LABELS = {
  id: 'ID',
  name: 'Project name',
  status: 'Status',
  ownerName: 'Manager',
  memberCount: 'Team size',
  estimatedEndDate: 'Deadline',
}

export default function ProjectsToolbar({
  search, onSearchChange,
  status, onStatusChange,
  sortBy, onSortChange,
  sortDir, onSortDirChange,
  onExport,
}) {
  const [exportOpen, setExportOpen] = useState(false)
  const [cols, setCols] = useState({
    id: true, name: true, status: true,
    ownerName: true, memberCount: true, estimatedEndDate: true,
  })

  const toggleCol = (k) => setCols(prev => ({ ...prev, [k]: !prev[k] }))

  const download = () => {
    const selected = Object.keys(cols).filter(k => cols[k])
    onExport?.(selected)
    setExportOpen(false)
  }

  return (
    <>
      {/* Search */}
      <div className={styles.searchBox}>
        <svg width="13" height="13" fill="none" stroke="#BBB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search projects or managers…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <select className={styles.sfSelect} value={status} onChange={e => onStatusChange(e.target.value)}>
        <option value="">All statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="ARCHIVED">Archived</option>
        <option value="FINISHED">Finished</option>
      </select>

      {/* Sort field */}
      <select className={styles.sfSelect} value={sortBy} onChange={e => onSortChange(e.target.value)}>
        <option value="name">Sort: Name</option>
        <option value="estimatedEndDate">Sort: Deadline</option>
        <option value="memberCount">Sort: Team size</option>
      </select>

      {/* Sort direction */}
      <select className={styles.sfSelect} value={sortDir} onChange={e => onSortDirChange(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      {/* Export button + dropdown */}
      <div className={styles.toolbarRight} style={{ position: 'relative' }}>
        <button className={styles.btnExport} onClick={() => setExportOpen(v => !v)}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>

        {exportOpen && (
          <div className={styles.exportDropdown}>
            <div className={styles.exportDropdownTitle}>Columns to export</div>
            <div className={styles.exportColList}>
              {Object.keys(cols).map(k => (
                <label key={k} className={styles.exportColLabel}>
                  <input type="checkbox" checked={cols[k]} onChange={() => toggleCol(k)} />
                  {COL_LABELS[k] ?? k}
                </label>
              ))}
            </div>
            <div className={styles.exportActions}>
              <button className={styles.btnCancel} onClick={() => setExportOpen(false)}>Cancel</button>
              <button className={styles.btnDownload} onClick={download}>Download</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
