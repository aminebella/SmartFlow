export default function Hero() {
    return (
      <section className="hero">
        {/* HERO */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="container">
          <div className="hero-inner">
            <div>
              <div className="hero-badge">
                <div className="hero-badge-dot" />
                AI-driven · Intelligent Planning
              </div>

              <h1 className="hero-headline">SmartFlow — AI-powered project management for modern teams</h1>

              <p className="hero-sub">
                An intelligent platform that analyzes project requirements, predicts resources, estimates costs and timelines, and manages tasks in real time — so your team ships faster.
              </p>

              <div className="hero-ctas">
                <button className="btn-hero-primary">
                  <span className="play-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,8 8,3 13,8" />
                      <line x1="8" y1="3" x2="8" y2="13" />
                    </svg>
                  </span>
                  Start Managing Your Projects
                </button>
                <button className="btn-hero-secondary">Schedule a Demo</button>
              </div>

              <div className="hero-trust">
                <div className="hero-avatars">
                  <div className="av" style={{ background: '#dbeafe', color: '#1d4ed8' }}>MK</div>
                  <div className="av" style={{ background: '#dcfce7', color: '#166534' }}>AR</div>
                  <div className="av" style={{ background: '#ede9fe', color: '#5b21b6' }}>LT</div>
                </div>
                <div className="hero-trust-text">
                  <strong>12,000+</strong> teams rely on SmartFlow
                </div>
              </div>
            </div>

            {/* HERO VISUAL (dashboard mock) - kept as structure so CSS provides visuals */}
            <div className="hero-visual">
              <div className="dashboard-card">
                <div className="dash-topbar">
                  <div className="dash-dot" style={{ background: '#e8eaf0' }} />
                  <div className="dash-title">Project Dashboard</div>
                  <div className="dash-tabs">
                    <div className="dash-tab on">Board</div>
                    <div className="dash-tab">Reports</div>
                  </div>
                </div>
                <div className="dash-body">
                  <div className="dash-left">
                    {/* small rows to match styles */}
                    <div className="proj-row">
                      <div className="proj-dot" style={{ background: '#2563eb' }} />
                      <div className="proj-name">E-Commerce Platform — Sprint 4</div>
                      <div className="proj-pct">68%</div>
                    </div>
                    <div className="chart-bars">
                      <div className="chart-bar"><div className="chart-bar-inner" style={{ height: '60%', background: '#c9a227' }} /></div>
                      <div className="chart-bar"><div className="chart-bar-inner" style={{ height: '40%', background: '#7c3aed' }} /></div>
                      <div className="chart-bar"><div className="chart-bar-inner" style={{ height: '80%', background: '#10b981' }} /></div>
                    </div>
                  </div>
                  <div className="dash-right">
                    <div className="mini-donut">
                      <svg width="72" height="72" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="28" fill="none" stroke="#e8eaf0" strokeWidth="10" />
                        <circle cx="36" cy="36" r="28" fill="none" stroke="url(#grad1)" strokeWidth="10" strokeDasharray="119.4 175.9" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#7c3aed" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="mini-donut-label">68%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}