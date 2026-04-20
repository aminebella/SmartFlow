// // ← checks role=ADMIN, redirects if not

// 'use client';
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { getTokenPayload } from '@/lib/auth';

// export default function AdminLayout({ children }) {
//   const router = useRouter();

//   useEffect(() => {
//     const user = getTokenPayload();
//     if (!user || !user.authorities?.includes('ADMIN')) {
//       router.replace('/login');
//     }
//   }, []);

//   return <>{children}</>;
// }