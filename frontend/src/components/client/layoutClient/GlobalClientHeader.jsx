"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileDropdown from './ProfileDropdown';
import styles from '@/styles/client/globalDashboard/GlobalDashboardClient.module.css';

export default function GlobalClientHeader() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/" aria-label="SmartFlow home">
          <Image
            src="/favicon.png"
            alt="SmartFlow"
            width={180}
            height={60}
            priority
            className={styles.logoImage}
          />
        </Link>
      </div>

      <div className={styles.headerRight}>
        <nav className={styles.navWrapper}>
          <Link
            href="/EspaceClient/dashboard"
            className={`${styles.navButton} ${pathname === '/EspaceClient/dashboard' ? styles.navButtonActive : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/EspaceClient/projects"
            className={`${styles.navButton} ${pathname === '/EspaceClient/projects' ? styles.navButtonActive : ''}`}
          >
            Projects
          </Link>
        </nav>
        <ProfileDropdown />
      </div>
    </header>
  );
}