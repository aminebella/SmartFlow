'use client';

import TicketFilterPanel from "./TicketFilterPanel.jsx";

function exportToCSV(tickets, members, sprints, projectId) {
  const header = ["KEY", "TITLE", "PRIORITY", "STATUS", "ASSIGNEE", "SPRINT", "UPDATED"];
  const rows = tickets.map((t) => {
    const assignee = members.find((m) => m.clientId === ticket.assignedUserId);
    const sprint   = sprints.find((s) => s.id === t.sprintId);
    return [
      t.key || t.id,
      t.title,
      t.priority,
      t.status,
      assignee ? (assignee.fullName || assignee.name || assignee.email) : "",
      sprint   ? sprint.title : "",
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

export default function TicketTabs({
  tab, onTabChange,
  showFilter, onToggleFilter, onCloseFilter,
  activeFiltersCount,
  filtered, members, sprints, projectId,
  filters, onFiltersChange,
}) {
  return (
    <div className="flex items-center justify-between px-4 border-b" style={{ borderColor: '#f0ebe0' }}>

      {/* Tabs */}
      <div className="flex">
        {[
          ["all",        "All"],
          ["mine",       "My Tickets"],
          ["unassigned", "Unassigned"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => onTabChange(val)}
            className="px-4 py-3 text-sm font-medium border-b-2 transition -mb-px"
            style={{
              borderColor: tab === val ? '#c9b479' : 'transparent',
              color: tab === val ? '#c9b479' : '#64748b',
            }}
            onMouseEnter={e => { if (tab !== val) e.currentTarget.style.color = '#c9b479'; }}
            onMouseLeave={e => { if (tab !== val) e.currentTarget.style.color = '#64748b'; }}
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white rounded-lg transition hover:opacity-80"
          style={{ color: '#a08c4a', border: '1px solid #e2d5a0' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>

        {/* Filter */}
        <button
          onClick={onToggleFilter}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition hover:opacity-80"
          style={{
            backgroundColor: activeFiltersCount > 0 || showFilter ? '#faf3e0' : 'white',
            color: activeFiltersCount > 0 || showFilter ? '#c9b479' : '#64748b',
            border: `1px solid ${activeFiltersCount > 0 || showFilter ? '#c9b479' : '#e2d5a0'}`,
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filter
          {activeFiltersCount > 0 && (
            <span className="text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none"
              style={{ backgroundColor: '#c9b479' }}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Filter dropdown */}
        {showFilter && (
          <TicketFilterPanel
            filters={filters}
            onChange={onFiltersChange}
            members={members}
            sprints={sprints}
            onClose={onCloseFilter}
          />
        )}
      </div>
    </div>
  );
}