"use client"

import { useState } from 'react'

export default function ProjectsToolbar({ search, onSearchChange, status, onStatusChange, sortBy, onSortChange, sortDir, onSortDirChange, onExport }) {
  const [exportOpen, setExportOpen] = useState(false)
  const [cols, setCols] = useState({ id: true, name: true, status: true, ownerName: true, memberCount: true, estimatedEndDate: true })

  const toggleCol = (k) => setCols(prev => ({ ...prev, [k]: !prev[k] }))

  const download = () => {
    const selected = Object.keys(cols).filter(k => cols[k])
    onExport && onExport(selected)
    setExportOpen(false)
  }

  return (
    <>
      <div className="ap-search">
        <svg width="14" height="14" fill="none" stroke="#9099b4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Rechercher un projet ou chef de projet…"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <select className="ap-select" value={status} onChange={e => onStatusChange(e.target.value)}>
        <option value="">Tous les statuts</option>
        <option value="ACTIVE">Actif</option>
        <option value="ARCHIVED">Archivé</option>
        <option value="FINISHED">Terminé</option>
      </select>

      <select className="ap-select" value={sortBy} onChange={e => onSortChange(e.target.value)}>
        <option value="name">Trier par : Nom</option>
        <option value="estimatedEndDate">Trier par : Échéance</option>
        <option value="memberCount">Trier par : Équipe</option>
      </select>

      <select className="ap-select" value={sortDir} onChange={e => onSortDirChange(e.target.value)}>
        <option value="desc">Décroissant</option>
        <option value="asc">Croissant</option>
      </select>

      <div style={{ position: 'relative' }}>
        <button
          className="ap-btn-export"
          onClick={() => setExportOpen(v => !v)}
          title="Exporter la liste"
          style={{ padding: '8px 12px', background: '#0ea5a4', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer' }}
        >
          Exporter
        </button>

        {exportOpen && (
          <div style={{ position: 'absolute', right: 0, top: '40px', background: '#fff', border: '1px solid #e6e9f2', borderRadius: 8, padding: 12, boxShadow: '0 6px 18px rgba(2,6,23,0.08)', zIndex: 40, minWidth: 220 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Colonnes à exporter</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {Object.keys(cols).map(k => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input type="checkbox" checked={cols[k]} onChange={() => toggleCol(k)} />
                  <span style={{ textTransform: 'capitalize' }}>{k}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
              <button onClick={() => setExportOpen(false)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #e6e9f2', background: '#fff' }}>Annuler</button>
              <button onClick={download} style={{ padding: '6px 10px', borderRadius: 6, background: '#0ea5a4', color: '#fff', border: 'none' }}>Télécharger</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
