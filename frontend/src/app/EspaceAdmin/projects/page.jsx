'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

import ProjectlListSkeletonAdmin from '@/components/skeleton/admin/projects/projectlListSkeletonAdmin'


const ProjectsPage = dynamic(
  () => import('@/components/admin/projectsAdmin/projectsListAdmin/ProjectsPage'),
  { ssr: false }
)

export default function Page() {
  return (
    <Suspense fallback={<ProjectlListSkeletonAdmin />}>
      <ProjectsPage role="ADMIN" />
    </Suspense>
  )
}
