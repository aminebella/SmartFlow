export default function Testimonials() {
    return (
      <section className="section" id="testimonials">
        {/* TESTIMONIALS */}
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-eyebrow"><div className="eyebrow-line" />TESTIMONIALS<div className="eyebrow-line" /></div>
            <h2 className="section-headline">Loved by product teams everywhere</h2>
            <p className="section-sub">Trusted by engineering managers, product leads, and design teams at fast-moving companies.</p>
          </div>

          <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            <div className="testimonial-card">
              <div className="testimonial-quote" style={{ fontStyle: 'italic', color: 'var(--text1)' }}>
                “We evaluated 6 project management tools. SMARTFLOW was the only one with genuine AI capabilities — not just automation scripts. The risk prediction alone prevented two critical project delays in Q1.”
              </div>
              <div className="testimonial-meta" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <img src="/images/avatar1.jpg" alt="Maya Thompson avatar" className="avatar" loading="lazy" style={{ width: 56, height: 56, borderRadius: 9999, objectFit: 'cover', flex: '0 0 56px' }} />
                <div>
                  <div className="author">Maya Thompson</div>
                  <div className="role">Head of Product — Atlas Labs</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote" style={{ fontStyle: 'italic', color: 'var(--text1)' }}>
                “We now ship predictably and with fewer surprises. SmartFlow's forecasts are the most reliable we've seen.”
              </div>
              <div className="testimonial-meta" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <img src="/images/avatar2.jpg" alt="Ethan Park avatar" className="avatar" loading="lazy" style={{ width: 56, height: 56, borderRadius: 9999, objectFit: 'cover', flex: '0 0 56px' }} />
                <div>
                  <div className="author">Ethan Park</div>
                  <div className="role">Engineering Manager — NovaPay</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote" style={{ fontStyle: 'italic', color: 'var(--text1)' }}>
                “The AI-generated sprint plans are a game changer — we spend less time in meetings and more time building.”
              </div>
              <div className="testimonial-meta" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <img src="/images/avatar3.jpg" alt="Sara Gomez avatar" className="avatar" loading="lazy" style={{ width: 56, height: 56, borderRadius: 9999, objectFit: 'cover', flex: '0 0 56px' }} />
                <div>
                  <div className="author">Sara Gomez</div>
                  <div className="role">CTO — Lumen Health</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    );
}