"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import s from "@/styles/client/profile/profile.module.css";
import ProfileSkeleton from "@/components/skeleton/client/profileskeleton";
import ProfileInfoCard from "@/components/client/profile/profileInfoCard";
import RoleModal       from "@/components/client/profile/RoleModal";
import { getClientProfile, updateClientProfile } from "@/services/usersService";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

const imgUrl = (path) => {
  if (!path) return null;
  if (typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  // S'assurer qu'il y a un seul slash entre BASE_URL et le path
  return `${BASE_URL}/${trimmed.replace(/^\//, "")}`;
};

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const userId = currentUser?.id;

  // 🔍 DEBUG — retire ces logs une fois le problème résolu
  console.log("currentUser:", currentUser);
  console.log("userId:", userId);

  const [profile,              setProfile]              = useState(null);
  const [form,                 setForm]                 = useState({});
  const [avatarFile,           setAvatarFile]           = useState(null);
  const [avatarPreview,        setAvatarPreview]        = useState(null);
  const [coverFile,            setCoverFile]            = useState(null);
  const [coverPreview,         setCoverPreview]         = useState(null);
  const [isEditing,            setIsEditing]            = useState(false);
  const [showModal,            setShowModal]            = useState(false);
  const [loading,              setLoading]              = useState(true);
  const [saving,               setSaving]               = useState(false);
  const [toast,                setToast]                = useState(null);

  const avatarRef = useRef(null);
  const coverRef  = useRef(null);

  /* ── Load profile ──────────────────────────────────────── */
  useEffect(() => {
    if (!userId) {
      // userId not yet available — keep waiting if currentUser is still null,
      // but stop skeleton if user is loaded and genuinely has no id
      if (currentUser !== undefined && currentUser !== null) {
        console.error("useAuth returned a user without an id:", currentUser);
        setLoading(false);
      }
      return;
    }
    getClientProfile(userId)
      .then((data) => {
        // 🔍 DEBUG — vérifie ce que l'API retourne exactement
        console.log("✅ Profile chargé:", data);
        console.log("📸 coverPicture:", data?.coverPicture);
        console.log("🖼️ profilePicture:", data?.profilePicture);
        console.log("🌐 BASE_URL:", BASE_URL);
        console.log("🔗 coverSrc calculé:", imgUrl(data?.coverPicture));
        setProfile(data); setForm(data);
      })
      .catch((err) => {
        console.error("Erreur getClientProfile:", err);
        showToast("error", "Impossible de charger le profil.");
      })
      .finally(() => setLoading(false));
  }, [userId, currentUser]);

  /* ── Helpers ───────────────────────────────────────────── */
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // API returns `fullName` — derive initials from it
  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  /* ── Avatar handlers ───────────────────────────────────── */
  const handleAvatarClick  = () => { if (isEditing) avatarRef.current?.click(); };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ── Cover handlers ────────────────────────────────────── */
  const handleCoverClick  = () => { if (isEditing) coverRef.current?.click(); };
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  /* ── Edit / Cancel ─────────────────────────────────────── */
  const handleEdit = () => {
    setForm(profile);
    setAvatarFile(null);
    setAvatarPreview(null);
    setCoverFile(null);
    setCoverPreview(null);
    setIsEditing(true);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const handleFieldChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  /* ── Save profile ──────────────────────────────────────── */
  const handleSave = async () => {
    setSaving(true);
    try {
      // Only send fields the API accepts: fullName, postTitle, location
      const fields = {
        fullName:  form.fullName  ?? "",
        postTitle: form.postTitle ?? "",
        location:  form.location  ?? "",
      };
      const updated = await updateClientProfile(userId, fields, avatarFile, coverFile);
      setProfile(updated);
      setForm(updated);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setCoverFile(null);
      setCoverPreview(null);
      showToast("success", "Profil mis à jour avec succès !");
    } catch {
      showToast("error", "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Save role (from RoleModal) ────────────────────────── */
  const handleRoleSave = async (roleData) => {
    // roleData = { postTitle, location }
    try {
      const fields = {
        fullName:  profile.fullName  ?? "",
        postTitle: roleData.postTitle ?? "",
        location:  roleData.location  ?? "",
      };
      const updated = await updateClientProfile(userId, fields, null, null);
      setProfile(updated);
      setForm(updated);
      setShowModal(false);
      showToast("success", "Informations de rôle mises à jour !");
    } catch {
      showToast("error", "Impossible de sauvegarder le rôle.");
    }
  };

  if (loading) return <ProfileSkeleton />;

  // Use API field names consistently
  const avatarSrc = avatarPreview || imgUrl(profile?.profilePicture);
  // Cache-busting : ajoute un timestamp pour éviter que le navigateur serve une version cachée
  const rawCoverSrc = coverPreview || imgUrl(profile?.coverPicture);
  const coverSrc = rawCoverSrc
    ? (coverPreview ? rawCoverSrc : `${rawCoverSrc}?t=${profile?.updatedAt || Date.now()}`)
    : null;
  const hasRole   = profile?.postTitle || profile?.location;

  return (
    <div className={s.page}>
      {/* Cover */}
      <div
        className={s.cover}
        style={coverSrc ? {
          backgroundImage: `url(${coverSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        } : {}}
        onClick={handleCoverClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCoverClick(); }}
        role="button"
        tabIndex={isEditing ? 0 : -1}
        aria-label={isEditing ? "Changer la couverture" : undefined}
        title={coverSrc ? "" : "Aucune image de couverture"}
      >
        {/* DEBUG — retire après résolution */}
        {process.env.NODE_ENV === "development" && coverSrc && (
          <img
            src={coverSrc}
            alt=""
            style={{ display: "none" }}
            onError={() => console.error("❌ Cover image failed to load:", coverSrc)}
            onLoad={() => console.log("✅ Cover image loaded:", coverSrc)}
          />
        )}
        {isEditing && (
          <button className={s.coverEditBtn} onClick={handleCoverClick} title="Changer la couverture">
            <CameraIcon /> Changer la couverture
          </button>
        )}
        <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCoverChange} />
      </div>

      <div className={s.headerSection}>
        <div className={s.avatarRow}>
          {/* Avatar */}
          <div className={s.avatarWrap}>
            <div
              className={s.avatarCircle}
              onClick={handleAvatarClick}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleAvatarClick(); }}
              role="button"
              tabIndex={isEditing ? 0 : -1}
              aria-label={isEditing ? "Changer la photo de profil" : undefined}
              style={{ cursor: isEditing ? "pointer" : "default" }}
            >
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" className={s.avatarImg} />
                : <span className={s.avatarInitials}>{initials}</span>}
            </div>
            {isEditing && (
              <button className={s.avatarEditBtn} onClick={handleAvatarClick} title="Changer la photo">
                <CameraIcon />
              </button>
            )}
            <input ref={avatarRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
          </div>

          {/* Name / email / role */}
          <div className={s.nameBlock}>
  <div className={s.nameRow}>
    <h1 className={s.profileName}>
      {profile?.fullName || "—"}
    </h1>

    <p className={s.profileEmail}>
      {profile?.email || "—"}
    </p>
  </div>

  {hasRole && (
    <span className={s.profileRole}>
      <BriefcaseIcon />
      {[profile.postTitle, profile.location].filter(Boolean).join(" · ")}
    </span>
  )}
</div>
        </div>

        {/* Role button — hidden while editing */}
        {!isEditing && (
          <button
            className={s.btn}
            style={{
              background: "transparent",
              color: "var(--gold-dark)",
              border: "1.5px solid var(--gold-warm)",
              marginBottom: 16,
              fontSize: "0.83rem",
            }}
            onClick={() => setShowModal(true)}
          >
            <PlusIcon />
            {hasRole ? "Modifier les informations du rôle" : "Ajouter les informations du rôle"}
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={s.toastWrap}>
          <div className={`${s.toast} ${toast.type === "error" ? s.toastError : s.toastSuccess}`}>
            {toast.type === "error" ? <ErrorIcon /> : <CheckIcon />}
            {toast.msg}
          </div>
        </div>
      )}

      {/* Action bar */}
      <div className={s.actionBar}>
        <a href="/EspaceClient/dashboard" className={s.backBtn} title="Retour au dashboard">
          <BackArrowIcon />
        </a>
        {!isEditing ? (
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={handleEdit}>
            <EditIcon /> Modifier le profil
          </button>
        ) : (
          <>
            <button className={`${s.btn} ${s.btnGhost}`} onClick={handleCancel} disabled={saving}>
              Annuler
            </button>
            <button className={`${s.btn} ${s.btnPrimary}`} onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </>
        )}
      </div>

      {/* Info card */}
      <div className={s.main}>
        <ProfileInfoCard form={form} isEditing={isEditing} onChange={handleFieldChange} />
      </div>

      {/* Role modal */}
      {showModal && (
        <RoleModal
          initialData={{ postTitle: profile?.postTitle, location: profile?.location }}
          onSave={handleRoleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────── */
function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}
function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function ErrorIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
}