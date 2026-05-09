'use client';

import Link from 'next/link';
import styles from '@/styles/client/globalDashboard/DashboardTasks.module.css';

// Formats an ISO date string to a short French label
function dueLabel(dateStr) {
  if (!dateStr) return null;
  const due  = new Date(dateStr);
  const now  = new Date();
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diff < 0)  return { text: 'En retard', cls: 'overdue' };
  if (diff === 0) return { text: "Aujourd'hui", cls: 'today' };
  if (diff <= 7)  return { text: 'Cette sem.', cls: 'week' };
  return {
    text: due.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    cls: 'ok',
  };
}

/**
 * Displays a short list of TODO tasks + an "Add task" shortcut button.
 *
 * Props:
 *  tasks   – [{ title, projectName, due: ISO string | null }]
 *  loading – boolean
 *
 * NOTE: `due` (dueDate) must be included in your TaskResponse DTO.
 * If it isn't present yet, add `private LocalDate dueDate;` to TaskResponse
 * and map it in your task mapper. Without it the due label won't show.
 */
export default function DashboardTasks({ tasks = [], loading }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Tâches à faire</h3>
      </div>

      {loading ? (
        <div className={styles.empty}>Chargement…</div>
      ) : tasks.length === 0 ? (
        <div className={styles.empty}>Aucune tâche en attente 🎉</div>
      ) : (
        <div className={styles.list}>
          {tasks.map((t, i) => {
            const due = dueLabel(t.dueDate);
            return (
              <Link key={i} href={`/EspaceClient/projects/${t.projectId}/tasks`} className={styles.item}>
                <div className={`${styles.dot} ${due ? styles[`dot_${due.cls}`] : styles.dot_ok}`} />
                <div className={styles.body}>
                  <span className={styles.taskTitle}>{t.title}</span>
                  <span className={styles.proj}>{t.projectName}</span>
                </div>
                {due && (
                  <span className={`${styles.due} ${styles[`due_${due.cls}`]}`}>
                    {due.text}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
