/**
 * StatsGrid — 4 KPI cards at the top of the project dashboard.
 * Props: { dashboard }  ← full ProjectDashboardSummary object
 */
export default function StatsGrid({ dashboard }) {
  const stats = [
    {
      label: 'Sprint Progress',
      value: `${dashboard?.sprintProgress ?? 0}%`,
      trend: {
        text: dashboard?.sprintProgress > 0
          ? `${dashboard.sprintProgress}% of sprints completed`
          : 'No completed sprints yet',
        type: dashboard?.sprintProgress > 0 ? 'up' : 'neutral',
      },
    },
    {
      label: 'Tasks Completed',
      value: String(dashboard?.tasksDone ?? 0),
      trend: {
        text: dashboard?.tasksDone > 0
          ? `↑ ${dashboard.tasksDone} tasks done`
          : 'No completed tasks yet',
        type: dashboard?.tasksDone > 0 ? 'up' : 'neutral',
      },
    },
    {
      label: 'Active Tasks',
      value: String(dashboard?.activeTasks ?? 0),
      trend: {
        text: dashboard?.activeTasks > 0
          ? `${dashboard.activeTasks} in progress`
          : 'No active tasks',
        type: dashboard?.activeTasks > 0 ? 'down' : 'neutral',
      },
    },
    {
      label: 'Team Members',
      value: String(dashboard?.teamMemberCount ?? 0),
      trend: {
        text: `${dashboard?.teamMemberCount ?? 0} member${(dashboard?.teamMemberCount ?? 0) !== 1 ? 's' : ''} in project`,
        type: 'neutral',
      },
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-label">{s.label}</div>
          <div className="stat-value">{s.value}</div>
          <span className={`stat-trend trend-${s.trend.type}`}>
            {s.trend.text}
          </span>
        </div>
      ))}
    </div>
  );
}