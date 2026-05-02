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
  const fields = [
    { label: 'Roles',               value: (user.roles ?? ['CLIENT']).join(', ') },
    { label: "Date d'inscription", value: fmtDate(user.createdAt) },
    { label: 'Intitulé de Poste',        value: user.postTitle ?? '—' },
    { label: 'Localisation',       value: user.location ?? '—' },
    { label: 'Compte verrouillé',  value: user.accountLocked ? 'Oui' : 'Non' },
    { label: 'Compte activé',      value: user.enabled ? 'Oui' : 'Non' },
    { label: 'Statut',             value: isBlocked(user) ? 'Bloqué' : 'Actif' },
  ];
  return (
    <div className="ud-grid">
      {fields.map(f => (
        <div key={f.label} className="ud-field">
          <span className="ud-label">{f.label}</span>
          <span className="ud-value">{f.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Cover Picture ───────────────────────────────────────── */
function CoverPicture({ src }) {
  if (!src) return null;
  return (
    <div style={{ width: '100%', height: '50%', overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
      <img src={imgUrl(src)} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
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