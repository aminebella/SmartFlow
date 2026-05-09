'use client';

export default function TicketFilterPanel({ filters, onChange, members, sprints, onClose }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const handleReset = () => {
    onChange({ priority: "", status: "", assigneeId: "", sprintId: "" });
  };

  const selectStyle = {
    borderColor: '#e2d5a0',
  };

  return (
    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg p-4 z-40 w-64"
      style={{ border: '1px solid #e8e0cc' }}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 text-sm">Filtres</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold uppercase mb-2" style={{ color: '#a08c4a' }}>
            Priorité
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full px-2 py-1.5 rounded text-sm focus:outline-none transition"
            style={selectStyle}
            onFocus={e => e.target.style.borderColor = '#c9b479'}
            onBlur={e => e.target.style.borderColor = '#e2d5a0'}
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
          <label className="block text-xs font-semibold uppercase mb-2" style={{ color: '#a08c4a' }}>
            Statut
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-2 py-1.5 rounded text-sm focus:outline-none transition"
            style={selectStyle}
            onFocus={e => e.target.style.borderColor = '#c9b479'}
            onBlur={e => e.target.style.borderColor = '#e2d5a0'}
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
          <label className="block text-xs font-semibold uppercase mb-2" style={{ color: '#a08c4a' }}>
            Assigné à
          </label>
          <select
            value={filters.assigneeId}
            onChange={(e) => handleChange("assigneeId", e.target.value)}
            className="w-full px-2 py-1.5 rounded text-sm focus:outline-none transition"
            style={selectStyle}
            onFocus={e => e.target.style.borderColor = '#c9b479'}
            onBlur={e => e.target.style.borderColor = '#e2d5a0'}
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
          <label className="block text-xs font-semibold uppercase mb-2" style={{ color: '#a08c4a' }}>
            Sprint
          </label>
          <select
            value={filters.sprintId}
            onChange={(e) => handleChange("sprintId", e.target.value)}
            className="w-full px-2 py-1.5 rounded text-sm focus:outline-none transition"
            style={selectStyle}
            onFocus={e => e.target.style.borderColor = '#c9b479'}
            onBlur={e => e.target.style.borderColor = '#e2d5a0'}
          >
            <option value="">Tous</option>
            {sprints.map((sprint) => (
              <option key={sprint.id} value={sprint.id}>
                {sprint.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: '#e8e0cc' }}>
        <button
          onClick={handleReset}
          className="flex-1 px-3 py-1.5 text-sm font-medium rounded hover:opacity-80 transition"
          style={{ color: '#a08c4a', border: '1px solid #e2d5a0', backgroundColor: 'white' }}
        >
          Réinitialiser
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-white rounded hover:opacity-90 transition"
          style={{ backgroundColor: '#c9b479' }}
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}