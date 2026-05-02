'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

import ProjectlListSkeletonAdmin from '@/components/skeleton/admin/projects/projectlListSkeletonAdmin'

import '@/styles/admin/projects/projectsListAdmin.css'


// Dynamically import the heavy client ProjectsPage to allow the skeleton to show
const ProjectsPage = dynamic(
  () => import('@/components/admin/projectsAdmin/projectsListAdmin/ProjectsPage'),
  { ssr: false }
)

export default function Page() {
  // Render skeleton while the ProjectsPage component is loading
  return (
    <Suspense fallback={<ProjectlListSkeletonAdmin />}>
      <ProjectsPage role="ADMIN" />
    </Suspense>
  )
}