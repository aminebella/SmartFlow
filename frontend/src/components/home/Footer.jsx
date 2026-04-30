export default function Footer() {
    return (
      <footer className="footer" id="footer">
        {/* FOOTER (template) */}
        <div className="container">
          <div className="footer-grid">
            <div>
              <a className="nav-logo" href="#">
                <div className="nav-logo-mark" style={{ width: 40, height: 40, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/favicon.jpeg" alt="SmartFlow" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                </div>
                <div className="footer-brand-name">SmartFlow</div>
              </a>

              <p className="footer-desc">AI-powered project management to plan, predict and ship with confidence. Built for product teams that value speed and predictability.</p>

              <div className="footer-social" style={{ marginTop: 12 }}>
                <a className="social-btn" href="#" aria-label="Twitter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.86 9.86 0 0 1-3.13 1.2A4.92 4.92 0 0 0 16.11 0c-2.73 0-4.95 2.5-4.31 5.14A13.94 13.94 0 0 1 1.64.89 4.93 4.93 0 0 0 3.18 7.86 4.9 4.9 0 0 1 .96 7v.06A4.93 4.93 0 0 0 4.92 12a4.92 4.92 0 0 1-2.23.08A4.94 4.94 0 0 0 6.29 16.6 9.9 9.9 0 0 1 1 18.58 13.94 13.94 0 0 0 7.55 21c9.05 0 14-7.5 14-14v-.63A9.83 9.83 0 0 0 23 3z" /></svg>
                </a>
                <a className="social-btn" href="#" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2c-1.2 0-2 .8-2 2v7h-4v-14h4v2" /><rect x="2" y="9" width="4" height="11" rx="1" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a className="social-btn" href="#" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1-5-2-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 10.5 20.13V24" /></svg>
                </a>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Product</div>
              <a className="footer-link" href="#features">Features</a>
              <a className="footer-link" href="#platform">Pricing</a>
              <a className="footer-link" href="#cta">Roadmap</a>
              <a className="footer-link" href="#">Integrations</a>
            </div>

            <div>
              <div className="footer-col-title">Company</div>
              <a className="footer-link" href="#">About</a>
              <a className="footer-link" href="#">Blog</a>
              <a className="footer-link" href="#">Careers <span style={{ background: '#C9A227', color: '#081024', padding: '2px 6px', borderRadius: 12, marginLeft: 8, fontSize: 12, fontWeight: 800 }}>Hiring</span></a>
              <a className="footer-link" href="#">Contact</a>
            </div>

            <div>
              <div className="footer-col-title">Contact & Support</div>
              <a className="footer-link" href="#">help@smartflow.example</a>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 8 }}>Mon–Fri · 9:00–18:00 (UTC)</div>
              <div style={{ marginTop: 12 }}>
                <a className="footer-link" href="#">Help Center</a>
                <a className="footer-link" href="#">Status</a>
                <a className="footer-link" href="#">Community</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">© {new Date().getFullYear()} SmartFlow, Inc. All rights reserved.</div>
            <div className="footer-bottom-links">
              <a className="footer-bottom-link" href="#">Privacy Policy</a>
              <a className="footer-bottom-link" href="#">Terms of Service</a>
              <a className="footer-bottom-link" href="#">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    );
}