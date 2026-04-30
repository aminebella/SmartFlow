'use client';

export default function TicketFilterPanel({ filters, onChange, members, sprints, onClose }) {
  const handleChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onChange({
      priority: "",
      status: "",
      assigneeId: "",
      sprintId: "",
    });
  };

  return (
    <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-40 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-sm">Filtres</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
            Priorité
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
            Statut
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
            Assigné à
          </label>
          <select
            value={filters.assigneeId}
            onChange={(e) => handleChange("assigneeId", e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name || member.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Sprint */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">
            Sprint
          </label>
          <select
            value={filters.sprintId}
            onChange={(e) => handleChange("sprintId", e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            {sprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50 transition"
        >
          Réinitialiser
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}
