"use client";
import { useRouter } from "next/navigation";
import "@/styles/home/hero.css";


function HeroCTAs({ router }) {
  return (
    <div className="hero-ctas">
      <button
        className="btn-hero-primary"
        onClick={() => router.push("/login")}
      >
        
        Start Managing Your Projects
      </button>
    
    </div>
  );
}


/* ─── Dashboard screen ──────────────────────────────────────── */
function ScreenDashboard() {
  const projects = [
    { name: "E-Commerce Platform", pct: 68, color: "#2A5F80" },
    { name: "Mobile App Redesign",  pct: 44, color: "#1D9E5C" },
    { name: "API Integration v2",   pct: 91, color: "#C9A227" },
  ];

  const bars = [55, 35, 78, 48, 88, 62, 72];

  return (
    <div className="screen screen-1">
      <div className="screen-bar">
        <span className="s-dot s-dot-red" />
        <span className="s-dot s-dot-yellow" />
        <span className="s-dot s-dot-green" />
        <span className="screen-title">Project Dashboard</span>
      </div>
      <div className="screen-body">
        <div className="dash-header">
          <span className="dash-title-text">Active Sprints</span>
          <span className="dash-badge">Sprint 4</span>
        </div>

        {projects.map((p) => (
          <div key={p.name} className="proj-row">
            <span className="proj-dot" style={{ background: p.color }} />
            <span className="proj-name">{p.name}</span>
            <div className="proj-progress">
              <div className="prog-bar">
                <div className="prog-fill" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
            <span className="proj-pct">{p.pct}%</span>
          </div>
        ))}

        <div className="mini-chart">
          {bars.map((h, i) => (
            <div key={i} className="mc-bar">
              <div
                className="mc-bar-fill"
                style={{
                  height: `${h}%`,
                  background: i % 2 === 0 ? "rgba(201,162,39,0.40)" : "#C9A227",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics screen ──────────────────────────────────────── */
function ScreenAnalytics() {
  return (
    <div className="screen screen-2">
      <div className="screen-bar">
        <span className="s-dot s-dot-red" />
        <span className="s-dot s-dot-yellow" />
        <span className="s-dot s-dot-green" />
        <span className="screen-title">Analytics</span>
      </div>
      <div className="screen-body">
        <div className="donut-wrap">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#E8E4DC" strokeWidth="12" />
            <circle
              cx="50" cy="50" r="38"
              fill="none"
              stroke="url(#dg)"
              strokeWidth="12"
              strokeDasharray="160 239"
              strokeDashoffset="60"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C9A227" />
                <stop offset="100%" stopColor="#E8C547" />
              </linearGradient>
            </defs>
          </svg>
          <div className="donut-label">
            <span className="donut-label-num">68%</span>
            <span className="donut-label-sub">velocity</span>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-item">
            <div className="stat-num stat-blue">24</div>
            <div className="stat-lbl">Tasks done</div>
          </div>
          <div className="stat-item">
            <div className="stat-num stat-green">+12%</div>
            <div className="stat-lbl">vs last sprint</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">6</div>
            <div className="stat-lbl">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Task list screen ──────────────────────────────────────── */
function ScreenTasks() {
  const tasks = [
    { text: "Setup CI pipeline", done: true,  tag: "Done",   tagStyle: { background: "#E8F5EE", color: "#1D9E5C" } },
    { text: "Review PR #47",     done: false, tag: "Active", tagStyle: { background: "#E8F4F8", color: "#2A5F80" } },
    { text: "Update API docs",   done: false, tag: "Soon",   tagStyle: { background: "rgba(201,162,39,0.10)", color: "#9E7B1A" } },
    { text: "Deploy staging",    done: true,  tag: "Done",   tagStyle: { background: "#E8F5EE", color: "#1D9E5C" } },
  ];

  return (
    <div className="screen screen-3">
      <div className="screen-bar">
        <span className="s-dot s-dot-red" />
        <span className="s-dot s-dot-yellow" />
        <span className="s-dot s-dot-green" />
        <span className="screen-title">My Tasks</span>
      </div>
      <div className="screen-body">
        {tasks.map((t) => (
          <div key={t.text} className="task-item">
            <div className={`task-check ${t.done ? "done" : "open"}`}>
              {t.done && (
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="2,5 4,7 8,3" />
                </svg>
              )}
            </div>
            <span className={`task-text ${t.done ? "done" : "open"}`}>{t.text}</span>
            <span className="task-tag" style={t.tagStyle}>{t.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ─── Hero (main export) ────────────────────────────────────── */
export default function Hero() {
  const router = useRouter();

  return (
    <section className="hero">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="hero-container">
        {/* LEFT — text */}
        <div className="hero-text">
        

          <h1 className="hero-headline">
            SmartFlow —<br />
            <span className="headline-gradient">AI-powered</span><br />
            project management
          </h1>

          <p className="hero-sub">
            An intelligent platform that analyzes project requirements, predicts
            resources, estimates costs and timelines, and manages tasks in real
            time — so your team ships faster.
          </p>

          <HeroCTAs router={router} />
        </div>

        {/* RIGHT — floating screens */}
        <div className="hero-screens">
          <ScreenDashboard />
          <ScreenAnalytics />
          <ScreenTasks />
        </div>
      </div>
    </section>
  );
}
