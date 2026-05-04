const stats = [
  {
    label: "Sprint Progress",
    value: "68%",
    trend: { text: "↑ 12% vs last sprint", type: "up" },
  },
  {
    label: "Tickets Closed",
    value: "34",
    trend: { text: "↑ 8 this week", type: "up" },
  },
  {
    label: "Active Blockers",
    value: "3",
    trend: { text: "↑ 2 since yesterday", type: "down" },
  },
  {
    label: "Team Members",
    value: "8",
    trend: { text: "All active this sprint", type: "neutral" },
  },
];

export default function StatsGrid() {
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