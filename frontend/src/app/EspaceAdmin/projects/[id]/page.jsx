'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

import ProjectDetailsSkeletonAdmin from '@/components/skeleton/admin/projects/projectDetailsSkeletonAdmin'

import '@/styles/admin/projects/projectDetailsAdmin.css'


const ProjectDetails = dynamic(
	() => import('@/components/admin/projectsAdmin/projectDetailsAdmin/ProjectDetails'),
	{ ssr: false }
)

export default function Page({ params }) {
	const { id } = params
	return (
		<Suspense fallback={<ProjectDetailsSkeletonAdmin />}>
			<ProjectDetails projectId={Number(id)} />
		</Suspense>
	)
}