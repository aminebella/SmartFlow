'use client';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import { getClientById, blockClient, unblockClient } from '@/services/usersService';
import LoadingState from './LoadingState';
import EmptyState   from './EmptyState';
import '@/styles/admin/users/usersAdmin.css';


/* ── helpers ─────────────────────────────────────────────── */
const COLORS    = ['#0073ea','#00c875','#ffb900','#e2445c','#784bd1','#00cec9','#fd79a8'];
const BASE_URL  = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

// Construit l'URL complète si le chemin est relatif (commence par "/uploads/...")
const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path}`;
};

const getInitials = (fullName = '') => {
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  return fullName.charAt(0).toUpperCase() || '?';
};

const getColor = (fullName = '') => COLORS[fullName.charCodeAt(0) % COLORS.length];
const fmtDate  = (d) => d
  ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  : '—';

const isBlocked = (user) => user.accountLocked || !user.enabled;

/* ── UserProfileHeader ───────────────────────────────────── */
function UserProfileHeader({ user, onToggleBlock, loading }) {
  const blocked = isBlocked(user);
  return (
    <div className="ud-profile-section">
      {/* Avatar */}
      <div className="ud-avatar-lg" style={{ backgroundColor: getColor(user.fullName ?? '') }}>
        {imgUrl(user.profilePicture)
          ? <img src={imgUrl(user.profilePicture)} alt={user.fullName} className="ud-avatar-img" />
          : getInitials(user.fullName)
        }
      </div>

      {/* Info */}
      <div className="ud-profile-info">
        <h2 className="ud-name">{user.fullName}</h2>
        <p className="ud-email">{user.email}</p>
        {user.postTitle && (
          <p style={{ fontSize: 12.5, color: '#676f8d', margin: '2px 0 0' }}>{user.postTitle}</p>
        )}
        <span className={`badge ${blocked ? 'badge-blocked' : 'badge-active'}`} style={{ marginTop: 6 }}>
          {blocked ? 'Bloqué' : 'Actif'}
        </span>
      </div>

      {/* Action */}
      <div className="ud-header-action">
        <button
          className={blocked ? 'btn-success' : 'btn-danger'}
          onClick={onToggleBlock}
          disabled={loading}
        >
          {loading ? <span className="btn-spin" /> : blocked ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
              </svg>
              Débloquer
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="12" cy="12" r="10"/>
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
              </svg>
              Bloquer
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── UserInfoGrid ────────────────────────────────────────── */
function UserInfoGrid({ user }) {
  const [activeTab, setActiveTab] = useState('info');

  const tabStyle = (tab) => ({
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: activeTab === tab ? '#0073ea' : 'var(--color-text-secondary)',
    borderBottom: activeTab === tab ? '2px solid #0073ea' : '2px solid transparent',
  });

  return (
    <div style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}>

      {/* ─── Onglets ─── */}
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--color-border-tertiary)', padding: '0 16px' }}>
        <button style={tabStyle('info')} onClick={() => setActiveTab('info')}>
          Vue d'ensemble
        </button>
        <button style={tabStyle('projects')} onClick={() => setActiveTab('projects')}>
          Projets ({user.projects?.length ?? 0})
        </button>
      </div>
{/* ─── Contenu onglet infos ─── */}
{activeTab === 'info' && (
  <div style={{ padding: '14px 16px' }}>
    {[
      { label: 'Nom complet',        value: user.fullName ?? '—' },
      { label: 'Email',              value: user.email ?? '—' },
      { label: 'Rôles',              value: (user.roles ?? []).join(', ') },
      { label: "Date d'inscription", value: fmtDate(user.createdAt) },
      { label: 'Intitulé de poste',  value: user.postTitle ?? '—' },
      { label: 'Localisation',       value: user.location ?? '—' },
      { label: 'Compte verrouillé',  value: user.accountLocked ? 'Oui' : 'Non' },
      { label: 'Compte activé',      value: user.enabled ? 'Oui' : 'Non' },
    ].map((f, i, arr) => (
      <div key={f.label} style={{
        display: 'grid',
        gridTemplateColumns: '160px 1fr',  // ← label fixe, valeur juste à côté
        gap: 8,
        padding: '10px 0',
        borderBottom: i < arr.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
      }}>
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{f.label}</span>
        <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{f.value}</span>
      </div>
    ))}
  </div>
)}
{/* ─── Contenu onglet projets ─── */}
{activeTab === 'projects' && (
  <div style={{ padding: '14px 16px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {user.projects?.length > 0 ? user.projects.map(p => (
        <div key={p.id} style={{
          background: 'var(--color-background-primary)',
          borderRadius: 12,
          border: '0.5px solid var(--color-border-tertiary)',
          overflow: 'hidden',
        }}>
          {/* ─── Header ─── */}
          <div style={{
            padding: '10px 14px',
            background: 'var(--color-background-secondary)',
            borderBottom: '0.5px solid var(--color-border-tertiary)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6 }}>
              {p.name}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: '#eff6ff', color: '#185fa5' }}>
                {p.myRole}
              </span>
              <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: '#f0fdf4', color: '#3b6d11' }}>
                {p.status}
              </span>
            </div>
          </div>

       {/* ─── Fields ─── */}
<div style={{ padding: '0 14px' }}>
  {[
    { label: 'Description',   value: p.description ?? '—' },
    { label: 'Début estimé',  value: fmtDate(p.estimatedStartDate) },
    { label: 'Fin estimée',   value: fmtDate(p.estimatedEndDate) },
    { label: 'Budget estimé', value: p.estimatedBudget ? `${p.estimatedBudget.toLocaleString()} MAD` : '—' },
    { label: 'Budget réel',   value: (p.realBudget && p.realBudget > 0) ? `${p.realBudget.toLocaleString()} MAD` : '—' },
    { label: 'Membres',       value: `${p.memberCount} membre${p.memberCount !== 1 ? 's' : ''}` },
  ].map((f, i, arr) => (
    <div key={f.label} style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr',  // ← label fixe, valeur prend le reste
      gap: 8,
      padding: '8px 0',
      borderBottom: i < arr.length - 1 ? '0.5px solid var(--color-border-tertiary)' : 'none',
    }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{f.label}</span>
      <span style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>{f.value}</span>
    </div>
  ))}
</div>
        </div>
      )) : (
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center', paddingTop: 12, gridColumn: '1 / -1' }}>
          Aucun projet
        </p>
      )}
    </div>
  </div>
)}
    </div>
  );
}

function CoverPicture({ src }) {
  if (!src) return <div style={{ width:'100%', height:120, background:'var(--color-background-secondary)', borderRadius:'12px 12px 0 0' }} />;
  return <img src={imgUrl(src)} alt="cover" style={{ width:'100%', height:120, objectFit:'cover', borderRadius:'12px 12px 0 0', display:'block' }} />;
}
/* ── Main ────────────────────────────────────────────────── */
export default function UserDetails({ userId }) {
  const router = useRouter();
  const [user,          setUser]          = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true); setError(null);
      setUser(await getClientById(userId));
    } catch { setError('Impossible de charger cet utilisateur.'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchUser(); }, [userId]);

  const handleToggleBlock = async () => {
    if (!user) return;
    setActionLoading(true);
    try {
      isBlocked(user)
        ? await unblockClient(user.id)
        : await blockClient(user.id);
      await fetchUser();
    } catch (err) { console.error(err); }
    finally       { setActionLoading(false); }
  };

  return (
    <div className="user-detail-root" style={{ padding: '24px 28px' }}>

      {/* Back */}
      <button className="au-back-btn" onClick={() => router.push('/EspaceAdmin/users')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Retour aux utilisateurs
      </button>

      {/* Header */}
      <div className="ud-header">
        <div>
          <h1 className="ud-title">Détail de l'Utilisateur</h1>
          <p className="ud-sub">Profil complet · ID #{userId}</p>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="au-card"><LoadingState message="Chargement du profil…" /></div>
      ) : error ? (
        <div className="au-card"><EmptyState message={`⚠️ ${error}`} onRetry={fetchUser} /></div>
      ) : user ? (
        <div className="au-card">
          {/* Cover picture en haut si disponible */}
          <CoverPicture src={user.coverPicture} />
          <UserProfileHeader user={user} onToggleBlock={handleToggleBlock} loading={actionLoading} />
          <div className="ud-divider" />
          <UserInfoGrid user={user} />
        </div>
      ) : null}

    </div>
  );
}