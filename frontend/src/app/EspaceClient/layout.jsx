'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Loading from '@/app/loading';
import { useAuth } from '@/hooks/useAuth';


export default function ClientLayout({ children }) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const isClient = role === 'CLIENT';

      if (!isClient) {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.replace('/login');
        }
      }
    }
  }, [loading, role, router]);

  // While we're loading auth info, show the Loading component.
  if (loading) return <Loading />;

  // If auth check finished and user is not a client, don't render protected UI
  const isClient = role === 'CLIENT';
  if (!isClient) return <Loading />;

  return <>{children}</>;
}