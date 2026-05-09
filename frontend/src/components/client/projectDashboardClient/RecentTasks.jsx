/**
 * RecentTasks — table of all tasks for this project.
 * Path: src/components/client/projectDashboardClient/RecentTasks.jsx
 *
 * Props:
 *   tasks     → dashboard.tasks  (array of TaskInfo)
 *               Each item: { id, title, priority, status,
 *                            assignedUserId, assignedUserFullName, sprintId }
 *   projectId → for "View all" redirect
 *   router    → Next.js router
 */

// ── Badge helpers ─────────────────────────────────────────────────────────────

const PRIORITY_MAP = {
  CRITICAL: { label: 'Critical', cls: 'prio-critical' },
  HIGH:     { label: 'High',     cls: 'prio-high'     },
  MEDIUM:   { label: 'Medium',   cls: 'prio-medium'   },
  LOW:      { label: 'Low',      cls: 'prio-low'      },
};

const STATUS_MAP = {
  TODO:        { label: 'Todo',        cls: 'status-todo'     },
  IN_PROGRESS: { label: 'In Progress', cls: 'status-progress' },
  REVIEW:      { label: 'Review',      cls: 'status-review'   },
  DONE:        { label: 'Done',        cls: 'status-done'     },
};

const AV_COLORS = ['av-gold', 'av-green', 'av-purple', 'av-warm', 'av-teal', 'av-rose'];

function getInitials(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Simple deterministic color from userId
function getAvatarColor(userId) {
  if (!userId) return AV_COLORS[0];
  return AV_COLORS[Number(userId) % AV_COLORS.length];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RecentTasks({ tasks, projectId, router }) {

  // Show max 10 rows in dashboard; full list is on the tasks page
  const visible = tasks ? tasks.slice(0, 10) : [];

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Tasks</span>
        {/* "View all" redirects to the tasks page of this project */}
        <button
          className="card-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => router?.push(`/EspaceClient/projects/${projectId}/tasks`)}
        >
          View all →
        </button>
      </div>

      {/* Empty state */}
      {visible.length === 0 ? (
        <div className="card-body">
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>No tasks yet.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned to</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => {
                const prio   = PRIORITY_MAP[t.priority] ?? { label: t.priority,   cls: '' };
                const status = STATUS_MAP[t.status]     ?? { label: t.status,     cls: '' };

                return (
                  <tr key={t.id}>
                    {/* ID as short identifier */}
                    <td className="ticket-key">#{t.id}</td>

                    {/* Title */}
                    <td className="ticket-title">{t.title}</td>

                    {/* Priority badge */}
                    <td>
                      <span className={`prio ${prio.cls}`}>
                        <span className="prio-dot" />
                        {prio.label}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td>
                      <span className={`status ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>

                    {/* Assignee avatar */}
                    <td>
                      {t.assignedUserFullName ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className={`av av-sm ${getAvatarColor(t.assignedUserId)}`}>
                            {getInitials(t.assignedUserFullName)}
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                            {t.assignedUserFullName}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text3)' }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
