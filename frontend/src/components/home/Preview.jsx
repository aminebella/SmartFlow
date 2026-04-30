export default function Preview() {
    return(
      <section className="preview-wrap section-alt" id="platform">
        {/* PLATFORM PREVIEW */}
        <div className="container">
          <div className="preview-header">
            <div className="section-eyebrow"><div className="eyebrow-line" />Platform preview<div className="eyebrow-line" /></div>
            <h2 className="section-headline">See SmartFlow in action</h2>
            <p className="section-sub">From Kanban boards and sprint management to backlog grooming and AI-generated reports — everything lives in one clean, unified workspace.</p>
          </div>
        </div>

        <div className="platform-screenshot" style={{ marginLeft: 80, marginRight: 80, position: 'relative' }}>
          <div className="ss-topbar">
            <div className="ss-dots">
              <div className="ss-dot" style={{ background: '#f87171' }} />
              <div className="ss-dot" style={{ background: '#fbbf24' }} />
              <div className="ss-dot" style={{ background: '#34d399' }} />
            </div>
            <div className="ss-url">app.smartflow.io/project/ecommerce/board</div>
            <div className="ss-nav-icons">
              <div className="ss-nav-icon" />
              <div className="ss-nav-icon" />
            </div>
          </div>

          <div className="ss-layout">
            <aside className="ss-sidebar">
              <div className="ss-brand-row">
                <div className="ss-brand-icon" />
                <div className="ss-brand-name">SmartFlow</div>
              </div>
              <div className="ss-nav-link on">Backlog</div>
              <div className="ss-nav-link">Board</div>
              <div className="ss-nav-link">Sprints</div>
            </aside>

            <main className="ss-main">
              <div className="ss-main-hdr">
                <div>
                  <div className="ss-main-title">E-Commerce Platform — Sprint 4</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Mar 1 – Mar 22, 2026 · 10 days remaining · 68% complete</div>
                </div>
                <button className="ss-btn-sm">+ Create Ticket</button>
              </div>

              <div className="ss-kanban">
                <div className="ss-col">
                  <div className="ss-col-hdr todo">Todo &nbsp;<span style={{ background: 'var(--bg-subtle)', borderRadius: 3, padding: '0 4px' }}>12</span></div>
                  <div className="ss-task">
                    <div className="ss-task-title">Address validation API for shipping</div>
                    <div className="ss-task-foot"><span className="ss-task-prio prio-l">Low</span><div className="ss-av" style={{ background: '#0891b2' }}>TK</div></div>
                  </div>
                </div>

                <div className="ss-col" style={{ background: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 7 }}>
                  <div className="ss-col-hdr ip">In Progress &nbsp;<span style={{ background: 'var(--accent-bg)', borderRadius: 3, padding: '0 4px' }}>8</span></div>
                  <div className="ss-task" style={{ borderColor: 'rgba(37,99,235,0.2)' }}>
                    <div className="ss-task-title">Stripe payment gateway integration</div>
                    <div style={{ margin: '4px 0', background: 'var(--border)', borderRadius: 3, height: 3, overflow: 'hidden' }}><div style={{ width: '60%', height: '100%', background: 'var(--blue)' }} /></div>
                    <div className="ss-task-foot"><span className="ss-task-prio prio-c">Critical</span><div className="ss-av" style={{ background: '#1d4ed8' }}>TK</div></div>
                  </div>
                </div>

                <div className="ss-col">
                  <div className="ss-col-hdr rev">Review &nbsp;<span style={{ background: '#f3eeff', borderRadius: 3, padding: '0 4px' }}>5</span></div>
                  <div className="ss-task">
                    <div className="ss-task-title">Cart total with coupon codes</div>
                    <div className="ss-task-foot"><span className="ss-task-prio prio-h">High</span><div className="ss-av" style={{ background: '#166534' }}>SR</div></div>
                  </div>
                </div>

                <div className="ss-col" style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 7 }}>
                  <div className="ss-col-hdr done">Done &nbsp;<span style={{ background: '#e6f7ee', borderRadius: 3, padding: '0 4px' }}>34</span></div>
                  <div className="ss-task" style={{ opacity: 0.55 }}>
                    <div className="ss-task-title">User registration & email verify</div>
                    <div className="ss-task-foot"><span className="ss-task-prio prio-h">High</span><div className="ss-av" style={{ background: '#92400e' }}>NC</div></div>
                  </div>
                </div>
              </div>

              <div className="ss-velocity">
                <div className="ss-vel-box"><div className="ss-vel-label">Velocity</div><div className="ss-vel-val">94<span style={{ fontSize: 9, fontWeight: 400, color: 'var(--text3)' }}>pts</span></div><div className="ss-vel-trend trend-pos">↑ 18%</div></div>
                <div className="ss-vel-box"><div className="ss-vel-label">Completed</div><div className="ss-vel-val">34</div><div className="ss-vel-trend" style={{ color: 'var(--text3)' }}>of 50 tasks</div></div>
                <div className="ss-vel-box"><div className="ss-vel-label">Days Left</div><div className="ss-vel-val" style={{ color: '#d97706' }}>10</div><div className="ss-vel-trend" style={{ color: 'var(--text3)' }}>of 22 days</div></div>
              </div>
            </main>

            <aside className="ss-analytics">
              <div className="ss-analytics-title">Project Analytics</div>
              <div className="mini-donut">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="28" fill="none" stroke="#e8eaf0" strokeWidth="10" />
                  <circle cx="36" cy="36" r="28" fill="none" stroke="url(#grad2)" strokeWidth="10" strokeDasharray="119.4 175.9" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="mini-donut-label">68%</div>
              </div>

              <div>
                <div className="analytics-stat"><span className="analytics-stat-key">Todo</span><span className="analytics-stat-val" style={{ color: 'var(--text3)' }}>12</span></div>
                <div className="analytics-stat"><span className="analytics-stat-key">In Progress</span><span className="analytics-stat-val" style={{ color: '#2563eb' }}>8</span></div>
                <div className="analytics-stat"><span className="analytics-stat-key">In Review</span><span className="analytics-stat-val" style={{ color: '#7c3aed' }}>5</span></div>
                <div className="analytics-stat"><span className="analytics-stat-key">Done</span><span className="analytics-stat-val" style={{ color: '#10b981' }}>34</span></div>
              </div>

              <div className="analytics-bar-row" style={{ marginTop: 14 }}>
                <div className="abar-label"><span>AI Prediction</span></div>
                <div style={{ background: 'linear-gradient(135deg,#eff4ff,#f3eeff)', borderRadius: 7, padding: 9, border: '1px solid rgba(37,99,235,0.1)' }}>
                  <div style={{ fontSize: 9, color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>On-Time Delivery</div>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 18, fontWeight: 800, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>92%</div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>);
}