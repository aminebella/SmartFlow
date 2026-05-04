export default function ActiveSprint() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Active Sprint — Sprint 4</span>
        <a className="card-link" href="#">Manage →</a>
      </div>
      <div className="card-body">
        <div className="sprint-top-row">
          <div>
            <div className="sprint-name">Sprint 4 · Checkout &amp; Payments</div>
            <div className="sprint-dates">Mar 1 – Mar 22, 2026</div>
          </div>
          <span className="status status-progress">In Progress</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "68%" }} />
        </div>
        <div className="progress-labels">
          <span>34 of 50 tasks done</span>
          <span className="progress-pct">68%</span>
        </div>

        <div className="sprint-stat-row">
          <div className="sprint-stat-box">
            <div className="sprint-stat-val" style={{ color: "var(--text3)" }}>12</div>
            <div className="sprint-stat-key">Todo</div>
          </div>
          <div className="sprint-stat-box">
            <div className="sprint-stat-val" style={{ color: "var(--gold)" }}>8</div>
            <div className="sprint-stat-key">In Progress</div>
          </div>
          <div className="sprint-stat-box">
            <div className="sprint-stat-val" style={{ color: "var(--purple)" }}>5</div>
            <div className="sprint-stat-key">Review</div>
          </div>
          <div className="sprint-stat-box">
            <div className="sprint-stat-val" style={{ color: "var(--green)" }}>34</div>
            <div className="sprint-stat-key">Done</div>
          </div>
        </div>
      </div>
    </div>
  );
}