export default function Benefits() {
    return(
      <section className="section" id="benefits">
        {/* BENEFITS SECTION */}
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', marginBottom: 64 }}>
            <div>
              <div className="section-eyebrow"><div className="eyebrow-line" /> Why SMARTFLOW</div>
              <h2 className="section-headline">Results your team<br />will actually feel</h2>
              <p className="section-sub">Teams using SmartFlow ship 40% faster, reduce planning overhead by 60%, and spend more time building — less time coordinating.</p>
              <div style={{ marginTop: 28 }}>
                <button className="btn-hero-primary">See Full Case Studies</button>
              </div>
            </div>

            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: 'var(--grad-soft)', border: '1px solid rgba(37,99,235,0.1)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 36, fontWeight: 800, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>40%</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginTop: 4 }}>Faster delivery</div>
                </div>

                <div style={{ background: 'var(--off-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 36, fontWeight: 800, color: 'var(--text1)' }}>3x</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginTop: 4 }}>Fewer missed deadlines</div>
                </div>

                <div style={{ background: 'var(--off-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 36, fontWeight: 800, color: 'var(--text1)' }}>60%</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginTop: 4 }}>Less planning time</div>
                </div>

                <div style={{ background: 'var(--grad-soft)', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 36, fontWeight: 800, background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>92%</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text1)', marginTop: 4 }}>AI accuracy rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#eff4ff,#dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#2563eb" strokeWidth="1.8"><polyline points="2,9 7,14 16,4"/></svg>
              </div>
              <div className="benefit-number">40%</div>
              <div className="benefit-title">Faster Project Planning</div>
              <div className="benefit-desc">AI auto-generates epics, tasks, and sprint plans from your specification documents in seconds, not hours.</div>
            </div>

            <div className="benefit-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#f3eeff,#ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#7c3aed" strokeWidth="1.8"><circle cx="6" cy="12" r="2.5"/><circle cx="12" cy="12" r="2.5"/><circle cx="9" cy="6" r="2.5"/></svg>
              </div>
              <div className="benefit-number">3x</div>
              <div className="benefit-title">Better Resource Allocation</div>
              <div className="benefit-desc">Intelligent workload distribution prevents burnout and ensures the right person is on the right task at the right time.</div>
            </div>

            <div className="benefit-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#4f46e5" strokeWidth="1.8"><polyline points="3,12 7,7 11,9 15,4"/><polyline points="13,4 15,4 15,6"/></svg>
              </div>
              <div className="benefit-number">92%</div>
              <div className="benefit-title">AI-Powered Insights</div>
              <div className="benefit-desc">Predictive analytics surface risks before they become problems. Know your project's health at a glance, always.</div>
            </div>

            <div className="benefit-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#10b981" strokeWidth="1.8"><circle cx="9" cy="9" r="6.5"/><polyline points="9,5.5 9,9 11.5,10.5"/></svg>
              </div>
              <div className="benefit-number">60%</div>
              <div className="benefit-title">Reduced Meeting Overhead</div>
              <div className="benefit-desc">Async AI status updates and intelligent standup summaries keep the team aligned without endless status calls.</div>
            </div>

            <div className="benefit-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#fef9e7,#fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#d97706" strokeWidth="1.8"><path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.3 5.3 13.3l.7-4.1L3 6.3l4.2-.7z"/></svg>
              </div>
              <div className="benefit-number">5x</div>
              <div className="benefit-title">Improved Forecast Accuracy</div>
              <div className="benefit-desc">Machine learning trained on thousands of real projects gives you realistic delivery estimates, not wishful thinking.</div>
            </div>

            <div className="benefit-card">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#fff0f0,#fde8e7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#d93025" strokeWidth="1.8"><circle cx="9" cy="9" r="6.5"/><line x1="9" y1="5.5" x2="9" y2="9.5"/><circle cx="9" cy="12" r="0.8" fill="#d93025"/></svg>
              </div>
              <div className="benefit-number">80%</div>
              <div className="benefit-title">Fewer Risk Surprises</div>
              <div className="benefit-desc">Proactive risk identification flags blockers and dependencies early, so nothing catches you off guard at sprint end.</div>
            </div>
          </div>
        </div>
      </section>
    );
}