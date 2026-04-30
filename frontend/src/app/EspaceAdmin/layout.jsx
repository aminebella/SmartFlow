// // ← checks role=ADMIN, redirects if not

// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { getTokenPayload } from '@/lib/auth';

// export default function AdminLayout({ children }) {
//   const router = useRouter();

//   useEffect(() => {
//     const user = getTokenPayload();
//     if (!user || !user.authorities?.includes('ADMIN')) {
//       router.replace('/login');
//     }
//   }, []);

//   return <>{children}</>;
// }
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/authService';
import AdminSidebar from '@/components/dashBordAdmin/layout/AdminSidebar';
import AdminHeader from '@/components/dashBordAdmin/layout/AdminHeader';
import styles from '@/styles/AdminLayout.module.css'; 
// 1. Importez votre composant Loading
import Loading from '@/app/loading'; 

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const userData = await getCurrentUser();
      await new Promise(resolve => setTimeout(resolve, 6000));
      const isAdmin = userData && userData.roles?.includes('ADMIN');

      if (!isAdmin) {
        router.replace('/login');
      } else {
        setUser(userData);
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2. Affichez le composant Loading ici au lieu de retourner null
  if (loading) return <Loading />; 

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