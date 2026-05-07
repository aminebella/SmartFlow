'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const imgUrl = (path) => {
  if (!path || typeof path !== 'string' || !path.trim()) return null;
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `${BASE_URL}/${trimmed.replace(/^\//, '').split('/').map(encodeURIComponent).join('/')}`;
};

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const initials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const avatarSrc = !imgError ? imgUrl(user?.profilePicture) : null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: 34, height: 34,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9A227, #8A6A0A)',
          color: '#fff',
          fontSize: 12,
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff',
          boxShadow: '0 1px 6px rgba(201,162,39,0.35)',
          cursor: 'pointer',
          overflow: 'hidden',
          padding: 0,
        }}
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={user?.fullName || 'avatar'}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        ) : (
          initials(user?.fullName || user?.email)
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 42,
          width: 200,
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #E8E6E0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          overflow: 'hidden',
          zIndex: 100,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #C9A227, #8A6A0A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', fontSize: 12, fontWeight: 700, color: '#fff',
            }}>
              {avatarSrc ? (
                <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initials(user?.fullName || user?.email)
              )}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName || 'Utilisateur'}
              </p>
              <p style={{ fontSize: 11.5, color: '#A89E8C', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setOpen(false); router.push('/EspaceClient/profile'); }}
            style={{ width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#3A3530', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.background = '#F8F6F2'}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            Mon profil
          </button>
          <button
            onClick={() => logout()}
            style={{ width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#C0401A', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.background = '#FDF1EE'}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}