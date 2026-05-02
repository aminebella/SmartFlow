// For Dashboard
"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/client/globalDashboard/ProjectPreview.module.css';

export default function ProjectPreview({ project }) {
  const name = project.name || '';
  const words = name.split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
  const description = project.description || '';

  const fakeMembers = [
    { fullName: 'Alice Johnson' },
    { fullName: 'Karim El Amrani' },
    { fullName: 'Sofia Benali' },
    { fullName: 'John Doe' },
    { fullName: 'Fatima Zahra' },
  ];

  const members = project.members?.length > 0 ? project.members : fakeMembers;
  const visibleMembers = members.slice(0, 3);
  const extraCount = Math.max(0, members.length - visibleMembers.length);

  return (
    <div className={styles.item}>
      <div className={styles.avatarWrap}>
        <div className={styles.projectPlaceholder}>{initials || '?'}</div>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.projectName}>{project.name}</p>
        <p className={styles.projectDesc}>{description}</p>

        <div className={styles.cardFooter}>
          <div className={styles.memberStack}>
            {visibleMembers.map((m, i) => (
              <div
                key={i}
                className={styles.memberAvatar}
                title={m.fullName || m.email || `Member ${i + 1}`}
              >
                {m.avatar ? (
                  <Image
                    src={m.avatar}
                    alt={m.fullName || 'Member'}
                    width={24}
                    height={24}
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <div className={styles.memberPlaceholder}>
                    {(m.fullName || m.email || 'U').charAt(0)}
                  </div>
                )}
              </div>
            ))}
            {extraCount > 0 && (
              <div className={styles.memberExtra}>+{extraCount}</div>
            )}
          </div>

          <Link href={`/EspaceClient/projects/${project.id}`} className={styles.openBtn}>
            Ouvrir
          </Link>
        </div>
      </div>
    </div>
  );
}