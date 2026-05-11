'use client';
import { useState } from 'react';
import '@/styles/client/ListSprintsOfMyProject/sprints.css';

const STATUS_CONFIG = {
  PLANNED:   { label: 'Planned',   color: '#a08c4a', bg: '#f3edd6', dot: '#e2d5a0' },
  ACTIVE:    { label: 'Active',    color: '#8a9e6b', bg: '#e8f0e0', dot: '#8a9e6b' },
  COMPLETED: { label: 'Completed', color: '#c9b479', bg: '#faf8f2', dot: '#c9b479' },
};

function getProgress(tickets) {
  const total = tickets.length;
  if (total === 0) return 0;
  const done = tickets.filter(t => t.status === 'DONE').length;
  return Math.round((done / total) * 100);
}

function getDaysLeft(endDate) {
  const diff = new Date(endDate).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function SprintCard({ sprint, tickets = [], onEdit, onDelete, onStart, onComplete, onRemoveTicket }) {
  const [expanded, setExpanded] = useState(sprint.status === 'ACTIVE');
  const [menuOpen, setMenuOpen] = useState(false);

  const cfg      = STATUS_CONFIG[sprint.status] ?? STATUS_CONFIG.PLANNED;
  const progress = getProgress(tickets);
  const daysLeft = getDaysLeft(sprint.endDate);
  const isActive = sprint.status === 'ACTIVE';

  return (
    <div className={`sprint-row ${isActive ? 'sprint-row-active' : ''}`}>

      {/* ── Top bar ── */}
      <div
        className="sprint-row-header"
        onClick={() => setExpanded(e => !e)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(e => !e); }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >

        <div className="sprint-row-header-left">
          {/* Status dot */}
          <span className="sprint-row-dot" style={{ background: cfg.dot }} />

          {/* Title + dates */}
          <div>
            <span className="sprint-row-title">{sprint.title}</span>
            <span className="sprint-row-dates">
              {fmtDate(sprint.startDate)} – {fmtDate(sprint.endDate)}
            </span>
          </div>
        </div>

        <div className="sprint-row-header-right">
          {/* Status badge */}
          <span className="sprint-row-badge" style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.label}
          </span>

          {/* Action buttons */}
          {isActive && (
            <button
              className="sprint-action-btn sprint-action-complete"
              onClick={e => { e.stopPropagation(); onComplete(sprint.id); }}
            >
              Complete Sprint
            </button>
          )}
          {sprint.status === 'PLANNED' && (
            <button
              className="sprint-action-btn sprint-action-start"
              onClick={e => { e.stopPropagation(); onStart(sprint.id); }}
            >
              Start Sprint
            </button>
          )}

          {/* Menu ⋯ */}
          <div
            style={{ position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="none"
          >
            <button className="sprint-menu-btn" onClick={() => setMenuOpen(o => !o)}>⋯</button>
            {menuOpen && (
              <div className="sprint-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                <div
                  className="sprint-dropdown-item"
                  onClick={() => { onEdit(sprint); setMenuOpen(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onEdit(sprint); setMenuOpen(false); } }}
                  role="button"
                  tabIndex={0}
                >
                  ✏️ &nbsp;Modifier
                </div>
                <div
                  className="sprint-dropdown-item danger"
                  onClick={() => { onDelete(sprint.id); setMenuOpen(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onDelete(sprint.id); setMenuOpen(false); } }}
                  role="button"
                  tabIndex={0}
                >
                  🗑️ &nbsp;Supprimer
                </div>
              </div>
            )}
          </div>

          {/* Chevron */}
          <span className={`sprint-chevron ${expanded ? 'open' : ''}`}>›</span>
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && (
        <div className="sprint-row-body">

          {/* Stats row */}
          <div className="sprint-stats-row">
            <div className="sprint-stat">
              <div className="sprint-stat-bar-wrap">
                <div className="sprint-stat-bar-track">
                  <div className="sprint-stat-bar-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #e2d5a0, #c9b479)' }} />
                </div>
                <span className="sprint-stat-bar-pct">{progress}%</span>
              </div>
              <span className="sprint-stat-label">PROGRESS</span>
            </div>

            <div className="sprint-stat">
              <span className="sprint-stat-value" style={{ color: daysLeft <= 3 ? 'var(--red)' : 'var(--accent)' }}>
                {daysLeft}
              </span>
              <span className="sprint-stat-label">DAYS LEFT</span>
            </div>

            <div className="sprint-stat">
              <span className="sprint-stat-value" style={{ color: 'var(--text1)' }}>
                {tickets.length}
              </span>
              <span className="sprint-stat-label">TICKETS</span>
            </div>
          </div>

          {/* Goal */}
          {sprint.goal && (
            <div className="sprint-row-goal">
              <span className="sprint-row-goal-label">Objectif :</span> {sprint.goal}
            </div>
          )}

          {/* Linked tickets */}
          {tickets.length > 0 && (
            <div className="sprint-tickets" style={{ marginTop: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2d5a0', color: '#a08c4a', fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Key</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Title</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Priority</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '6px 8px' }}>Assignee</th>
                    <th style={{ textAlign: 'center', padding: '6px 8px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #f0ebe0' }}>
                      <td style={{ padding: '6px 8px', color: '#c9b479', fontWeight: 600 }}>{t.key || t.id}</td>
                      <td style={{ padding: '6px 8px', color: '#334155' }}>{t.title}</td>
                      <td style={{ padding: '6px 8px' }}>
                        <span style={{
                          background: t.priority === 'CRITICAL' ? '#6b3a1f' : t.priority === 'HIGH' ? '#c9b479' : t.priority === 'MEDIUM' ? '#e2d5a0' : '#f3edd6',
                          color: t.priority === 'CRITICAL' || t.priority === 'HIGH' ? '#fff' : '#7a6830',
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500,
                        }}>
                          {t.priority}
                        </span>
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <span style={{
                          background: t.status === 'DONE' ? '#e8f0e0' : t.status === 'IN_PROGRESS' ? '#c9b479' : '#f3edd6',
                          color: t.status === 'DONE' ? '#8a9e6b' : t.status === 'IN_PROGRESS' ? '#fff' : '#a08c4a',
                          padding: '2px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 500,
                        }}>
                          {t.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '6px 8px', color: '#64748b' }}>{t.assigneeName || t.assigneeId || '—'}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); onRemoveTicket(t.id); }}
                          title="Retirer du sprint"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#c47a5a',
                            fontSize: 16,
                            lineHeight: 1,
                            padding: 2,
                          }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}
    </div>
  );
}