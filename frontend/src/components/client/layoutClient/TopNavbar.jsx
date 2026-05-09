'use client';

import { useState, useEffect, useRef} from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getCurrentUser, logout } from "@/services/authService";
import { getProjectById } from "@/services/projectService";

import styles from '@/styles/client/projectHeader/header.module.css';
import { Avatar } from '@/components/ui/Avatar';

const NAV_TABS = [
  { label: "Dashboard",   path: "/dashboard"  },
  { label: "Tasks",       path: "/tasks"      },
  { label: "Sprints",     path: "/sprints"    },
  { label: "Board",       path: "/board"      },
  { label: "AI Analysis", path: "/ai", badge: "New" },
  { label: "Parameters",  path: "/parameter"  }
];

const API = "http://localhost:8080/api/v1";

// ── Icônes par type de notification ──
const NOTIF_ICONS = {
  TASK_ASSIGNED:     "📋",
  STATUS_CHANGED:    "🔄",
  ADDED_TO_PROJECT:  "📁",
  SPRINT_STARTED:    "🚀",
  SPRINT_ENDED:      "✅",
  COMMENT_ADDED:     "💬",
};



export default function TopNavbar() {
  const { id: projectId } = useParams();
  const pathname  = usePathname();
  const router    = useRouter();

  const [user,     setUser]     = useState(null);
  const [project,  setProject]  = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => {});
    if (projectId) {
      getProjectById(projectId).then(setProject).catch(() => {});
    }
  }, [projectId]);

  // ── Notifications state ──
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => {});
    if (projectId) {
      getProjectById(projectId).then(setProject).catch(() => {});
    }
  }, [projectId]);

  // ── Polling toutes les 30 secondes ──
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // ── Fermer dropdown si clic en dehors ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch unread count (badge) ──
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API}/notifications/unread-count`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setUnreadCount(json.data?.count ?? 0);
      }
    } catch {}
  };

  // ── Fetch toutes les notifs (au clic sur la cloche) ──
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/notifications`, {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data ?? []);
      }
    } catch {}
  };

  // ── Ouvrir/fermer le dropdown ──
  const toggleNotif = async () => {
    if (!notifOpen) {
      await fetchNotifications();
    }
    setNotifOpen((v) => !v);
    setMenuOpen(false);
  };

  // ── Marquer une notif comme lue ──
  const markAsRead = async (id) => {
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  // ── Marquer toutes comme lues ──
  const markAllAsRead = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PUT",
        credentials: "include",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  // ── Formater la date ──
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now  = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60)   return "À l'instant";
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString("fr-FR");
  };

  const handleLogout = async () => {
    await logout();
  };

  const basePath = projectId ? `/EspaceClient/projects/${projectId}` : "";

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* ── Barre principale ── */}
      <div className="flex items-center h-14 px-4 gap-4">

        {/* Logo */}
        <button
          onClick={() => router.push("/EspaceClient/dashboard")}
          className="flex items-center gap-2 mr-2 shrink-0"
        >
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
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 text-sm text-slate-600">
          <button
            onClick={() => router.push("/EspaceClient/dashboard")}
            className="px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
          >
            Dashboard
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium transition flex items-center gap-1"
            onClick={() => router.push("/EspaceClient/projects")}
          >
            Projects
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium transition flex items-center gap-1"
            onClick={() => router.push(`/EspaceClient/projects/${projectId}/teams`)}
          >
            Teams
          </button>
          {/* <button
            className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium transition flex items-center gap-1"
            onClick={() => router.push(`/EspaceClient/projects/${projectId}/parameter`)}
          >
            Parameter
          </button> */}
        </nav>

        <div className="flex-1" />

        {/* ── Cloche Notifications ── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={toggleNotif}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

        {/* ── Dropdown Notifications ── */}
          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    Tout marquer lu
                  </button>
                )}
              </div>

              {/* Liste */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <svg className="w-10 h-10 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-sm">Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 cursor-pointer transition hover:bg-slate-50 ${
                        !notif.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      {/* Icône type */}
                      <span className="text-lg shrink-0 mt-0.5">
                        {NOTIF_ICONS[notif.type] ?? "🔔"}
                      </span>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!notif.read ? "font-medium text-slate-800" : "text-slate-600"}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>

                      {/* Point bleu si non lu */}
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-slate-100 text-center">
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium transition">
                    Voir toutes les notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Avatar + menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Avatar
              src={user?.profilePicture}
              name={user?.fullName || user?.name || user?.email}
              size={32}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                <Avatar
                  src={user?.profilePicture}
                  name={user?.fullName || user?.name || user?.email}
                  size={32}
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.fullName || user?.name || "Utilisateur"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
                </div>
              </div>
              <button
                onClick={() => { setMenuOpen(false); router.push("/EspaceClient/dashboard"); }}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
              >
                Mon profil
              </button>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Barre projet (sous-navigation) ── */}
      {projectId && (
        <div className="flex items-center gap-1 px-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-1.5 pr-4 mr-1 border-r border-slate-200 py-0.5">
            <div className={styles.goldBox} />
            <span className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">
              {project?.name ?? "Projet"}
            </span>
          </div>

          <nav className="flex items-center overflow-x-auto scrollbar-hide">
            {NAV_TABS.map(({ label, path, badge }) => {
              const href     = `${basePath}${path}`;
              const isActive = pathname === href || (path === "" && pathname === basePath);
              return (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className={`relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition -mb-px ${
                    isActive
                      ? styles.activeTab
                      : `border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 ${styles.tabHover}`
                  }`}
                >
                  {label}
                  {badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${styles.goldBadge}`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex-1" />
        </div>
      )}
    </header>
  );
}