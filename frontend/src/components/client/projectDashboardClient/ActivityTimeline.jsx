const activities = [
  {
    iconBg: "var(--green-bg)",
    iconStroke: "var(--green)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--green)" strokeWidth="1.8">
        <polyline points="2,6.5 5,9.5 11,3.5" />
      </svg>
    ),
    text: (
      <><strong>Tom Kira</strong> closed <strong>ECP-135</strong></>
    ),
    time: "2 min ago",
  },
  {
    iconBg: "var(--purple-bg)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--purple)" strokeWidth="1.5">
        <path d="M6.5 1.5l1 2 2.5.4-1.8 1.7.4 2.5L6.5 7l-2.1 1.1.4-2.5L3 3.9l2.5-.4z" />
      </svg>
    ),
    text: (
      <><strong>Sara Ruiz</strong> moved <strong>ECP-139</strong> to Review</>
    ),
    time: "18 min ago",
  },
  {
    iconBg: "var(--red-bg)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--red)" strokeWidth="1.5">
        <circle cx="6.5" cy="6.5" r="5" />
        <line x1="6.5" y1="4" x2="6.5" y2="7" />
        <circle cx="6.5" cy="9" r=".6" fill="var(--red)" />
      </svg>
    ),
    text: (
      <><strong>Alex Morgan</strong> flagged <strong>ECP-142</strong> as blocker</>
    ),
    time: "1 hr ago",
  },
  {
    iconBg: "var(--gold-bg)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--gold)" strokeWidth="1.5">
        <circle cx="6.5" cy="4.5" r="2" />
        <path d="M1.5 11c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" />
      </svg>
    ),
    text: (
      <><strong>Nina Chen</strong> joined the sprint</>
    ),
    time: "3 hrs ago",
  },
  {
    iconBg: "var(--bg4)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--text3)" strokeWidth="1.5">
        <rect x="1" y="2" width="11" height="9" rx="1.5" />
        <polyline points="1,4.5 6.5,7.5 12,4.5" />
      </svg>
    ),
    text: (
      <><strong>James Liu</strong> commented on <strong>ECP-138</strong></>
    ),
    time: "5 hrs ago",
  },
];

export default function ActivityTimeline() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Activity Timeline</span>
      </div>
      <div className="card-body card-body-activity">
        {activities.map((act, i) => (
          <div className="act-item" key={i}>
            <div className="act-icon" style={{ background: act.iconBg }}>
              {act.icon}
            </div>
            <div className="act-body">
              <div className="act-text">{act.text}</div>
              <div className="act-time">{act.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}