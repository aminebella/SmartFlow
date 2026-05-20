import "@/styles/home/features.css";

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-header-center">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            Features
            <div className="eyebrow-line" />
          </div>
          <h2 className="section-headline">
            Everything your team needs<br />to move faster
          </h2>
          <p className="section-sub">
            From AI-powered analysis to real-time monitoring — SmartFlow brings intelligence to every stage of your project lifecycle.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1 — AI Analysis */}
          <div className="feature-card">
            <div className="feature-title">AI Project Analysis</div>
            <div className="feature-desc">
              Upload your specification document and let our AI instantly parse requirements, identify gaps, assess risk factors, and suggest a complete project roadmap with estimated timelines.
            </div>
            <div className="feature-tags">
              <span className="tag tag-gold">NLP Processing</span>
              <span className="tag tag-gold">Risk Detection</span>
              <span className="tag tag-gold">Auto-Planning</span>
            </div>
          </div>

          {/* Card 2 — Resource Planning */}
          <div className="feature-card">
            <div className="feature-title">Smart Resource Planning</div>
            <div className="feature-desc">
              AI-powered workload balancing that predicts resource bottlenecks before they happen. Automatically match team skills to tasks and optimize sprint velocity across all projects.
            </div>
            <div className="feature-tags">
              <span className="tag tag-teal">Workload Balancing</span>
              <span className="tag tag-teal">Skill Matching</span>
              <span className="tag tag-teal">Cost Forecast</span>
            </div>
          </div>

          {/* Card 3 — Real-Time Monitoring */}
          <div className="feature-card">
            <div className="feature-title">Real-Time Monitoring</div>
            <div className="feature-desc">
              Live project health dashboards with AI-generated insights. Track KPIs, sprint velocity, burndown charts, and team performance — all updating in real time as your team works.
            </div>
            <div className="feature-tags">
              <span className="tag tag-blue">Live Dashboards</span>
              <span className="tag tag-blue">AI Alerts</span>
              <span className="tag tag-blue">Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
