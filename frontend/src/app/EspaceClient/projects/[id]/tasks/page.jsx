'use client';

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTickets } from "@/hooks/useTickets.js";
import TicketTable       from "@/components/client/tasksClient/TicketTable.jsx";
import TicketModal       from "@/components/client/tasksClient/TicketModal.jsx";
import TicketDeleteModal from "@/components/client/tasksClient/TicketDeleteModal.jsx";
import TicketHeader      from "@/components/client/tasksClient/TicketHeader.jsx";
import TicketTabs        from "@/components/client/tasksClient/TicketTabs.jsx";
import TicketFooter      from "@/components/client/tasksClient/TicketFooter.jsx";

const PAGE_SIZE = 7;

export default function TicketsPage() {
  const { id: projectId } = useParams();

  const {
    tickets, sprints, members,
    loading, error, activeSprint,
    addTicket, editTicket, removeTicket,
  } = useTickets(projectId);

  const [tab,          setTab]          = useState("all");
  const [showFilter,   setShowFilter]   = useState(false);
  const [filters,      setFilters]      = useState({ priority: "", status: "", assigneeId: "", sprintId: "" });
  const [showCreate,   setShowCreate]   = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage,  setCurrentPage]  = useState(1);

  // ── Filtrage ──────────────────────────────────────────────────────
  const filtered = tickets.filter((t) => {
    if (tab === "mine"       && !t.isAssignedToMe) return false;
    if (tab === "unassigned" && t.assigneeId)      return false;
    if (filters.priority   && t.priority   !== filters.priority)                   return false;
    if (filters.status     && t.status     !== filters.status)                     return false;
    if (filters.assigneeId && String(t.assigneeId) !== String(filters.assigneeId)) return false;
    if (filters.sprintId   && String(t.sprintId)   !== String(filters.sprintId))   return false;
    return true;
  });

  // ── Pagination ────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // ── Handlers ──────────────────────────────────────────────────────
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ priority: "", status: "", assigneeId: "", sprintId: "" });
    setCurrentPage(1);
  };

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F8F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <TicketHeader
          count={tickets.length}
          activeSprint={activeSprint}
          loading={loading}
          onCreateClick={() => setShowCreate(true)}
        />

        {/* Card principale */}
        <div className="bg-white rounded-xl shadow-sm overflow-visible"
          style={{ border: '1px solid #e8e0cc' }}>

          {/* Tabs + Export + Filter */}
          <TicketTabs
            tab={tab}
            onTabChange={handleTabChange}
            showFilter={showFilter}
            onToggleFilter={() => setShowFilter(v => !v)}
            activeFiltersCount={activeFiltersCount}
            filtered={filtered}
            members={members}
            sprints={sprints}
            projectId={projectId}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onCloseFilter={() => setShowFilter(false)}
          />

          {/* Contenu */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2"
                style={{ borderColor: '#c9b479' }} />
              <span className="ml-3 text-slate-400 text-sm">Chargement…</span>
            </div>

          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-slate-500 text-sm mb-3">{error}</p>
              <button onClick={() => window.location.reload()}
                className="text-sm hover:underline" style={{ color: '#c9b479' }}>
                Réessayer
              </button>
            </div>

          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-slate-700 font-semibold mb-1">Aucun ticket trouvé</h3>
              <p className="text-slate-400 text-sm mb-5">
                {tickets.length === 0
                  ? "Créez votre premier ticket pour commencer."
                  : "Essayez d'ajuster vos filtres."}
              </p>
              {tickets.length === 0 && (
                <button onClick={() => setShowCreate(true)}
                  className="text-white text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 transition"
                  style={{ backgroundColor: '#c9b479' }}>
                  + New Ticket
                </button>
              )}
            </div>

          ) : (
            <>
              <TicketTable
                tickets={paginated}
                members={members}
                sprints={sprints}
                onEdit={(t) => setEditTarget(t)}
                onDelete={(t) => setDeleteTarget(t)}
              />
              <TicketFooter
                filteredCount={filtered.length}
                totalCount={tickets.length}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={handleClearFilters}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <TicketModal ticket={null} sprints={sprints} members={members}
          onClose={() => setShowCreate(false)}
          onSubmit={(data) => addTicket(data)} />
      )}
      {editTarget && (
        <TicketModal ticket={editTarget} sprints={sprints} members={members}
          onClose={() => setEditTarget(null)}
          onSubmit={(data) => editTicket(editTarget.id, data)} />
      )}
      {deleteTarget && (
        <TicketDeleteModal ticket={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => removeTicket(deleteTarget.id)} />
      )}
    </div>
  );
}