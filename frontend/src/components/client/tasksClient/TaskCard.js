"use client";

const PRIORITY_CONFIG = {
  CRITICAL: { label: "Critical", dot: "bg-red-500",    text: "text-red-600",    bg: "bg-red-50 border border-red-200" },
  HIGH:     { label: "High",     dot: "bg-orange-400", text: "text-orange-500", bg: "bg-orange-50 border border-orange-200" },
  MEDIUM:   { label: "Medium",   dot: "bg-yellow-400", text: "text-yellow-600", bg: "bg-yellow-50 border border-yellow-200" },
  LOW:      { label: "Low",      dot: "bg-green-400",  text: "text-green-600",  bg: "bg-green-50 border border-green-200" },
};

export default function TaskCard({ task, onClick }) {
  const cfg = PRIORITY_CONFIG[task?.priority] || PRIORITY_CONFIG.LOW;

  // Support des deux formats : assignedUserFullName (backend) ou assigneeId (via members)
  const assigneeName = task?.assignedUserFullName || task?.assigneeName || null;
  const initials = assigneeName
    ? assigneeName.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2)
    : null;

  return (
    <div
      onClick={() => onClick?.(task)}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-blue-300"
    >
      {/* Clé du ticket */}
      {(task?.key) && (
        <p className="text-xs font-mono text-blue-500 mb-1">{task.key}</p>
      )}

      {/* Titre */}
      <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">{task?.title}</p>

      {/* Epic */}
      {(task?.epicName || task?.epic) && (
        <span className="inline-block text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded mb-2">
          {task.epicName || task.epic}
        </span>
      )}

      {/* Priorité + Avatar */}
      <div className="flex items-center justify-between mt-1">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        {initials && (
          <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}