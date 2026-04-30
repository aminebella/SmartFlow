'use client'

import '@/styles/admin/projects/projectDetailsAdmin.css'
import ProjectDetails from '@/components/admin/Projects/ProjectDetails'

export default function Page({ params }) {
	const { id } = params
	return <ProjectDetails projectId={Number(id)} />
}