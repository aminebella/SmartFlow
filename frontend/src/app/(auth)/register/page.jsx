"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { register, activateAccount } from "@/services/authService";
import "@/styles/auth.css";
import "@/styles/activation.css";

const INITIAL_FORM = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  bio: "",
  confirmPassword: "",
  isClient: true,
};

const validateForm = (form) => {
  const errs = {};
  if (!form.firstname.trim()) errs.firstname = "Prénom requis";
  if (!form.lastname.trim()) errs.lastname = "Nom requis";
  if (!form.email.includes("@")) errs.email = "Email invalide";
  if (form.password.length < 6) errs.password = "Min. 6 caractères";
  if (form.password !== form.confirmPassword) errs.confirmPassword = "Les mots de passe ne correspondent pas";
  return errs;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleRegister = async () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register({ ...form, isAdmin: false });
      setStep("activation");
    } catch (err) {
      setError(err?.response?.data?.message || "Erreur lors de l'inscription");
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

  const handleActivate = async () => {
    const token = otp.join("");
    if (token.length < 6) {
      setError("Entrez les 6 chiffres du code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await activateAccount(token);
      setStep("success");
    } catch (err) {
      setError(err?.response?.data?.message || "Code invalide ou expiré. Un nouveau code a été envoyé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="logo-area">
          <div className="logo-icon">S</div>
          <div className="logo-text">Smart<span>Flow</span></div>
        </div>

        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">Gérez vos projets intelligemment</p>

        {error && <div className="api-error">{error}</div>}

        {step === "form" && (
          <>
            <div className="form-row">
              <Input label="Prénom" id="firstname" value={form.firstname} onChange={handleChange("firstname")} error={errors.firstname} placeholder="Fatima" />
              <Input label="Nom" id="lastname" value={form.lastname} onChange={handleChange("lastname")} error={errors.lastname} placeholder="Dihi" />
            </div>
            <Input label="Email" id="email" type="email" value={form.email} onChange={handleChange("email")} error={errors.email} placeholder="fatima@smartflow.com" />
            <Input label="Mot de passe" id="password" type="password" value={form.password} onChange={handleChange("password")} error={errors.password} placeholder="••••••••" />
            <Input label="Confirmer" id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange("confirmPassword")} error={errors.confirmPassword} placeholder="••••••••" />
            <Button label="S'inscrire" onClick={handleRegister} loading={loading} />
          </>
        )}

        {step === "activation" && (
          <div className="activation-panel">
            <div className="activation-icon">✉</div>
            <p className="activation-title">Vérifiez votre email</p>
            <p className="activation-desc">Code envoyé à <span className="activation-email">{form.email}</span></p>
            <div className="otp-wrap">
              {otp.map((v, i) => (
                <input key={i} id={`otp-${i}`} className="otp-input" value={v} maxLength={1} onChange={(e) => handleOtpChange(i, e.target.value)} />
              ))}
            </div>
            {error && <span className="otp-error">{error}</span>}
            <div className="activation-btn-wrap">
              <Button label="Activer mon compte" onClick={handleActivate} loading={loading} />
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="success-panel">
            <div className="success-icon">✓</div>
            <p className="success-title">Compte activé avec succès !</p>
            <p className="success-desc">Vous pouvez maintenant vous connecter</p>
            <div className="success-btn-wrap">
              <Button label="Se connecter" onClick={() => router.push("/login")} />
            </div>
          </div>
        )}

        <p className="auth-link-text">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </div>

      <div className="register-right">
        <div>
          <h2 className="right-title">Gérez vos projets<br />avec <span>intelligence</span></h2>
          <p className="right-subtitle">Rejoignez SmartFlow et transformez la façon dont votre équipe collabore.</p>
        </div>
      </div>
    </div>
  );
}