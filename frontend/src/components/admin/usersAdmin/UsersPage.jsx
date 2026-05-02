'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAllClients, blockClient, unblockClient } from '@/services/usersService';
import UsersToolbar from './UsersToolbar';
import UsersTable   from './UsersTable';
import LoadingState from './LoadingState';
import EmptyState   from './EmptyState';
import '@/styles/admin/users/usersAdmin.css';

function timeSince(date) {
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 10) return "à l'instant";
  if (diff < 60) return `il y a ${diff}s`;
  return `il y a ${Math.floor(diff / 60)}min`;
}

// Un utilisateur est bloqué si accountLocked === true OU enabled === false
const isBlocked = (user) => user.accountLocked || !user.enabled;

export default function UsersPage() {
  const [users,         setUsers]         = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [lastUpdate,    setLastUpdate]    = useState(new Date());
  const [actionLoading, setActionLoading] = useState(null);

  const [search,  setSearch]  = useState('');
  const [status,  setStatus]  = useState('');
  const [sortBy,  setSortBy]  = useState('fullName');
  const [sortDir, setSortDir] = useState('asc');

  // ── Fetch ─────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllClients();
      setUsers(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Impossible de charger les utilisateurs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Filter + Sort ──────────────────────────────────────────
  useEffect(() => {
    let list = [...users];

    // Recherche sur fullName et email
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }

    // Filtre statut : BLOCKED = accountLocked || !enabled ; ACTIVE = le contraire
    if (status === 'BLOCKED') list = list.filter(u => isBlocked(u));
    if (status === 'ACTIVE')  list = list.filter(u => !isBlocked(u));

    // Tri
    list.sort((a, b) => {
      const va = (a[sortBy] ?? '').toString().toLowerCase();
      const vb = (b[sortBy] ?? '').toString().toLowerCase();
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    setFiltered(list);
  }, [users, search, status, sortBy, sortDir]);

  // ── Toggle block ───────────────────────────────────────────
  const handleToggleBlock = async (user) => {
    setActionLoading(user.id);
    try {
      isBlocked(user)
        ? await unblockClient(user.id)
        : await blockClient(user.id);
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '24px 28px' }}>

      {/* Page header */}
      <div>
        <h1 className="au-heading">Gestion des Utilisateurs</h1>
        <p className="au-sub">
          {filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''} · Dernière mise à jour {timeSince(lastUpdate)}
        </p>
      </div>

      {/* Card */}
      <div className="au-card">
        <div className="au-card-header">
          <span className="au-card-title">Tous les Utilisateurs</span>
        </div>

        <UsersToolbar
          search={search}   onSearch={setSearch}
          status={status}   onStatus={setStatus}
          sortBy={sortBy}   onSortBy={setSortBy}
          sortDir={sortDir} onSortDir={setSortDir}
        />

        {loading ? (
          <LoadingState message="Chargement des utilisateurs…" />
        ) : error ? (
          <EmptyState message={`⚠️ ${error}`} onRetry={fetchUsers} />
        ) : (
          <UsersTable
            users={filtered}
            onToggleBlock={handleToggleBlock}
            actionLoading={actionLoading}
          />
        )}
      </div>

    </div>
  );
}