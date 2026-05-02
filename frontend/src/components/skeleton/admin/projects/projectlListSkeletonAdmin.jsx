"use client";

import React from "react";

// Lightweight skeleton while admin projects list is loading
export default function ProjectlListSkeletonAdmin() {
  const rows = new Array(6).fill(0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-6 w-48 bg-slate-200/80 animate-pulse rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((_, i) => (
          <div key={i} className="p-4 bg-white/50 rounded-lg shadow-sm">
            <div className="h-4 w-3/4 bg-slate-200/80 animate-pulse rounded mb-3"></div>
            <div className="h-3 w-1/2 bg-slate-200/80 animate-pulse rounded mb-4"></div>

            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-200/80 animate-pulse rounded"></div>
              <div className="h-3 w-full bg-slate-200/80 animate-pulse rounded"></div>
              <div className="h-3 w-5/6 bg-slate-200/80 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
