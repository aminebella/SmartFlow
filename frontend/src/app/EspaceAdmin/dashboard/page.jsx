import { Suspense } from 'react';

import StatsSkeleton          from '@/components/skeleton/admin/dashboard/StatsSkeleton';
import StatsWidget            from '@/components/admin/dashBordAdmin/StatsWidget';

import ActivityChartSkeleton  from '@/components/skeleton/admin/dashboard/ActivityChartSkeleton';
import ActivityChart          from '@/components/admin/dashBordAdmin/ActivityChart';

import StatusDonutSkeleton    from '@/components/skeleton/admin/dashboard/StatusDonutSkeleton';
import StatusDonut            from '@/components/admin/dashBordAdmin/StatusDonut';

import RecentProjectsSkeleton from '@/components/skeleton/admin/dashboard/RecentProjectsSkeleton';
import RecentProjects         from '@/components/admin/dashBordAdmin/RecentProjects';

import styles from '@/styles/admin/dashboard/DashboardPage.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Tableau de bord</h2>

      {/* ── Row 1 : 4 stat cards ── */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsWidget />
      </Suspense>

      {/* ── Row 2 : Activity chart (2/3) + Status donut (1/3) ── */}
      <div className={styles.row2}>
        <div className={styles.chartCol}>
          <Suspense fallback={<ActivityChartSkeleton />}>
            <ActivityChart />
          </Suspense>
        </div>
        <div className={styles.donutCol}>
          <Suspense fallback={<StatusDonutSkeleton />}>
            <StatusDonut />
          </Suspense>
        </div>
      </div>

      {/* ── Row 3 : Recent projects full-width ── */}
      <Suspense fallback={<RecentProjectsSkeleton />}>
        <RecentProjects />
      </Suspense>
    </div>
  );
}