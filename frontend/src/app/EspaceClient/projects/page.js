'use client';

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTickets } from "@/hooks/useTickets.js";
import { updateTicketStatus, assignTicket, moveTicketToSprint } from "@/services/taskService.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIORITY_STYLES = {
  CRITICAL: "bg-red-100 text-red-700 border border-red-200",
  HIGH:     "bg-orange-100 text-orange-700 border border-orange-200",
  MEDIUM:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  LOW:      "bg-slate-100 text-slate-600 border border-slate-200",
};

const STATUS_STYLES = {
  TODO:        "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW:      "bg-purple-100 text-purple-700",
  DONE:        "bg-green-100 text-green-700",
  BLOCKED:     "bg-red-100 text-red-700",
};

const PRIORITY_DOT = {
  CRITICAL: "bg-red-500",
  HIGH:     "bg-orange-500",
  MEDIUM:   "bg-yellow-400",
  LOW:      "bg-slate-400",
};

const ALL_STATUSES  = ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED"];
const ALL_PRIORITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function avatarColor(name = "") {
  const colors = ["bg-blue-500","bg-emerald-500","bg-violet-500","bg-rose-500","bg-amber-500","bg-cyan-500"];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffff;
  return colors[hash % colors.length];
}

function initials(member) {
  if (!member) return "?";
  const name = member.fullName || member.name || member.email || "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getMemberName(member) {
  if (!member) return "—";
  return member.fullName || member.name || member.email || "—";
}

function exportToCSV(tickets, members, sprints, projectId) {
  const header = ["KEY","TITLE","EPIC","PRIORITY","STATUS","ASSIGNEE","SPRINT","UPDATED"];
  const rows = tickets.map((t) => {
    const assignee = members.find((m) => String(m.id) === String(t.assigneeId));
    const sprint   = sprints.find((s)  => String(s.id) === String(t.sprintId));
    return [
      t.key || t.id, t.title, t.epicName || t.epic || "",
      t.priority, t.status,
      assignee ? getMemberName(assignee) : "",
      sprint ? sprint.name : "",
      t.updatedAt || "",
    ];
  });
  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g,'""')}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `tickets-project-${projectId}.csv`;
  a.click();
}

// ─── Modal Création / Édition ─────────────────────────────────────────────────

