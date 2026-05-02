'use client';

import { useState } from "react";

// ─── Constantes ───────────────────────────────────────────────────────────────

const PRIORITIES = ["Critical", "High", "Medium", "Low"];
const STATUSES   = ["Todo", "In Progress", "Review", "Blocked", "Done"];

// ─── TicketFormModal ─────────────────────────────────────────────────────────
/**
 * Modal de création ET d'édition d'un ticket.
 *
 * Props :
 *   ticket    — ticket existant (mode édition) ou null (mode création)
 *   sprints   — tableau des sprints du projet
 *   members   — tableau des membres du projet
 *   onClose   — () => void  — ferme sans sauvegarder
 *   onSubmit  — async (formData) => void  — la page parent appelle addTicket / editTicket
 */
export function TicketFormModal({ ticket, sprints, members, onClose, onSubmit }) {
  const isEdit = !!ticket?.id;

  const [form, setForm] = useState({
    title:      ticket?.title      ?? "",
    epic:       ticket?.epic       ?? "",
    priority:   ticket?.priority   ?? "Medium",
    status:     ticket?.status     ?? "Todo",
    assigneeId: ticket?.assigneeId ?? "",
    sprintId:   ticket?.sprintId   ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Le titre est obligatoire."); return; }
    setSaving(true);
    setError("");
    try {
      await onSubmit(form);
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">
            {isEdit ? "Modifier le ticket" : "Nouveau ticket"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="ex. Stripe payment gateway integration"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          {/* Epic */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Epic</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="ex. Checkout, Auth, Admin…"
              value={form.epic}
              onChange={(e) => set("epic", e.target.value)}
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee + Sprint */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assigné à</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={form.assigneeId}
                onChange={(e) => set("assigneeId", e.target.value)}
              >
                <option value="">— Non assigné —</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName || m.name || m.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sprint</label>
              <select
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={form.sprintId}
                onChange={(e) => set("sprintId", e.target.value)}
              >
                <option value="">— Sans sprint —</option>
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? "Sauvegarde…" : isEdit ? "Enregistrer" : "Créer le ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TicketDeleteModal ────────────────────────────────────────────────────────
/**
 * Modal de confirmation avant suppression.
 *
 * Props :
 *   ticket    — { id, title }
 *   onClose   — () => void
 *   onConfirm — async () => void  — la page parent appelle removeTicket
 */
export function TicketDeleteModal({ ticket, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-slate-800 text-center mb-2">Supprimer ce ticket ?</h2>
        <p className="text-sm text-slate-500 text-center mb-6">
          Voulez-vous vraiment supprimer{" "}
          <span className="font-medium text-slate-700">"{ticket?.title}"</span> ?
          Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
          >
            {deleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TicketFilterPanel ────────────────────────────────────────────────────────
/**
 * Panneau de filtres flottant.
 *
 * Props :
 *   filters    — { priority, status, assigneeId, sprintId }
 *   onChange   — (newFilters) => void
 *   members    — tableau des membres
 *   sprints    — tableau des sprints
 *   onClose    — () => void
 */
export function TicketFilterPanel({ filters, onChange, members, sprints, onClose }) {
  const set      = (k, v) => onChange({ ...filters, [k]: v });
  const clearAll = ()     => onChange({ priority: "", status: "", assigneeId: "", sprintId: "" });
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="absolute right-0 top-11 z-30 bg-white border border-slate-200 rounded-xl shadow-2xl p-5 w-72">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-700">
          Filtres
          {activeCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">{activeCount}</span>
          )}
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Priorité</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.priority} onChange={(e) => set("priority", e.target.value)}>
            <option value="">Toutes</option>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Statut</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status} onChange={(e) => set("status", e.target.value)}>
            <option value="">Tous</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Assigné à</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.assigneeId} onChange={(e) => set("assigneeId", e.target.value)}>
            <option value="">Tous</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.fullName || m.name || m.email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Sprint</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.sprintId} onChange={(e) => set("sprintId", e.target.value)}>
            <option value="">Tous</option>
            {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={clearAll}
          className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 text-center transition">
          Effacer tous les filtres
        </button>
      )}
    </div>
  );
}