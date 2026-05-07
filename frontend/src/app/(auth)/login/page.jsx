'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { login, getCurrentUser } from "@/services/authService";
import "@/styles/auth/auth.css";
import logo from "@/assets/logo_entreprise.png";

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setGeneralError("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setGeneralError("");

  try {
    await login(formData.email, formData.password);
    const user = await getCurrentUser();
    if (!user) throw new Error("Session non trouvée");

    if (user.roles?.includes("ADMIN")) {
      router.push("/EspaceAdmin/dashboard");
    } else if (user.roles?.includes("CLIENT")) {
      router.push("/EspaceClient/dashboard");
    } else {
      setGeneralError("Rôle non reconnu. Veuillez contacter le support.");
    }
  } catch (error) {
    const data = error?.response?.data;
    const code = data?.businessErrorCode;

    const errorMessages = {
      302: "Votre compte est verrouillé. Veuillez contacter le support.",
      303: "Votre compte n'est pas activé. Vérifiez votre email.",
      304: "Email ou mot de passe incorrect.",
    };

    setGeneralError(
      errorMessages[code] ||
      data?.businessErrorDescription ||
      "Une erreur est survenue. Veuillez réessayer."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="left-logo-wrap">
<img src={logo.src} alt="SmartFlow" />
         
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="form-card">
          <div className="form-card-header">
            <p>Connectez-vous pour accéder à votre espace SmartFlow</p>
          </div>

          {generalError && (
            <div className="alert alert-error">
              <span className="alert-icon"><AlertCircle size={16} /></span>
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Adresse email</label>
              <div className="input-wrap">
                <span className="input-icon"><Mail size={15} /></span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@gmail.com"
                  className="form-input"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <div className="input-wrap">
                <span className="input-icon"><Lock size={15} /></span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>
          </form>

          <p className="auth-footer">
            Pas encore de compte ?{" "}
            <button onClick={() => router.push("/register")}>S'inscrire</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;