function TicketModal({ ticket, sprints, members, onClose, onSubmit }) {
  const isEdit = !!ticket;
  const [form, setForm] = useState({
    title:      ticket?.title      ?? "",
    description:ticket?.description?? "",
    priority:   ticket?.priority   ?? "MEDIUM",
    status:     ticket?.status     ?? "TODO",
    epicName:   ticket?.epicName   ?? ticket?.epic ?? "",
    assigneeId: ticket?.assigneeId ?? "",
    sprintId:   ticket?.sprintId   ?? "",
    storyPoints:ticket?.storyPoints?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Le titre est requis."); return; }
    setLoading(true); setError("");
    try {
      await onSubmit(form);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {isEdit ? "Modifier le ticket" : "Nouveau ticket"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Intégrer le paiement Stripe"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Description du ticket..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Epic */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Epic</label>
            <input
              value={form.epicName}
              onChange={(e) => setForm({ ...form, epicName: e.target.value })}
              placeholder="Ex: Checkout, Auth, Admin..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priorité + Statut */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {ALL_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee + Sprint */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assigné à</label>
              <select
                value={form.assigneeId}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">— Non assigné —</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{getMemberName(m)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sprint</label>
              <select
                value={form.sprintId}
                onChange={(e) => setForm({ ...form, sprintId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">— Backlog —</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Story Points */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Story Points</label>
            <input
              type="number" min="0" max="100"
              value={form.storyPoints}
              onChange={(e) => setForm({ ...form, storyPoints: e.target.value })}
              placeholder="Ex: 3"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg transition">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Suppression ────────────────────────────────────────────────────────

function DeleteModal({ ticket, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setLoading(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Supprimer le ticket</h3>
          <p className="text-sm text-slate-500 mt-1">
            Voulez-vous vraiment supprimer <span className="font-medium text-slate-700">{ticket?.title}</span> ?
            Cette action est irréversible.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            Annuler
          </button>
          <button onClick={handle} disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition">
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Panneau de filtre ────────────────────────────────────────────────────────

function FilterPanel({ filters, onChange, members, sprints, onClose }) {
  return (
    <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-72 z-30">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-700">Filtres</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Priorité</label>
          <select value={filters.priority} onChange={(e) => onChange({ ...filters, priority: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Toutes</option>
            {ALL_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Statut</label>
          <select value={filters.status} onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s.replace("_"," ")}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Assigné à</label>
          <select value={filters.assigneeId} onChange={(e) => onChange({ ...filters, assigneeId: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            {members.map((m) => <option key={m.id} value={m.id}>{getMemberName(m)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">Sprint</label>
          <select value={filters.sprintId} onChange={(e) => onChange({ ...filters, sprintId: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous</option>
            {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <button
        onClick={() => onChange({ priority: "", status: "", assigneeId: "", sprintId: "" })}
        className="mt-3 w-full text-sm text-blue-600 hover:underline text-center"
      >
        Effacer tous les filtres
      </button>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function TicketsPage() {
  const { id: projectId } = useParams();

  const { tickets, sprints, members, loading, error, activeSprint, addTicket, editTicket, removeTicket } =
    useTickets(projectId);

  const [tab,          setTab]          = useState("all");
  const [showFilter,   setShowFilter]   = useState(false);
  const [filters,      setFilters]      = useState({ priority: "", status: "", assigneeId: "", sprintId: "" });
  const [showCreate,   setShowCreate]   = useState(false);
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Inline status change
  const handleStatusChange = async (ticketId, status) => {
    try {
      const updated = await updateTicketStatus(ticketId, status);
      // Le hook ne sait pas => on re-fetch via editTicket trick ou on met à jour local
      // Simple : on appelle editTicket avec le ticket mis à jour
    } catch (e) {
      console.error("Erreur changement statut:", e);
    }
  };

  const filtered = useMemo(() => tickets.filter((t) => {
    if (tab === "mine"       && !t.isAssignedToMe) return false;
    if (tab === "unassigned" && t.assigneeId)      return false;
    if (filters.priority   && t.priority   !== filters.priority)                     return false;
    if (filters.status     && t.status     !== filters.status)                       return false;
    if (filters.assigneeId && String(t.assigneeId) !== String(filters.assigneeId))   return false;
    if (filters.sprintId   && String(t.sprintId)   !== String(filters.sprintId))     return false;
    return true;
  }), [tickets, tab, filters]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
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

        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">

          {/* Tabs + actions */}
          <div className="flex items-center justify-between px-4 border-b border-slate-100">
            <div className="flex">
              {[["all","All"],["mine","My Tickets"],["unassigned","Unassigned"]].map(([val,label]) => (
                <button key={val} onClick={() => setTab(val)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
                    tab === val ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 relative">
              {/* Export CSV */}
              <button
                onClick={() => exportToCSV(filtered, members, sprints, projectId)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Export CSV
              </button>

              {/* Filter */}
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
                </svg>
                Filter
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {showFilter && (
                <FilterPanel
                  filters={filters} onChange={setFilters}
                  members={members} sprints={sprints}
                  onClose={() => setShowFilter(false)}
                />
              )}
            </div>
          </div>

          {/* Contenu */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <span className="ml-3 text-slate-400 text-sm">Chargement…</span>
            </div>

          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-slate-500 text-sm mb-3 max-w-sm">{error}</p>
              <button onClick={() => window.location.reload()}
                className="text-blue-600 text-sm hover:underline">
                Réessayer
              </button>
            </div>

          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-slate-700 font-semibold mb-1">Aucun ticket trouvé</h3>
              <p className="text-slate-400 text-sm mb-5">
                {tickets.length === 0 ? "Créez votre premier ticket." : "Ajustez vos filtres."}
              </p>
              {tickets.length === 0 && (
                <button onClick={() => setShowCreate(true)}
                  className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                  + New Ticket
                </button>
              )}
            </div>

          ) : (
            <>
              {/* Tableau */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["KEY","TITLE","EPIC","PRIORITY","STATUS","ASSIGNEE","SPRINT","UPDATED",""].map((h) => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((ticket) => {
                      const assignee = members.find((m) => String(m.id) === String(ticket.assigneeId));
                      const sprint   = sprints.find((s)  => String(s.id) === String(ticket.sprintId));
                      return (
                        <tr key={ticket.id} className="hover:bg-slate-50/80 transition group">
                          {/* KEY */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-blue-600 font-mono text-xs font-medium">
                              {ticket.key || `#${ticket.id}`}
                            </span>
                          </td>

                          {/* TITLE */}
                          <td className="px-4 py-3 min-w-[200px]">
                            <span className="font-medium text-slate-700 hover:text-blue-600 cursor-pointer transition line-clamp-1">
                              {ticket.title}
                            </span>
                          </td>

                          {/* EPIC */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {(ticket.epicName || ticket.epic) ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                                {ticket.epicName || ticket.epic}
                              </span>
                            ) : <span className="text-slate-300">—</span>}
                          </td>

                          {/* PRIORITY */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.LOW}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[ticket.priority] || "bg-slate-400"}`} />
                              {ticket.priority}
                            </span>
                          </td>

                          {/* STATUS — cliquable inline */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <select
                              value={ticket.status}
                              onChange={(e) => editTicket(ticket.id, { ...ticket, status: e.target.value })}
                              className={`text-xs font-semibold px-2 py-1 rounded-md border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[ticket.status] || STATUS_STYLES.TODO}`}
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>{s.replace("_"," ")}</option>
                              ))}
                            </select>
                          </td>

                          {/* ASSIGNEE */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {assignee ? (
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full ${avatarColor(getMemberName(assignee))} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                                  {initials(assignee)}
                                </div>
                                <span className="text-slate-600 text-xs truncate max-w-[80px]">
                                  {getMemberName(assignee)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-300 text-xs">Non assigné</span>
                            )}
                          </td>

                          {/* SPRINT */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            {sprint ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                sprint.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                              }`}>
                                {sprint.status === "ACTIVE" && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                                {sprint.name}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300">Backlog</span>
                            )}
                          </td>

                          {/* UPDATED */}
                          <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">
                            {ticket.updatedAt || "—"}
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => setEditTarget(ticket)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                title="Modifier"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteTarget(ticket)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                title="Supprimer"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
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

      {/* Modals */}
      {showCreate && (
        <TicketModal ticket={null} sprints={sprints} members={members}
          onClose={() => setShowCreate(false)}
          onSubmit={(data) => addTicket(data)}
        />
      )}
      {editTarget && (
        <TicketModal ticket={editTarget} sprints={sprints} members={members}
          onClose={() => setEditTarget(null)}
          onSubmit={(data) => editTicket(editTarget.id, data)}
        />
      )}
      {deleteTarget && (
        <DeleteModal ticket={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => removeTicket(deleteTarget.id)}
        />
      )}
    </div>
  );
}