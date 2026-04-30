"use client";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();

  return (
    <header className="nav">
      <div className="container">
        <div className="nav-inner">
          <a className="nav-logo" href="#">
            <div
              className="nav-logo-mark"
              style={{ background: 'none', boxShadow: 'none', borderRadius: 0, width: 'auto', height: 'auto' }}
            >
              <img src="/favicon.png" alt="SmartFlow" style={{ height: 60, width: 'auto', objectFit: 'contain', display: 'block' }} />
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
            <button
              className="btn-primary-nav"
              onClick={() => router.push("/register")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}