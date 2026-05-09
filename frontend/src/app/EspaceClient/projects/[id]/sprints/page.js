'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import SprintCard from '@/components/client/sprintClient/SprintCard';
import SprintForm from '@/components/client/sprintClient/SprintForm';
import {
  listSprintsByProject,
  createSprint,
  updateSprint,
  deleteSprint,
  startSprint,
  completeSprint,
} from '@/services/sprintService';
import { getTickets, moveTicketToSprint } from '@/services/taskService';

import '@/styles/client/ListSprintsOfMyProject/sprints.css';


export default function Page() {
  const { id } = useParams();
  const [sprints, setSprints] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [open,    setOpen]    = useState(false);
  const [edit,    setEdit]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [toast,   setToast]   = useState('');
  const [filter,  setFilter]  = useState('ALL');
  const [search,  setSearch]  = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [sprintsData, ticketsData] = await Promise.all([
        listSprintsByProject(id),
        getTickets(id),
      ]);
      setSprints(sprintsData ?? []);
      setTickets(ticketsData ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }

  async function handleSubmit(data) {
    try {
      setSaving(true);
      if (edit) {
        const updated = await updateSprint(edit.id, data);
        setSprints(s => s.map(x => x.id === updated.id ? updated : x));
        showToast('Sprint modifié.');
      } else {
        const created = await createSprint(id, data);
        setSprints(s => [...s, created]);
        showToast('Sprint créé.');
      }
      setOpen(false);
      setEdit(null);
    } catch (err) {
      showToast('Erreur : ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(sprintId) {
    if (!confirm('Supprimer ce sprint ?')) return;
    try {
      await deleteSprint(sprintId);
      setSprints(s => s.filter(x => x.id !== sprintId));
      showToast('Sprint supprimé.');
    } catch (err) {
      showToast('Erreur : ' + err.message);
    }
  }

  async function handleStartSprint(sprintId) {
    try {
      const updated = await startSprint(sprintId);
      setSprints(s => s.map(x => x.id === updated.id ? updated : x));
      showToast('Sprint démarré.');
    } catch (err) {
      showToast('Erreur : ' + err.message);
    }
  }

  async function handleCompleteSprint(sprintId) {
    try {
      const updated = await completeSprint(sprintId);
      setSprints(s => s.map(x => x.id === updated.id ? updated : x));
      showToast('Sprint terminé.');
    } catch (err) {
      showToast('Erreur : ' + err.message);
    }
  }

  async function handleRemoveTicketFromSprint(ticketId) {
    try {
      await moveTicketToSprint(ticketId, null);
      setTickets(t => t.map(x => x.id === ticketId ? { ...x, sprintId: null } : x));
      showToast('Ticket retiré du sprint.');
    } catch (err) {
      showToast('Erreur : ' + err.message);
    }
  }

  const visible = sprints.filter(sp => {
    const matchFilter = filter === 'ALL' || sp.status === filter;
    const matchSearch =
      (sp.title ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (sp.goal  ?? '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total:     sprints.length,
    active:    sprints.filter(s => s.status === 'ACTIVE').length,
    planned:   sprints.filter(s => s.status === 'PLANNED').length,
    completed: sprints.filter(s => s.status === 'COMPLETED').length,
  };

  const FILTERS = [
    { key: 'ALL',       label: 'Tous'      },
    { key: 'ACTIVE',    label: 'En cours'  },
    { key: 'PLANNED',   label: 'Planifiés' },
    { key: 'COMPLETED', label: 'Terminés'  },
  ];

  return (
    <div className="sprints-page" style={{ backgroundColor: "#F9F8F5" }}>

      {/* ── Header ── */}
      <div className="sprints-header">
        <div className="sprints-header-left">
          <h1 className="sprints-title">Sprint Management</h1>
          <p className="sprints-subtitle">
            {stats.total} sprints total · {stats.active} active · {stats.planned} planned
          </p>
        </div>
        <button className="btn-new-sprint" onClick={() => { setEdit(null); setOpen(true); }}>
          <span className="btn-new-sprint-icon">+</span>
          Create Sprint
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="sprints-toolbar">
        <div className="search-box">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--text3)" strokeWidth="1.7">
            <circle cx="5.5" cy="5.5" r="4" />
            <line x1="9" y1="9" x2="12" y2="12" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un sprint..."
          />
        </div>
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-tab ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="sprints-error">
          <span>⚠️ &nbsp;{error}</span>
          <button className="btn-retry" onClick={load}>Réessayer</button>
        </div>
      )}

      {/* ── Skeleton ── */}
      {loading && (
        <div className="sprints-list">
          {[1, 2].map(i => (
            <div key={i} className="skeleton-card" style={{ height: 180, marginBottom: 14 }}>
              <div className="skeleton-line" style={{ width: '30%', height: 14, marginBottom: 12 }} />
              <div className="skeleton-line" style={{ width: '60%', height: 10, marginBottom: 20 }} />
              <div className="skeleton-line" style={{ width: '100%', height: 8 }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Sprint list ── */}
      {!loading && visible.length > 0 && (
        <div className="sprints-list">
          {visible.map(s => (
            <SprintCard
              key={s.id}
              sprint={s}
              tickets={tickets.filter(t => String(t.sprintId) === String(s.id))}
              onEdit={sp => { setEdit(sp); setOpen(true); }}
              onDelete={handleDelete}
              onStart={handleStartSprint}
              onComplete={handleCompleteSprint}
              onRemoveTicket={handleRemoveTicketFromSprint}
            />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && visible.length === 0 && !error && (
        <div className="sprints-empty">
          <div className="sprints-empty-icon">🏃</div>
          <div className="sprints-empty-title">
            {search || filter !== 'ALL' ? 'Aucun résultat' : 'Aucun sprint pour le moment'}
          </div>
          <p className="sprints-empty-text">
            {search || filter !== 'ALL'
              ? 'Modifiez votre recherche ou filtre.'
              : 'Créez votre premier sprint pour commencer.'}
          </p>
          {!search && filter === 'ALL' && (
            <button className="btn-empty-create" onClick={() => { setEdit(null); setOpen(true); }}>
              + Créer un sprint
            </button>
          )}
        </div>
      )}

      <SprintForm
        open={open}
        initial={edit}
        onClose={() => { setOpen(false); setEdit(null); }}
        onSubmit={handleSubmit}
        loading={saving}
      />

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}