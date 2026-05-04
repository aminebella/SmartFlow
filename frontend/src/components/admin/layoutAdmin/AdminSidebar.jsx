// components/admin/layoutAdmin/AdminSidebar.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  BarChart2,
  Bell,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClient';
import styles from '@/styles/admin/layout/AdminSidebar.module.css';

const mainLinks = [
  { href: '/EspaceAdmin/dashboard',     label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/EspaceAdmin/projects',      label: 'Projets',          icon: FolderKanban },
  { href: '/EspaceAdmin/users',         label: 'Utilisateurs',     icon: Users },
];

const configLinks = [
  { href: '/EspaceAdmin/settings',      label: 'Paramètres',       icon: Settings },
  { href: '/EspaceAdmin/reports',       label: 'Rapports',         icon: BarChart2 },
  { href: '/EspaceAdmin/notifications', label: 'Notifications',    icon: Bell },
];

function NavLink({ href, label, icon: Icon, badge, onClose, pathname }) {
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`${styles.link} ${isActive ? styles.active : ''}`}
      onClick={onClose}
    >
      <Icon size={16} />
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={styles.badge}>{badge}</span>
      )}
    </Link>
  );
}

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { role } = useAuth();
  const { projects } = useProjects(role);
  const { count: usersCount } = useClients(role);

  // Create links with dynamic badges
  const mainLinksWithBadges = [
    { href: '/EspaceAdmin/dashboard',     label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/EspaceAdmin/projects',      label: 'Projets',          icon: FolderKanban,   badge: Array.isArray(projects) ? projects.length : 0 },
    { href: '/EspaceAdmin/users',         label: 'Utilisateurs',     icon: Users,           badge: usersCount || 0 },
  ];

  const configLinksWithBadges = [
    { href: '/EspaceAdmin/settings',      label: 'Paramètres',       icon: Settings },
    { href: '/EspaceAdmin/reports',       label: 'Rapports',         icon: BarChart2 },
    { href: '/EspaceAdmin/notifications', label: 'Notifications',    icon: Bell,            badge: 0 }, // TODO: Add notifications hook when available
  ];

  return (
    <>
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div className={`${styles.sidebarWrapper} ${isOpen ? styles.open : ''}`}>
        <aside className={styles.sidebar}>

          {/* Bouton × — mobile only */}
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>

          {/* ── Brand / Logo ── */}
          <div className={styles.brand}>
            <Image
              src="/favicon.png"
              alt="SmartFlow"
              width={400}
              height={200}
              priority
              className={styles.logoImage}
            />
          </div>

          {/* ── Nav ── */}
          <nav className={styles.nav}>

            {/* Main links — no section label */}
            {mainLinksWithBadges.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                onClose={onClose}
                pathname={pathname}
              />
            ))}

            {/* Configuration section */}
            <div className={styles.navSection}>Configuration</div>

            {configLinksWithBadges.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                onClose={onClose}
                pathname={pathname}
              />
            ))}

          </nav>

        </aside>
      </div>
    </>
  );
}