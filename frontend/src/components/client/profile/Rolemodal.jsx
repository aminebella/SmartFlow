"use client";
import { useState } from "react";
import s from "@/styles/client/profile/profile.module.css";

// initialData shape expected: { postTitle, location }
// onSave receives the same shape back: { postTitle, location }
export default function RoleModal({ initialData, onSave, onClose }) {
  const [form, setForm] = useState({
    postTitle: initialData?.postTitle ?? "",
    location:  initialData?.location  ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);   // { postTitle, location }
    setSaving(false);
  };

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>Informations sur votre rôle</h2>
          <button className={s.modalClose} onClick={onClose}><XIcon /></button>
        </div>

        <div className={s.modalFields}>
          <Field
            label="Intitulé du poste"
            value={form.postTitle}
            onChange={set("postTitle")}
            placeholder="p. ex., stagiaire marketing, ingénieur logiciel"
            s={s}
          />
          <Field
            label="Emplacement"
            value={form.location}
            onChange={set("location")}
            placeholder="p. ex., Casablanca, Maroc"
            s={s}
          />
        </div>

        <div className={s.modalNote}>
          <span className={s.modalNoteIcon}><InfoIcon /></span>
          <span>
            Vous pouvez modifier la visibilité des détails de votre rôle dans les{" "}
            <span style={{ color: "var(--gold-dark)", fontWeight: 600 }}>Paramètres du compte</span>.
          </span>
        </div>

        <div className={s.modalFooter}>
          <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose} disabled={saving}>
            Annuler
          </button>
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, s }) {
  return (
    <div className={s.fieldGroup}>
      <label className={s.fieldLabel}>{label}</label>
      <input className={s.fieldInput} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
    </svg>
  );
}