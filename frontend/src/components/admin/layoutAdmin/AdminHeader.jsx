// components/admin/layoutAdmin/AdminHeader.jsx
'use client';

import { Bell, Search, ChevronDown, Settings, Menu, Home, LogOut, BellRing } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/styles/admin/layout/AdminHeader.module.css';

export default function AdminHeader({ onMenuOpen }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = (user?.fullName || 'AD')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const segments = pathname.split('/').filter(Boolean);
  const currentPage = segments[segments.length - 1];
  const pageLabel = currentPage
    ? currentPage.charAt(0).toUpperCase() + currentPage.slice(1)
    : 'Dashboard';

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.header}>

        {/* ── Left: hamburger (mobile) + breadcrumb ── */}
        <div className={styles.left}>
          {/* Bouton hamburger — visible uniquement sur mobile */}
          <button
            className={styles.menuBtn}
            onClick={onMenuOpen}
            aria-label="Ouvrir le menu"
          >
            <Menu size={19} />
          </button>

          <div className={styles.breadcrumb}>
            <Home size={16} />
            <span>/</span> {pageLabel}
          </div>
        </div>

        {/* ── Right ── */}
        <div className={styles.right}>
          <div className={styles.separator} />

          {/* Bell */}
          <button className={styles.iconBtn}>
            <BellRing size={17} />
            <span className={styles.notificationBadge} />
          </button>

          <div className={styles.separator} />

          {/* Avatar + chevron */}
          <div className={styles.userProfileMenu}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="User"
                className={styles.smallAvatar}
              />
            ) : (
              <div className={styles.avatarFallback}>{initials}</div>
            )}
            <span className={styles.userName}>{user?.fullName || 'Admin'}</span>
            <button
              className={styles.logoutBtn}
              onClick={logout}
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
            <ChevronDown size={13} className={styles.arrowIcon} />
          </div>
        </div>

      </header>
    </div>
  );
}