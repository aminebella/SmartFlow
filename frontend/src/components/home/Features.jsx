export default function Features() {
    return ( 
      <section className="section" id="features">
        {/* FEATURES SECTION */}
        <div className="container">
          <div className="section-header-center">
            <div className="section-eyebrow"><div className="eyebrow-line" />Features<div className="eyebrow-line" /></div>
            <h2 className="section-headline">Everything your team needs<br />to move faster</h2>
            <p className="section-sub">From AI-powered analysis to real-time monitoring — SmartFlow brings intelligence to every stage of your project lifecycle.</p>
          </div>

          <div className="features-grid">
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrap icon-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
                  <path d="M12 2l2.4 4.8L20 8l-4 3.9.9 5.6L12 15l-4.9 2.5.9-5.6L4 8l5.6-.8z" />
                  <circle cx="19" cy="5" r="2" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="feature-title">AI Project Analysis</div>
              <div className="feature-desc">Upload your specification document and let our AI instantly parse requirements, identify gaps, assess risk factors, and suggest a complete project roadmap with estimated timelines.</div>
              <div className="feature-tags">
                <span className="tag tag-blue">NLP Processing</span>
                <span className="tag tag-blue">Risk Detection</span>
                <span className="tag tag-blue">Auto-Planning</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrap icon-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8">
                  <circle cx="8" cy="8" r="3" />
                  <circle cx="16" cy="8" r="3" />
                  <circle cx="12" cy="17" r="3" />
                  <path d="M8 11v3M16 11v3M9 16l3-2 3 2" />
                </svg>
              </div>
              <div className="feature-title">Smart Resource Planning</div>
              <div className="feature-desc">AI-powered workload balancing that predicts resource bottlenecks before they happen. Automatically match team skills to tasks and optimize sprint velocity across all projects.</div>
              <div className="feature-tags">
                <span className="tag tag-purple">Workload Balancing</span>
                <span className="tag tag-purple">Skill Matching</span>
                <span className="tag tag-purple">Cost Forecast</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrap icon-indigo">
                <svg viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                </svg>
              </div>
              <div className="feature-title">Real-Time Monitoring</div>
              <div className="feature-desc">Live project health dashboards with AI-generated insights. Track KPIs, sprint velocity, burndown charts, and team performance — all updating in real time as your team works.</div>
              <div className="feature-tags">
                <span className="tag tag-indigo">Live Dashboards</span>
                <span className="tag tag-indigo">AI Alerts</span>
                <span className="tag tag-indigo">Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}