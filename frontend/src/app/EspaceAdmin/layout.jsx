'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/loading';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/components/admin/layoutAdmin/AdminSidebar';
import AdminHeader from '@/components/admin/layoutAdmin/AdminHeader';

import styles from '@/styles/admin/layout/AdminLayout.module.css';


export default function Layout({ children }) {
  const router = useRouter();
  const { user, role, isLoggedIn, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      const isAdmin = role === 'ADMIN'; // consistent check
      if (!isAdmin) {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.replace('/login');
        }
      }
    }
  }, [loading, role, router]);

  // While we're loading auth info, show the Loading component.
  if (loading) return <Loading />;

  // If auth check finished and user is not an admin, don't render protected UI
  const isAdmin = role === 'ADMIN';
  if (!isAdmin) return <Loading />;

  return (
    <div className={styles.adminWrapper}>
      <AdminSidebar />
      <div className={styles.adminMain}>
        <AdminHeader user={user} />
        <main className={styles.adminBody}>
          {children}
        </main>
      </div>
    </div>
  );
}