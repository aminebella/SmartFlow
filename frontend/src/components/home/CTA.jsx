export default function CTA() {
    return(
         
      <section className="cta-section" id="cta">
        {/* CTA (from template) */}
        <div className="cta-orb1" />
        <div className="cta-orb2" />
        <div className="container">
          <div className="cta-inner">
            <div className="cta-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                <path d="M6 1l1 2 2.4.3-1.7 1.7.4 2.4L6 6.3 3.9 7.4l.4-2.4L2.6 3.3l2.4-.3z" />
              </svg>
              No credit card required — Free forever plan available
            </div>

            <h2 className="cta-headline">Start managing your<br />projects <span style={{ background: 'linear-gradient(135deg,#60a5fa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>intelligently</span></h2>

            <p className="cta-sub">Join 12,000+ teams who have already made the switch to AI-powered project management.</p>

            <div className="cta-actions">
              <button className="btn-cta-primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,8 8,3 13,8" /><line x1="8" y1="3" x2="8" y2="13" /></svg>
                Start Managing Your Projects
              </button>
              <button className="btn-cta-secondary">Schedule a Demo</button>
            </div>

            <div className="cta-note">Free plan includes 3 projects · No setup required · Cancel anytime</div>
          </div>
        </div>
      </section>
    );
}