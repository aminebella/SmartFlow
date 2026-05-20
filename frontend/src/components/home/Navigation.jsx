"use client";
import { useRouter } from "next/navigation";
import "@/styles/home/navigation.css";

export default function Navigation() {
  const router = useRouter();

  return (
    <header className="nav">
      <div className="container">
        <div className="nav-inner">
          <a className="nav-logo" href="#">
            <div className="nav-logo-mark">
              <img src="/favicon.png" alt="SmartFlow" />
            </div>
          </a>

          <nav className="nav-links">
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#platform">Solutions</a>
            <a className="nav-link" href="#benefits">About</a>
          </nav>

          <div className="nav-actions">
            <button
              className="btn-primary-nav"
              onClick={() => router.push("/login")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
