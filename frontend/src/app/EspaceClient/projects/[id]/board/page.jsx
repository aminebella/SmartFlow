// ← kanban (manager: move all, member: move own)

'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function EspaceClientProjectBoard() {
  return (
    <div>
      <div className="min-h-screen" style={{ backgroundColor: "#F9F8F5" }}>
        <h1>Project Board</h1>
        <p>This is the project board page.</p>
      </div>
    </div>
  );
}