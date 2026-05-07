'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

import ReportsSkeleton from '@/components/skeleton/admin/reports/reportsSkeleton'

const ReportsPage = dynamic(
  () => import('@/components/admin/reportsAdmin/ReportsPage'),
  { ssr: false }
)

export default function Page() {
  return (
    <Suspense fallback={<ReportsSkeleton />}>
      <ReportsPage />
    </Suspense>
  )
}
