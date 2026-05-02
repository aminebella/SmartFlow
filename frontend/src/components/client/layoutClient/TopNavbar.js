'use client';

import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { getCurrentUser, logout } from "@/services/authService";
import { getProjectById } from "@/services/projectService";

const NAV_TABS = [
  { label: "Dashboard",   path: ""           },
  { label: "Backlog",     path: "/backlog"    },
  { label: "Board",       path: "/board"      },
  { label: "Sprints",     path: "/sprints"    },
  { label: "Tickets",     path: "/tickets"    },
  { label: "AI Analysis", path: "/ai", badge: "New" },
];

export default function TopNavbar() {
  const { id: projectId } = useParams();
  const pathname  = usePathname();
  const router    = useRouter();

  const [user,        setUser]        = useState(null);
  const [project,     setProject]     = useState(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchVal,   setSearchVal]   = useState("");

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => {});
    if (projectId) {
      getProjectById(projectId).then(setProject).catch(() => {});
    }
  }, [projectId]);

  const handleLogout = async () => {
    await logout();
  };

  const basePath = projectId ? `/EspaceClient/projects/${projectId}` : "";

  const initials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* ── Barre principale ── */}
      <div className="flex items-center h-14 px-4 gap-4">

        {/* Logo */}
        <button
          onClick={() => router.push("/EspaceClient/dashboard")}
          className="flex items-center gap-2 mr-2 shrink-0"
        >
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight">SmartFlow</span>
        </button>

        {/* Nav links haut niveau */}
        <nav className="hidden md:flex items-center gap-1 text-sm text-slate-600">
          <button
            onClick={() => router.push("/EspaceClient/dashboard")}
            className="px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
          >
            Your work
          </button>
          <button className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 font-medium transition flex items-center gap-1">
            Projects
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="px-3 py-1.5 rounded-md hover:bg-slate-100 transition">Teams</button>
          <button className="px-3 py-1.5 rounded-md hover:bg-slate-100 transition">Apps</button>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="hidden sm:flex items-center">
          {searchOpen ? (
            <input
              autoFocus
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onBlur={() => { setSearchOpen(false); setSearchVal(""); }}
              placeholder="Search in SmartFlow..."
              className="w-56 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition w-52"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search in SmartFlow...
            </button>
          )}
        </div>

        {/* Notifs */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* Avatar + menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xs font-bold flex items-center justify-center shadow-sm hover:shadow-md transition"
          >
            {initials(user?.fullName || user?.name || user?.email)}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.fullName || user?.name || "Utilisateur"}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
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

          {/* Nom du projet */}
          <div className="flex items-center gap-1.5 pr-4 mr-1 border-r border-slate-200 py-0.5">
            <div className="w-3 h-3 rounded-sm bg-blue-600" />
            <span className="text-sm font-semibold text-slate-700 truncate max-w-[160px]">
              {project?.name ?? "Projet"}
            </span>
          </div>

          {/* Onglets */}
          <nav className="flex items-center overflow-x-auto scrollbar-hide">
            {NAV_TABS.map(({ label, path, badge }) => {
              const href      = `${basePath}${path}`;
              const isActive  = pathname === href || (path === "" && pathname === basePath);
              return (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className={`relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition -mb-px ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  {label}
                  {badge && (
                    <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full leading-none">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* Bouton Create */}
          <button
            onClick={() => router.push(`${basePath}/tickets`)}
            className="ml-2 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm transition shrink-0"
          >
            <span className="text-base font-light leading-none">+</span>
            Create
          </button>
        </div>
      )}
    </header>
  );
}