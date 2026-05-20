import "@/styles/home/benefits.css";

export default function Benefits() {
  return (
    <section className="section" id="benefits">
      <div className="container">

        {/* Top — two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 64 }}>
          <div>
            <div className="section-eyebrow">
              <div className="eyebrow-line" />
              Why SMARTFLOW
            </div>
            <h2 className="section-headline">
              Results your team<br />will actually feel
            </h2>
            <p className="section-sub">
              Teams using SmartFlow ship 40% faster, reduce planning overhead by 60%, and spend more time building — less time coordinating.
            </p>
            <div style={{ marginTop: 28 }}>
              <button className="btn-primary">See Full Case Studies</button>
            </div>
          </div>

          {/* Stats 2×2 grid */}
          <div className="stats-grid">
            <div className="stat-box stat-box-accent">
              <div className="stat-box-num">40%</div>
              <div className="stat-box-label">Faster delivery</div>
            </div>
            <div className="stat-box stat-box-plain">
              <div className="stat-box-num-plain">3x</div>
              <div className="stat-box-label">Fewer missed deadlines</div>
            </div>
            <div className="stat-box stat-box-plain">
              <div className="stat-box-num-plain">60%</div>
              <div className="stat-box-label">Less planning time</div>
            </div>
            <div className="stat-box stat-box-accent">
              <div className="stat-box-num">92%</div>
              <div className="stat-box-label">AI accuracy rate</div>
            </div>
          </div>
        </div>

       

      </div>
    </section>
  );
}
