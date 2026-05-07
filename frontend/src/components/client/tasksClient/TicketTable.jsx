'use client';

export default function TicketTable({ tickets, members, sprints, onEdit, onDelete }) {

  const getPriorityStyles = (priority) => {
    const styles = {
      CRITICAL: "bg-[#6b3a1f] text-white border border-[#6b3a1f]",
      HIGH:     "bg-[#c9b479] text-white border border-[#c9b479]",
      MEDIUM:   "bg-[#e2d5a0] text-[#7a6830] border border-[#e2d5a0]",
      LOW:      "bg-[#f3edd6] text-[#a08c4a] border border-[#f3edd6]",
    };
    return styles[priority] || styles.LOW;
  };

  const getStatusStyles = (status) => {
    const styles = {
      TODO:        "bg-[#f3edd6] text-[#a08c4a] border border-[#e2d5a0]",
      IN_PROGRESS: "bg-[#c9b479] text-white border border-[#c9b479]",
      REVIEW:      "bg-[#d4c48a] text-white border border-[#d4c48a]",
      DONE:        "bg-[#8a9e6b] text-white border border-[#8a9e6b]",
      BLOCKED:     "bg-[#c47a5a] text-white border border-[#c47a5a]",
    };
    return styles[status] || styles.TODO;
  };

  const getMemberInitials = (name) => {
    if (!name) return "—";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };
const timeAgo = (dateStr) => {
  if (!dateStr) return "—";
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60)          return `${diff}s ago`;
  if (diff < 3600)        return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)       return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30)  return `${Math.floor(diff / 86400)}d ago`;
  return                         `${Math.floor(diff / (86400 * 30))}mo ago`;
};
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        {/* Entête */}
        <thead>
          <tr className="bg-[#faf8f2] border-b border-[#ede8d5]">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#a08c4a] uppercase tracking-wide">KEY</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#a08c4a] uppercase tracking-wide">TITLE</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#a08c4a] uppercase tracking-wide">PRIORITY</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#a08c4a] uppercase tracking-wide">STATUS</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#a08c4a] uppercase tracking-wide">ASSIGNEE</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#a08c4a] uppercase tracking-wide hidden md:table-cell">SPRINT</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#a08c4a] uppercase tracking-wide hidden lg:table-cell">UPDATED</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>

        {/* Lignes */}
        <tbody className="divide-y divide-[#f0ebe0]">
          {tickets.map((ticket) => {
            const member = members.find((m) => String(m.id) === String(ticket.assigneeId));
            const sprint = sprints.find((s) => String(s.id) === String(ticket.sprintId));

            return (
              <tr
                key={ticket.id}
                className="bg-white hover:bg-[#faf8f2] transition-colors"
              >
                {/* KEY */}
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-semibold text-[#c9b479]">
                    {ticket.key || ticket.id}
                  </span>
                </td>

                {/* TITLE */}
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-800 font-medium">{ticket.title}</span>
                </td>

                {/* PRIORITY */}
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyles(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(ticket.status)}`}>
                    {ticket.status?.replace("_", " ")}
                  </span>
                </td>

                {/* ASSIGNEE */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {member ? (
                      <>
                        <span className="w-7 h-7 rounded-full bg-[#c9b479] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {getMemberInitials(member.name || member.fullName)}
                        </span>
                        <span className="text-sm text-slate-700 truncate max-w-[100px]">
                          {member.name || member.fullName}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">Unassigned</span>
                    )}
                  </div>
                </td>

                {/* SPRINT */}
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs px-2 py-1 bg-[#f3edd6] text-[#a08c4a] rounded-full border border-[#e2d5a0] inline-block">
                    {sprint ? sprint.name : "—"}
                  </span>
                </td>

                {/* UPDATED */}
                <td className="px-4 py-3 hidden lg:table-cell">
<span className="text-xs text-slate-400">{timeAgo(ticket.updatedAt)}</span>                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => onEdit(ticket)}
                      className="p-1.5 text-slate-400 hover:text-[#c9b479] hover:bg-[#faf8f2] rounded transition"
                      title="Éditer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(ticket)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-50 rounded transition"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
  );
}