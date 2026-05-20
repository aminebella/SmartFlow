import "@/styles/home/footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand column */}
          <div>
            <a className="nav-logo" href="#" style={{ display: 'inline-flex', marginBottom: 14, textDecoration: 'none' }}>
              <div style={{ background: 'none', boxShadow: 'none' }}>
                <img src="/favicon.png" alt="SmartFlow" style={{ height: 60, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
            </a>

            <p className="footer-desc">
              AI-powered project management to plan, predict and ship with confidence. Built for product teams that value speed and predictability.
            </p>

            
          </div>

          {/* Product links */}
          <div>
            <div className="footer-col-title">Product</div>
            <a className="footer-link" href="#features">Features</a>
            <a className="footer-link" href="#platform">Pricing</a>
            <a className="footer-link" href="#cta">Roadmap</a>
            <a className="footer-link" href="#">Integrations</a>
          </div>

          {/* Company links */}
          <div>
            <div className="footer-col-title">Company</div>
            <a className="footer-link" href="#">About</a>
            <a className="footer-link" href="#">Blog</a>
            <a className="footer-link" href="#">
              Careers{" "}
              <span style={{
                background: "#C9A227",
                color: "#1A1814",
                padding: "2px 7px",
                borderRadius: 12,
                marginLeft: 8,
                fontSize: 11,
                fontWeight: 800
              }}>
                Hiring
              </span>
            </a>
            <a className="footer-link" href="#">Contact</a>
          </div>

          {/* Support */}
          <div>
            <div className="footer-col-title">Contact & Support</div>
            <a className="footer-link" href="#">help@smartflow.example</a>
            <div style={{ color: "rgba(238,240,243,0.30)", fontSize: 13, marginTop: 8 }}>
              Mon–Fri · 9:00–18:00 (UTC)
            </div>
            <div style={{ marginTop: 14 }}>
              <a className="footer-link" href="#">Help Center</a>
              <a className="footer-link" href="#">Status</a>
              <a className="footer-link" href="#">Community</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
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
