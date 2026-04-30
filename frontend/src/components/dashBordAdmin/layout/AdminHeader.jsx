// components/dashBordAdmin/layout/AdminHeader.jsx
'use client';

import { Bell, Search, ChevronDown, Moon } from 'lucide-react';
import styles from '@/styles/AdminHeader.module.css';

export default function AdminHeader({ user }) {
  const username = user?.fullName?.split(' ')[0] || 'Nirmal';
  const initials = (user?.fullName || 'NK')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className={styles.header}>
      {/* Left: Welcome */}
      <div className={styles.left}>
        <h1 className={styles.welcome}>Welcome {username} !</h1>
      </div>

      {/* Center: Search */}
      <div className={styles.searchBar}>
        <input
          type="search"
          placeholder="Search..."
          className={styles.searchInput}
        />
        <Search size={16} className={styles.searchIcon} />
      </div>

      {/* Right: badge + moon + bell + avatar */}
      <div className={styles.right}>
        {/* Blue notification count badge (as seen in image) */}
        <div className={styles.badge}>6</div>

        {/* Dark mode toggle */}
        <button className={styles.iconBtn} aria-label="Toggle dark mode">
          <Moon size={18} />
        </button>

        {/* Bell with red dot */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} />
          <span className={styles.notificationBadge}></span>
        </button>

        {/* Avatar + chevron */}
        <div className={styles.userProfileMenu}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User"
              className={styles.smallAvatar}
            />
          ) : (
            <div className={styles.avatarFallback}>{initials}</div>
          )}
          <ChevronDown size={14} className={styles.arrowIcon} />
        </div>
      </div>
    </header>
  );
}