"use client";
import s from "@/styles/client/profile/profile.module.css";

// Fields aligned with the API response shape:
// { id, fullName, email, postTitle, profilePicture, coverPicture, location, ... }
const FIELDS = [
  { key: "fullName",  label: "Nom complet", type: "text"  },
  { key: "email",     label: "Email",       type: "email", disabled: true },
  { key: "postTitle", label: "Poste",       type: "text"  },
  { key: "location",  label: "Localisation",type: "text"  },
];

export default function ProfileInfoCard({ form, isEditing, onChange }) {
  return (
    <div className={s.card}>
      <p className={s.cardTitle}>
        <span className={s.cardDot} />
        Informations personnelles
      </p>

      <div className={s.fieldsGrid}>
        {FIELDS.map(({ key, label, type, disabled }) => (
          <div className={s.fieldGroup} key={key}>
            <span className={s.fieldLabel}>{label}</span>
            {isEditing && !disabled ? (
              <input
                className={s.fieldInput}
                type={type}
                value={form[key] ?? ""}
                onChange={(e) => onChange(key, e.target.value)}
                placeholder={label}
              />
            ) : (
              <p className={s.fieldValue}>
                {form[key] || <span className={s.fieldEmpty}>—</span>}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}