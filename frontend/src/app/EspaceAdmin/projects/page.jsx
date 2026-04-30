'use client'

import '@/styles/admin/projects/projectsAdmin.css'
import ProjectsPage from '@/components/admin/Projects/ProjectsPage'

export default function Page() {
  // The top-level page stays tiny: it only mounts the client component
  return <ProjectsPage role="ADMIN" />
}
