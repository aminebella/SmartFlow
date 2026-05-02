// components/dashBordAdmin/layout/AdminHeader.jsx
'use client';

import { Bell, Search, ChevronDown, Moon } from 'lucide-react';
import styles from '@/styles/admin/layout/AdminHeader.module.css';

export default function AdminHeader({ user }) {
  const username = user?.fullName?.split(' ')[0] || 'Admin';
  const initials = (user?.fullName || 'AD')
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
        <Search size={15} className={styles.searchIcon} />
      </div>

      {/* Right */}
      <div className={styles.right}>

        {/* Cyan notification count */}
        <div className={styles.badge}>6</div>

        {/* Dark mode */}
        <button className={styles.iconBtn} aria-label="Toggle dark mode">
          <Moon size={17} />
        </button>

        {/* Bell with red dot */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={17} />
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
          <ChevronDown size={13} className={styles.arrowIcon} />
        </div>

      </div>
    </header>
  );
}