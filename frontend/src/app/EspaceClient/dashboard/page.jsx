// ← "my projects" list
'use client';

import { useState, useEffect } from 'react';
import { logout, getCurrentUser } from '@/services/authService';

export default function EspaceClientPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Espace Client</h1>

        {loadingUser ? (
          <p className="text-slate-600 mb-6">Chargement de votre profil...</p>
        ) : user ? (
          <>
            <p className="text-slate-800 text-xl font-medium mb-2">
              Bienvenue, {user.fullName || user.name || 'utilisateur'} !
            </p>
            <p className="text-slate-600 mb-6">Email : {user.email || user.sub || 'non disponible'}</p>
          </>
        ) : (
          <p className="text-slate-600 mb-6">Impossible de récupérer les informations du compte.</p>
        )}

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      </div>
    </div>
  );
}