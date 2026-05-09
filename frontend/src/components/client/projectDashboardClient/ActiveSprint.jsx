/**
 * ActiveSprint — shows the list of ACTIVE sprints with task breakdown.
 * Props:
 *   sprints    → dashboard.activeSprints  (array of SprintInfo)
 *   projectId  → for the "Manage" redirect
 *   router     → Next.js router
 */
export default function ActiveSprint({ sprints, projectId, router }) {

  // Empty state
  if (!sprints || sprints.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">Active Sprint</span>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>
            No active sprint at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          Active Sprint{sprints.length > 1 ? 's' : ''} ({sprints.length})
        </span>
        {/* "Manage" → redirect to sprint list page */}
        <button
          className="card-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => router.push(`/EspaceClient/projects/${projectId}/sprints`)}
        >
          Manage →
        </button>
      </div>

      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sprints.map((sprint) => (
          <SprintCard key={sprint.id} sprint={sprint} />
        ))}
      </div>
    </div>
  );
}

/** Single sprint card within the list */
function SprintCard({ sprint }) {
  const pct = sprint.progress ?? 0;

  return (
    <div>
      {/* Sprint name + status badge */}
      <div className="sprint-top-row">
        <div>
          <div className="sprint-name">{sprint.title}</div>
          {sprint.goal && (
            <div className="sprint-dates" style={{ marginTop: 2 }}>
              {sprint.goal}
            </div>
          )}
          {sprint.startDate && (
            <div className="sprint-dates">
              {sprint.startDate} – {sprint.endDate ?? '…'}
            </div>
          )}
        </div>
        <span className="status status-progress">In Progress</span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-labels">
        <span>{sprint.doneTasks} of {sprint.totalTasks} tasks done</span>
        <span className="progress-pct">{pct}%</span>
      </div>

      {/* Status breakdown */}
      <div className="sprint-stat-row">
        <div className="sprint-stat-box">
          <div className="sprint-stat-val" style={{ color: 'var(--text3)' }}>
            {sprint.tasksByStatus?.TODO ?? 0}
          </div>
          <div className="sprint-stat-key">Todo</div>
        </div>
        <div className="sprint-stat-box">
          <div className="sprint-stat-val" style={{ color: 'var(--gold)' }}>
            {sprint.tasksByStatus?.IN_PROGRESS ?? 0}
          </div>
          <div className="sprint-stat-key">In Progress</div>
        </div>
        <div className="sprint-stat-box">
          <div className="sprint-stat-val" style={{ color: 'var(--purple)' }}>
            {sprint.tasksByStatus?.REVIEW ?? 0}
          </div>
          <div className="sprint-stat-key">Review</div>
        </div>
        <div className="sprint-stat-box">
          <div className="sprint-stat-val" style={{ color: 'var(--green)' }}>
            {sprint.tasksByStatus?.DONE ?? 0}
          </div>
          <div className="sprint-stat-key">Done</div>
        </div>
      </div>
    </div>
  );
}