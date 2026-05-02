"use client";

import React from "react";

export default function ProjectDetailsSkeletonAdmin() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-1/2 bg-slate-200/80 animate-pulse rounded-md"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-3/4 bg-slate-200/80 animate-pulse rounded"></div>
          <div className="h-48 bg-slate-200/80 animate-pulse rounded"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-200/80 animate-pulse rounded"></div>
            <div className="h-3 w-full bg-slate-200/80 animate-pulse rounded"></div>
            <div className="h-3 w-5/6 bg-slate-200/80 animate-pulse rounded"></div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="h-6 w-2/3 bg-slate-200/80 animate-pulse rounded"></div>
          <div className="h-24 bg-slate-200/80 animate-pulse rounded"></div>
          <div className="h-10 bg-slate-200/80 animate-pulse rounded"></div>
        </aside>
      </div>
    </div>
  );
}
