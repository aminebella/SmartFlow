'use client';

import { useState } from "react";

export default function TicketModal({ ticket, sprints, members, onClose, onSubmit }) {
  const isEdit = !!ticket;
  
  const [formData, setFormData] = useState(
    ticket || {
      title: "",
      priority: "MEDIUM",
      status: "TODO",
      assignedUserId: "",
      sprintId: "",
      description: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Le titre est requis");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: '#e8e0cc' }}>
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? "Éditer Ticket" : "Nouveau Ticket"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Intégration Stripe..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition"
              style={{ borderColor: '#e2d5a0' }}
              onFocus={e => e.target.style.borderColor = '#c9b479'}
              onBlur={e => e.target.style.borderColor = '#e2d5a0'}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Détails du ticket..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm resize-none focus:outline-none transition"
              style={{ borderColor: '#e2d5a0' }}
              onFocus={e => e.target.style.borderColor = '#c9b479'}
              onBlur={e => e.target.style.borderColor = '#e2d5a0'}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition"
              style={{ borderColor: '#e2d5a0' }}
              onFocus={e => e.target.style.borderColor = '#c9b479'}
              onBlur={e => e.target.style.borderColor = '#e2d5a0'}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition"
              style={{ borderColor: '#e2d5a0' }}
              onFocus={e => e.target.style.borderColor = '#c9b479'}
              onBlur={e => e.target.style.borderColor = '#e2d5a0'}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assigné à</label>
            <select
              name="assignedUserId"
              value={formData.assignedUserId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition"
              style={{ borderColor: '#e2d5a0' }}
              onFocus={e => e.target.style.borderColor = '#c9b479'}
              onBlur={e => e.target.style.borderColor = '#e2d5a0'}
            >
              <option value="">Non assigné</option>
              {members.map((member) => (
                <option key={member.clientId} value={member.clientId}>
                  {member.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Sprint */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Sprint</label>
            <select
              name="sprintId"
              value={formData.sprintId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition"
              style={{ borderColor: '#e2d5a0' }}
              onFocus={e => e.target.style.borderColor = '#c9b479'}
              onBlur={e => e.target.style.borderColor = '#e2d5a0'}
            >
              <option value="">Aucun sprint</option>
              {sprints.map((sprint) => (
                <option key={sprint.id} value={sprint.id}>
                  {sprint.title}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border text-slate-700 rounded-lg font-medium hover:opacity-80 transition text-sm"
              style={{ borderColor: '#e2d5a0' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition text-sm"
              style={{ backgroundColor: '#c9b479' }}
            >
              {isEdit ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}