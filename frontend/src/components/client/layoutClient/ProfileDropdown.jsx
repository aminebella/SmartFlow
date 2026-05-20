'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div style={{ position: 'relative' }}>

      {/* Bouton avatar */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          padding: 0, background: 'none', border: 'none', cursor: 'pointer',
          borderRadius: '50%',
          boxShadow: '0 1px 6px rgba(201,162,39,0.35)',
        }}
      >
        <Avatar
          src={user?.profilePicture}
          name={user?.fullName || user?.email}
          size={34}
          style={{
            border: '2px solid #fff',
          }}
        />
      </button>

      {/* Menu déroulant */}
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

          {/* Header utilisateur */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar
              src={user?.profilePicture}
              name={user?.fullName || user?.email}
              size={36}
            />
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName || 'Utilisateur'}
              </p>
              <p style={{ fontSize: 11.5, color: '#A89E8C', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>

          {/* Mon profil */}
          <button
            onClick={() => { setOpen(false); router.push('/EspaceClient/profile'); }}
            style={{ width: '100%', textAlign: 'left', padding: '9px 16px', fontSize: 13, color: '#3A3530', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.target.style.background = '#F8F6F2'}
            onMouseLeave={e => e.target.style.background = 'none'}
          >
            Mon profil
          </button>

          {/* Déconnexion */}
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