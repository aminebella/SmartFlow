// ← CDC upload (manager only — guard in layout)
'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function EspaceClientProjectIA() {

  return (
    <div className="min-h-screen bg-slate-50">
        <div>
          <h1>Project AI Analysis</h1>
          <p>This is the project AI analysis page.</p>
        </div>
    </div>
  );
}