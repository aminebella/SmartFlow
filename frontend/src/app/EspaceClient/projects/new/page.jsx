'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

// Dynamic import for better performance
const CreateProjectPage = dynamic(
  () => import('@/components/client/projectsClient/CreateProjectPage'),
  { 
    loading: () => <Loading />,
    ssr: false 
  }
);

export default function NewProjectPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CreateProjectPage />
    </Suspense>
  );
}
