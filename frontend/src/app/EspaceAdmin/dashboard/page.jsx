// app/EspaceAdmin/dashboard/page.jsx
import { Suspense } from 'react';
import StatsWidget from '@/components/dashBordAdmin/stats/StatsWidget';
import StatsSkeleton from '@/components/skeleton/StatsSkeleton';

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