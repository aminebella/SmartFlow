// components/dashBordAdmin/layout/AdminSidebar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Users, Settings, LogOut } from 'lucide-react';
import { logout, getCurrentUser } from '@/services/authService';
import styles from '@/styles/admin/layout/AdminSidebar.module.css';

const navLinks = [
  { href: '/EspaceAdmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/EspaceAdmin/projects',  label: 'Projects',  icon: FolderKanban },
  { href: '/EspaceAdmin/users',     label: 'Users',     icon: Users },
  { href: '/EspaceAdmin/settings',  label: 'Settings',  icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getCurrentUser();
      setUser(data);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try { await logout(); }
    catch (error) { console.error('Erreur lors de la déconnexion :', error); }
  };

  const name     = user?.fullName || 'Admin';
  const email    = user?.email    || 'admin@gmail.com';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className={styles.sidebar}>

      {/* ── Brand ── */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>SF</div>
        <div>
          <div className={styles.brandName}>SmartFlow</div>
          <div className={styles.brandSub}>Admin Panel</div>
        </div>
      </div>

      {/* ── Profile ── */}
      <div className={styles.header}>
        <div className={styles.profileInfo}>
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Avatar" className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
          <div className={styles.profileText}>
            <span className={styles.profileName}>{name}</span>
            <span className={styles.profileEmail}>{email}</span>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>Pages</div>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ── */}
      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}