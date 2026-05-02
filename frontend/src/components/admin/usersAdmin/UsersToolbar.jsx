// UsersToolbar.jsx
const STATUS_OPTIONS = [
  { label: 'Tous les statuts', value: '' },
  { label: 'Actif',            value: 'ACTIVE' },
  { label: 'Bloqué',           value: 'BLOCKED' },
];
const SORT_OPTIONS = [
  { label: 'Nom',   value: 'fullName' },
  { label: 'Email', value: 'email' },
  { label: 'Date',  value: 'createdAt' },
];

export default function UsersToolbar({
  search, onSearch,
  status, onStatus,
  sortBy, onSortBy,
  sortDir, onSortDir,
}) {
  return (
    <div className="au-toolbar">
      {/* Search */}
      <div className="au-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="#9099b4" strokeWidth="2" width="14" height="14">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          placeholder="Rechercher un utilisateur ou email..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Statut */}
      <select className="au-select" value={status} onChange={e => onStatus(e.target.value)}>
        {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {/* Trier par */}
      <select className="au-select" value={sortBy} onChange={e => onSortBy(e.target.value)}>
        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>Trier par : {o.label}</option>)}
      </select>

      {/* Direction */}
      <select className="au-select" value={sortDir} onChange={e => onSortDir(e.target.value)}>
        <option value="asc">Croissant</option>
        <option value="desc">Décroissant</option>
      </select>
    </div>
  );
}