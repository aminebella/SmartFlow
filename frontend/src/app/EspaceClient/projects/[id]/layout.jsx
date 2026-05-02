"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import TopNavbar from "@/components/client/layoutClient/TopNavbar";


// This layout fetches the project and makes the projectRole available
// Manager sees everything; member sees read-only backlog/board
// The pages inside check: if (projectRole !== 'MANAGER') show read-only view
export default function ProjectLayout({ children }) {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Global top navbar (existing) */}
      <TopNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Project header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Project {id}</h1>
            <p className="text-sm text-slate-500">Vue du projet — dashboard & navigation</p>
          </div>
        </div>

        {/* Project nav (shared between sub-pages) */}
        <div className="mb-6">
          <nav className="inline-flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-100">
            <Link href={`/EspaceClient/projects/${id}`} className="px-4 py-2 text-sm rounded-md font-medium">
              Dashboard
            </Link>
            <Link href={`/EspaceClient/projects/${id}/tickets`} className="px-4 py-2 text-sm rounded-md font-medium">
              Tickets
            </Link>
            <Link href={`/EspaceClient/projects/${id}/board`} className="px-4 py-2 text-sm rounded-md font-medium">
              Board
            </Link>
            <Link href={`/EspaceClient/projects/${id}/sprints`} className="px-4 py-2 text-sm rounded-md font-medium">
              Sprints
            </Link>
            <Link href={`/EspaceClient/projects/${id}/ia`} className="px-4 py-2 text-sm rounded-md font-medium">
              IA
            </Link>
          </nav>
        </div>

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
// ← loads project, checks project role

