'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTickets } from "../../../../../hooks/useTickets.js";
import TicketTable        from "../../../../../components/task/TicketTable.jsx";
import TicketModal        from "../../../../../components/task/TicketModal.jsx";
import TicketDeleteModal  from "../../../../../components/task/TicketDeleteModal.jsx";
import TicketFilterPanel  from "../../../../../components/task/TicketFilterPanel.jsx";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Construit et déclenche le téléchargement d'un CSV */
function exportToCSV(tickets, members, sprints, projectId) {
  const header = ["KEY", "TITLE", "EPIC", "PRIORITY", "STATUS", "ASSIGNEE", "SPRINT", "UPDATED"];
  const rows = tickets.map((t) => {
    const assignee = members.find((m) => m.id === t.assigneeId);
    const sprint   = sprints.find((s)  => s.id === t.sprintId);
    return [
      t.key || t.id,
      t.title,
      t.epic || "",
      t.priority,
      t.status,
      assignee ? (assignee.fullName || assignee.name || assignee.email) : "",
      sprint   ? sprint.name : "",
      t.updatedAt || "",
    ];
  });

  const csv = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `tickets-project-${projectId}.csv`;
  a.click();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TicketsPage() {
  const { id: projectId } = useParams();

  // ── Data ──
  const {
    tickets, sprints, members,
    loading, error, activeSprint,
    addTicket, editTicket, removeTicket,
  } = useTickets(projectId);

  // ── UI state ──
  const [tab,         setTab]         = useState("all");   // "all" | "mine" | "unassigned"
  const [showFilter,  setShowFilter]  = useState(false);
  const [filters,     setFilters]     = useState({ priority: "", status: "", assigneeId: "", sprintId: "" });

  // Modals
  const [showCreate,   setShowCreate]   = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);   // ticket à éditer
  const [deleteTarget, setDeleteTarget] = useState(null);   // ticket à supprimer

  // ── Filtering ──
  const filtered = tickets.filter((t) => {
    if (tab === "mine"       && !t.isAssignedToMe) return false;
    if (tab === "unassigned" && t.assigneeId)      return false;
    if (filters.priority   && t.priority   !== filters.priority)                       return false;
    if (filters.status     && t.status     !== filters.status)                         return false;
    if (filters.assigneeId && String(t.assigneeId) !== String(filters.assigneeId))     return false;
    if (filters.sprintId   && String(t.sprintId)   !== String(filters.sprintId))       return false;
    return true;
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ══ Header ══════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tickets</h1>
            {!loading && (
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{tickets.length} total</span>
                {activeSprint && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-green-600 font-medium">{activeSprint.name} actif</span>
                    </span>
                  </>
                )}
              </p>
            )}
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <span className="text-lg leading-none font-light">+</span>
            New Ticket
          </button>
        </div>

        {/* ══ Card principale ══════════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">

          {/* ── Tabs + boutons ── */}
          <div className="flex items-center justify-between px-4 border-b border-slate-100">

            {/* Tabs */}
            <div className="flex">
              {[
                ["all",        "All"],
                ["mine",       "My Tickets"],
                ["unassigned", "Unassigned"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTab(val)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
                    tab === val
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Export + Filter */}
            <div className="flex items-center gap-2 relative">
              {/* Export CSV */}
              <button
                onClick={() => exportToCSV(filtered, members, sprints, projectId)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilter((v) => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition ${
                  activeFiltersCount > 0 || showFilter
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "text-slate-600 bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filter
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Filtre dropdown */}
              {showFilter && (
                <TicketFilterPanel
                  filters={filters}
                  onChange={setFilters}
                  members={members}
                  sprints={sprints}
                  onClose={() => setShowFilter(false)}
                />
              )}
            </div>
          </div>

          {/* ── Contenu ── */}
          {loading ? (
            /* Skeleton / spinner */
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <span className="ml-3 text-slate-400 text-sm">Chargement…</span>
            </div>

          ) : error ? (
            /* Erreur */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-slate-500 text-sm mb-3">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 text-sm hover:underline"
              >
                Réessayer
              </button>
            </div>

          ) : filtered.length === 0 ? (
            /* État vide */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-slate-700 font-semibold mb-1">Aucun ticket trouvé</h3>
              <p className="text-slate-400 text-sm mb-5">
                {tickets.length === 0
                  ? "Créez votre premier ticket pour commencer."
                  : "Essayez d'ajuster vos filtres."}
              </p>
              {tickets.length === 0 && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  + New Ticket
                </button>
              )}
            </div>

          ) : (
            /* Tableau */
            <>
              <TicketTable
                tickets={filtered}
                members={members}
                sprints={sprints}
                onEdit={(t) => setEditTarget(t)}
                onDelete={(t) => setDeleteTarget(t)}
              />
              {/* Compteur bas de tableau */}
              <div className="border-t border-slate-50 py-3 text-center text-xs text-slate-400">
                Affichage de{" "}
                <span className="font-medium text-slate-500">{filtered.length}</span>
                {" "}sur{" "}
                <span className="font-medium text-slate-500">{tickets.length}</span>
                {" "}tickets
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => setFilters({ priority: "", status: "", assigneeId: "", sprintId: "" })}
                    className="ml-3 text-blue-500 hover:underline"
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══ Modals ═══════════════════════════════════════════════════════════ */}

      {/* Création */}
      {showCreate && (
        <TicketModal
          ticket={null}
          sprints={sprints}
          members={members}
          onClose={() => setShowCreate(false)}
          onSubmit={(data) => addTicket(data)}
        />
      )}

      {/* Édition */}
      {editTarget && (
        <TicketModal
          ticket={editTarget}
          sprints={sprints}
          members={members}
          onClose={() => setEditTarget(null)}
          onSubmit={(data) => editTicket(editTarget.id, data)}
        />
      )}

      {/* Suppression */}
      {deleteTarget && (
        <TicketDeleteModal
          ticket={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => removeTicket(deleteTarget.id)}
        />
      )}
    </div>
  );
}