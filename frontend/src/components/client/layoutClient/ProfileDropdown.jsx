'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/services/authService';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => {});
  }, []);

  const initials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
        }}
      >
        {initials(user?.fullName || user?.name || user?.email)}
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
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0EDE8' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName || user?.name || 'Utilisateur'}
            </p>
            <p style={{ fontSize: 11.5, color: '#A89E8C', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || ''}
            </p>
          </div>
          <button onClick={() => { setOpen(false); router.push('/EspaceClient/dashboard'); }}
            style={{ width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#3A3530', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.background = '#F8F6F2'}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            Mon profil
          </button>
          <button onClick={() => logout()}
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