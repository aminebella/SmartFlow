import { Suspense } from 'react';

import StatsSkeleton from '@/components/skeleton/admin/dashboard/StatsSkeleton';
import StatsWidget from '@/components/admin/dashBordAdmin/stats/StatsWidget';

export default function DashboardPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Bienvenue sur le Dashboard</h2>
      
      {/* Suspense prend le relais pour charger le Widget */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsWidget />
      </Suspense>
    </div>
  );
}