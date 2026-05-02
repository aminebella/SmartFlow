'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/ui/notFound.module.css';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.replace('/');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>Page Not Found</p>
      <p className={styles.text}>
        The page you're looking for doesn't exist or was moved.
      </p>

      <p className={styles.redirect}>
        Redirecting in <strong>3 seconds...</strong>
      </p>

      <div className={styles.actions}>
        <button onClick={() => router.back()} className={styles.button}>
          Go Back
        </button>

        <button onClick={() => router.replace('/')} className={styles.buttonOutline}>
          Go Home
        </button>
      </div>
    </div>
  );
}