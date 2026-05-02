'use client';

export default function TicketTable({ tickets, members, sprints, onEdit, onDelete }) {
  const getPriorityStyles = (priority) => {
    const styles = {
      CRITICAL: "bg-red-50 text-red-600 border border-red-200",
      HIGH: "bg-orange-50 text-orange-600 border border-orange-200",
      MEDIUM: "bg-yellow-50 text-yellow-600 border border-yellow-200",
      LOW: "bg-green-50 text-green-600 border border-green-200",
    };
    return styles[priority] || styles.LOW;
  };

  const getStatusStyles = (status) => {
    const styles = {
      TODO: "bg-gray-50 text-gray-600 border border-gray-200",
      IN_PROGRESS: "bg-blue-50 text-blue-600 border border-blue-200",
      REVIEW: "bg-purple-50 text-purple-600 border border-purple-200",
      DONE: "bg-green-50 text-green-600 border border-green-200",
      BLOCKED: "bg-red-50 text-red-600 border border-red-200",
    };
    return styles[status] || styles.TODO;
  };

  const getEpicStyles = (epic) => {
    const styles = {
      Checkout: "bg-orange-50 text-orange-600 border border-orange-200",
      Admin: "bg-indigo-50 text-indigo-600 border border-indigo-200",
      Auth: "bg-pink-50 text-pink-600 border border-pink-200",
      Backend: "bg-teal-50 text-teal-600 border border-teal-200",
      Frontend: "bg-cyan-50 text-cyan-600 border border-cyan-200",
    };
    return styles[epic] || "bg-slate-50 text-slate-600 border border-slate-200";
  };

  const getMemberInitials = (name) => {
    if (!name) return "—";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="divide-y divide-slate-100">
      {/* Entête */}
      <div className="grid grid-cols-[120px_2fr_130px_130px_130px_160px_100px_100px_80px] gap-4 px-6 py-3 bg-slate-50 font-semibold text-xs text-slate-500 uppercase tracking-wide">
        <span>KEY</span>
        <span>TITLE</span>
        <span>EPIC</span>
        <span>PRIORITY</span>
        <span>STATUS</span>
        <span>ASSIGNEE</span>
        <span>SPRINT</span>
        <span>UPDATED</span>
        <span></span>
      </div>

      {/* Lignes */}
      {tickets.map((ticket) => {
        const member = members.find((m) => String(m.id) === String(ticket.assigneeId));
        const sprint = sprints.find((s) => String(s.id) === String(ticket.sprintId));

        return (
          <div
            key={ticket.id}
            className="grid grid-cols-[120px_2fr_130px_130px_130px_160px_100px_100px_80px] gap-4 px-6 py-4 items-center hover:bg-slate-50 transition"
          >
            {/* KEY */}
            <span className="font-mono text-sm font-semibold text-blue-600">{ticket.key || ticket.id}</span>

            {/* TITLE */}
            <span className="text-sm text-slate-800 font-medium">{ticket.title}</span>

            {/* EPIC */}
            <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${getEpicStyles(ticket.epic)}`}>
              {ticket.epic || "—"}
            </span>

            {/* PRIORITY */}
            <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${getPriorityStyles(ticket.priority)}`}>
              {ticket.priority}
            </span>

            {/* STATUS */}
            <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium border ${getStatusStyles(ticket.status)}`}>
              {ticket.status?.replace("_", " ")}
            </span>

            {/* ASSIGNEE */}
            <div className="flex items-center gap-2">
              {member ? (
                <>
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                    {getMemberInitials(member.name || member.fullName)}
                  </span>
                  <span className="text-sm text-slate-700 truncate">{member.name || member.fullName}</span>
                </>
              ) : (
                <span className="text-xs text-slate-400">Unassigned</span>
              )}
            </div>

            {/* SPRINT */}
            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200 inline-block">
              {sprint ? sprint.name : "—"}
            </span>

            {/* UPDATED */}
            <span className="text-xs text-slate-400">{ticket.updatedAt || "—"}</span>

            {/* ACTIONS */}
            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={() => onEdit(ticket)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                title="Éditer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(ticket)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                title="Supprimer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
