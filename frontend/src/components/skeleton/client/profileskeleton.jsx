"use client";
import s from "@/styles/client/profile/profile.module.css";
export default function ProfileSkeleton() {
  return (
    <div className={s.page}>
      <div className={s.skelCover} />
      <div className={s.headerSection}>
        <div className={s.avatarRow}>
          <div className={`${s.skel} ${s.skelAvatar}`} />
          <div style={{ flex:1, paddingBottom:4, display:"flex", flexDirection:"column", gap:8 }}>
            <div className={`${s.skel} ${s.skelName}`} />
            <div className={`${s.skel} ${s.skelSub}`} />
          </div>
        </div>
      </div>
      <div className={s.actionBar}>
        <div className={s.skel} style={{ width:140, height:38, borderRadius:8 }} />
      </div>
      <div className={s.main}>
        <SkeletonCard fields={6} />
        <SkeletonCard fields={1} full />
      </div>
    </div>
  );
}

function SkeletonCard({ fields, full }) {
  return (
    <div className={s.skelCard}>
      <div className={`${s.skel} ${s.skelTitle}`} />
      <div className={s.skelGrid}>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className={s.skelField} style={full ? { gridColumn:"1 / -1" } : {}}>
            <div className={`${s.skel} ${s.skelLbl}`} />
            <div className={`${s.skel} ${s.skelVal}`} />
          </div>
        ))}
      </div>
    </div>
  );
}