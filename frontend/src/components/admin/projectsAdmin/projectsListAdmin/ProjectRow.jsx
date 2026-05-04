'use client'

// small helpers used by the row component
const AVATAR_COLORS = [
  '#3b82f6','#6366f1','#8b5cf6','#ec4899',
  '#f97316','#10b981','#14b8a6','#0ea5e9',
  '#a855f7','#22c55e','#f59e0b','#ef4444',
]
function avatarColor(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
const ACCENT_COLORS = ['#00c875','#0073ea','#e2445c','#ffb900','#784bd1','#ff3d57','#ff7a00']
function accentColor(id) { return ACCENT_COLORS[id % ACCENT_COLORS.length] }
const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc']
function fmtDate(iso) { if (!iso) return '—'; const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` }
function initials(name = '') { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) }

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

export default function ProjectRow({ project, onView, onArchive, onRestore, isActing }) {
  const statusCfg = {
    ACTIVE: { label: 'Actif', cls: 'badge-blue' },
    ARCHIVED: { label: 'Archivé', cls: 'badge-gray' },
    FINISHED: { label: 'Terminé', cls: 'badge-green' }
  }[project.status] || { label: project.status, cls: 'badge-gray' }

  const color = accentColor(project.id)
  const ownerColor = avatarColor(project.ownerName || '')

  return (
    <tr>
      <td>
        <div className="proj-row-name">
          <div className="proj-accent" style={{ background: color }} />
          <div>
            <div className="project-name">{project.name}</div>
            {project.description && (
              <div className="project-sub">{project.description.length > 40 ? project.description.slice(0,40) + '…' : project.description}</div>
            )}
          </div>
        </div>
      </td>

      <td>
        <div className="manager-cell">
          {project.ownerPicture ? (
            <img
              src={imgUrl(project.ownerPicture)}
              alt={project.ownerName}
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }}
              title={project.ownerName}
            />
          ) : (
            <div className="av-sm" style={{ background: ownerColor }} title={project.ownerName}>
              {initials(project.ownerName)}
            </div>
          )}
          <span style={{ fontSize: 13, color: '#454d6d' }}>{project.ownerName || '—'}</span>
        </div>
      </td>

      <td>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#323a5a' }}>{project.memberCount}</span>
        <span style={{ fontSize: 11.5, color: '#9099b4', marginLeft: 4 }}> membre{project.memberCount !== 1 ? 's' : ''}</span>
      </td>

      <td><span className={`badge ${statusCfg.cls}`}>{statusCfg.label}</span></td>

      <td style={{ fontSize: 12.5, color: '#676f8d' }}>
        {project.memberCount > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {Array.from({ length: Math.min(project.memberCount, 3) }).map((_, i) => (
              <div
                key={i}
                className="av-sm"
                style={{
                  background: AVATAR_COLORS[i],
                  width: 22,
                  height: 22,
                  fontSize: 9,
                  borderRadius: '50%',
                  border: '2px solid #fff',
                  marginLeft: i > 0 ? -6 : 0,
                }}
              >{i + 1}</div>
            ))}
            {project.memberCount > 3 && (
              <div className="av-sm" style={{ background: '#e1e5f0', color: '#676f8d', width: 22, height: 22, fontSize: 9, borderRadius: '50%', border: '2px solid #fff', marginLeft: -6 }}>+{project.memberCount - 3}</div>
            )}
          </div>
        ) : (<span style={{ color: '#c5cce0' }}>—</span>)}
      </td>

      <td style={{ fontSize: 12.5, color: '#676f8d' }}>{fmtDate(project.estimatedEndDate)}</td>

      <td>
        <div className="action-btns">
          <button className="btn-icon" title="Voir le projet" onClick={() => onView(project.id)} disabled={isActing}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>

          {project.status === 'ACTIVE' && (
            <button className="btn-icon warn" title="Archiver" onClick={() => onArchive(project.id)} disabled={isActing}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
            </button>
          )}

          {(project.status === 'ARCHIVED' || project.status === 'FINISHED') && (
            <button className="btn-icon success" title="Restaurer" onClick={() => onRestore(project.id, project.status)} disabled={isActing}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}