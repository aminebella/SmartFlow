// ← sprint management (manager only writes)

'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function EspaceClientProjectSprints() {

  return (
    <div className="min-h-screen bg-slate-50">
        <div>
          <h1>Project Sprints</h1>
          <p>This is the project sprints page.</p>
        </div>
    </div>
  );
}