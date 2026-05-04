'use client';
import { useState } from 'react';
import '@/styles/client/ListSprintsOfMyProject/sprints.css';

const STATUS_CONFIG = {
  PLANNED:   { label: 'Planned',   color: '#8a95a8', bg: '#eef0f4', dot: '#8a95a8' },
  ACTIVE:    { label: 'Active',    color: '#1d9e5c', bg: '#e6f7ee', dot: '#1d9e5c' },
  COMPLETED: { label: 'Completed', color: '#0c66e4', bg: '#e8f0fd', dot: '#0c66e4' },
};

function getProgress(startDate, endDate) {
  const now   = Date.now();
  const start = new Date(startDate).getTime();
  const end   = new Date(endDate).getTime();
  if (now <= start) return 0;
  if (now >= end)   return 100;
  return Math.round(((now - start) / (end - start)) * 100);
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

export default function SprintCard({ sprint, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(sprint.status === 'ACTIVE');
  const [menuOpen, setMenuOpen] = useState(false);

  const cfg      = STATUS_CONFIG[sprint.status] ?? STATUS_CONFIG.PLANNED;
  const progress = sprint.status === 'ACTIVE'    ? getProgress(sprint.startDate, sprint.endDate)
                 : sprint.status === 'COMPLETED' ? 100 : 0;
  const daysLeft = getDaysLeft(sprint.endDate);
  const isActive = sprint.status === 'ACTIVE';

  return (
    <div className={`sprint-row ${isActive ? 'sprint-row-active' : ''}`}>

      {/* ── Top bar ── */}
      <div className="sprint-row-header" onClick={() => setExpanded(e => !e)}>

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
              onClick={e => { e.stopPropagation(); onEdit(sprint); }}
            >
              Complete Sprint
            </button>
          )}
          {sprint.status === 'PLANNED' && (
            <button
              className="sprint-action-btn sprint-action-start"
              onClick={e => { e.stopPropagation(); onEdit(sprint); }}
            >
              Start Sprint
            </button>
          )}

          {/* Menu ⋯ */}
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="sprint-menu-btn" onClick={() => setMenuOpen(o => !o)}>⋯</button>
            {menuOpen && (
              <div className="sprint-dropdown" onMouseLeave={() => setMenuOpen(false)}>
                <div className="sprint-dropdown-item" onClick={() => { onEdit(sprint); setMenuOpen(false); }}>
                  ✏️ &nbsp;Modifier
                </div>
                <div className="sprint-dropdown-item danger" onClick={() => { onDelete(sprint.id); setMenuOpen(false); }}>
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
                  <div className="sprint-stat-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="sprint-stat-bar-pct">{progress}%</span>
              </div>
              <span className="sprint-stat-label">PROGRESS</span>
            </div>

            <div className="sprint-stat">
              <span className="sprint-stat-value" style={{ color: daysLeft <= 3 ? 'var(--red)' : 'var(--yellow)' }}>
                {daysLeft}
              </span>
              <span className="sprint-stat-label">DAYS LEFT</span>
            </div>
          </div>

          {/* Goal */}
          {sprint.goal && (
            <div className="sprint-row-goal">
              <span className="sprint-row-goal-label">Objectif :</span> {sprint.goal}
            </div>
          )}

        </div>
      )}
    </div>
  );
}