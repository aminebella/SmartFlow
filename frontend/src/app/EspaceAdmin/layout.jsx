// app/EspaceAdmin/layout.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/loading';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/layoutAdmin/AdminSidebar';
import AdminHeader  from '@/components/admin/layoutAdmin/AdminHeader';

import styles from '@/styles/admin/layout/AdminLayout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  const { user, role, isLoggedIn, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Ferme la sidebar si on revient en desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAdmin = role === 'ADMIN';
      if (!isAdmin) {
        if (window.history.length > 1) router.back();
        else router.replace('/login');
      }
    }
  }, [loading, role, router]);

  if (loading) return <Loading />;

  const isAdmin = role === 'ADMIN';
  if (!isAdmin) return <Loading />;

  return (
    <div className={styles.adminWrapper}>

      {/* ── Sidebar : colonne gauche sticky ── */}
      <div className={styles.sidebarCol}>
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── Colonne droite : header en haut + body ── */}
      <div className={styles.adminMain}>
        <div className={styles.adminHeader}>
          <AdminHeader
            user={user}
            onMenuOpen={() => setSidebarOpen(true)}
          />
        </div>
        <main className={styles.adminBody}>
          {children}
        </main>
      </div>

    </div>
  );
}