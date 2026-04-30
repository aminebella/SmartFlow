'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/authService';

export default function ClientLayout({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user || !user.roles?.includes('CLIENT')) {
        router.replace('/login');
      } else {
        setReady(true);
      }
    });
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}