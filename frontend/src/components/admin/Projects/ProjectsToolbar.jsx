'use client'

export default function ProjectsToolbar({ search, onSearchChange, status, onStatusChange, sortBy, onSortChange, sortDir, onSortDirChange }) {
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
    </>
  )
}
