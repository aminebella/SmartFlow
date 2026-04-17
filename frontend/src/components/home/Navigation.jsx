export default function Navigation() {
    return(
      <header className="nav">
        {/* NAVIGATION */}
        <div className="container">
          <div className="nav-inner">
            <a className="nav-logo" href="#">
              <div
                className="nav-logo-mark"
                style={{ background: 'none', boxShadow: 'none', borderRadius: 0, width: 'auto', height: 'auto' }}
              >
                <img src="/favicon.jpeg" alt="SmartFlow" style={{ height: 48, width: 'auto', objectFit: 'contain', display: 'block' }} />
              </div>
            </a>

            <nav className="nav-links">
              <a className="nav-link active" href="#">Home</a>
              <a className="nav-link" href="#features">Features</a>
              <a className="nav-link" href="#platform">Solutions</a>
              <a className="nav-link" href="#benefits">Pricing</a>
              <a className="nav-link" href="#footer">About</a>
            </nav>

            <div className="nav-actions">
              <button className="btn-ghost-nav">Log in</button>
              <button className="btn-primary-nav">Get Started</button>
            </div>
          </div>
        </div>
      </header>
    );
}