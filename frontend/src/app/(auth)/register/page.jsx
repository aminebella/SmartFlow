"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, CheckCircle, Info } from "lucide-react";
import { register, activateAccount } from "@/services/authService";
import "@/styles/auth/auth.css";
import "@/styles/auth/activation.css";
import logo from "@/assets/logo_entreprise.png";

const INITIAL_FORM = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  postTitle: null,
  confirmPassword: "",
  isClient: true,
};

const validateForm = (form) => {
  const errs = {};
  if (!form.firstname.trim()) errs.firstname = "Prénom requis";
  if (!form.lastname.trim()) errs.lastname = "Nom requis";
  if (!form.email.includes("@")) errs.email = "Email invalide";
  if (form.password.length < 6) errs.password = "Minimum 6 caractères";
  if (form.password !== form.confirmPassword)
    errs.confirmPassword = "Les mots de passe ne correspondent pas";
  return errs;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // "form" | "activation" | "success"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
    setApiError("");
  };
  const handleRegister = async () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      await register({ ...form, isAdmin: false });
      setStep("activation");
    } catch (err) {
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;

      if (status === 409 || serverMsg?.toLowerCase().includes("email already exists")) {
        setErrors((prev) => ({ ...prev, email: "Cette adresse email est déjà utilisée." }));
      } else {
        setApiError(serverMsg || "Erreur lors de l'inscription. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const updated = [...otp];
    updated[index] = value.replace(/[^0-9a-zA-Z]/g, "").slice(-1);
    setOtp(updated);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  const handleActivate = async () => {
    const token = otp.join("");
    if (token.length < 6) {
      setApiError("Veuillez entrer les 6 caractères du code.");
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      await activateAccount(token);
      setStep("success");
    } catch (err) {
      const serverError = err?.response?.data?.error || "";
      const serverDesc = err?.response?.data?.businessErrorDescription || "";
      const combined = (serverError + " " + serverDesc).toLowerCase();

      if (combined.includes("expired")) {
        setApiError("Code expiré — un nouveau code a été envoyé à votre email.");
      } else if (combined.includes("invalid")) {
        setApiError("Code incorrect. Vérifiez votre email et réessayez.");
      } else {
        setApiError(serverDesc || serverError || "Erreur lors de l'activation. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="left-logo-wrap">
          <         img src={logo.src} alt="SmartFlow" />

        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="form-card">

          {/* ── STEP: FORM ── */}
          {step === "form" && (
            <>
              <div className="form-card-header">
                <h1>Créer un compte</h1>
                <p>Gérez vos projets intelligemment avec SmartFlow</p>
              </div>

              {apiError && (
                <div className="alert alert-error">
                  <span className="alert-icon"><AlertCircle size={16} /></span>
                  <span>{apiError}</span>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstname">Prénom</label>
                  <div className="input-wrap">
                    <span className="input-icon"><User size={14} /></span>
                    <input
                      id="firstname"
                      type="text"
                      value={form.firstname}
                      onChange={handleChange("firstname")}
                      placeholder="Votre prénom"
                      className={`form-input${errors.firstname ? " has-error" : ""}`}
                    />
                  </div>
                  {errors.firstname && <p className="field-error">{errors.firstname}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastname">Nom</label>
                  <div className="input-wrap">
                    <span className="input-icon"><User size={14} /></span>
                    <input
                      id="lastname"
                      type="text"
                      value={form.lastname}
                      onChange={handleChange("lastname")}
                      placeholder="Votre nom"
                      className={`form-input${errors.lastname ? " has-error" : ""}`}
                    />
                  </div>
                  {errors.lastname && <p className="field-error">{errors.lastname}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <div className="input-wrap">
                  <span className="input-icon"><Mail size={14} /></span>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="votre@gmail.com"
                    className={`form-input${errors.email ? " has-error" : ""}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Mot de passe</label>
                <div className="input-wrap">
                  <span className="input-icon"><Lock size={14} /></span>
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange("password")}
                    placeholder="••••••••"
                    className={`form-input${errors.password ? " has-error" : ""}`}
                    autoComplete="new-password"
                  />
                </div>
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="input-wrap">
                  <span className="input-icon"><Lock size={14} /></span>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    placeholder="••••••••"
                    className={`form-input${errors.confirmPassword ? " has-error" : ""}`}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Inscription en cours…" : "Créer mon compte"}
              </button>

              <p className="auth-footer">
                Déjà un compte ? <a href="/login">Se connecter</a>
              </p>
            </>
          )}

          {/* ── STEP: OTP ACTIVATION ── */}
          {step === "activation" && (
            <>
              <div className="form-card-header">
                <h1>Vérification email</h1>
                <p>Un code à 6 chiffres vous a été envoyé</p>
              </div>

              {apiError && (
                <div className="alert alert-error">
                  <span className="alert-icon"><AlertCircle size={16} /></span>
                  <span>{apiError}</span>
                </div>
              )}

              <div className="activation-panel">
                <p className="activation-title">Vérifiez votre boîte mail</p>
                <p className="activation-desc">
                  Code envoyé à <span className="activation-email">{form.email}</span>
                </p>

                <div className="otp-wrap">
                  {otp.map((v, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      className="otp-input"
                      value={v}
                      maxLength={1}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      inputMode="numeric"
                    />
                  ))}
                </div>

                <div className="activation-btn-wrap">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleActivate}
                    disabled={loading}
                  >
                    {loading ? "Vérification…" : "Activer mon compte"}
                  </button>
                </div>
              </div>

              <p className="auth-footer">
                <button onClick={() => { setStep("form"); setApiError(""); }}>
                  ← Modifier mon email
                </button>
              </p>
            </>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === "success" && (
            <>
              <div className="alert alert-success">
                <span className="alert-icon"><CheckCircle size={16} /></span>
                <span>Compte activé avec succès !</span>
              </div>

              <div className="success-panel">
                <p className="success-title">Bienvenue sur SmartFlow !</p>
                <p className="success-desc">Votre compte est prêt. Vous pouvez maintenant vous connecter.</p>
                <div className="success-btn-wrap">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => router.push("/login")}
                  >
                    Accéder à mon espace
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}