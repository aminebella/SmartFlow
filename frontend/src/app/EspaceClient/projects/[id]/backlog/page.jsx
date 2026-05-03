// // ← tickets list (manager: full control, member: view)

// // No separate page per role — one page, conditional UI
// {projectRole === 'MANAGER' && (
//   <button onClick={openCreateTicketModal}>+ New Ticket</button>
// )}
// // Member sees the list but not the button — clean and simple

'use client';

import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function EspaceClientProjectBacklog() {

  return (
    <div className="min-h-screen bg-slate-50">
        <div>
          <h1>Project Backlog</h1>
          <p>This is the project backlog page.</p>
        </div>
    </div>
  );
}