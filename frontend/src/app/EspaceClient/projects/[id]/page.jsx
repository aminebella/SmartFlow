"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDashboard() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Vue du projet</h2>
        <p className="text-sm text-slate-500 mb-4">Détails résumé du projet {id}. Ici vous pourrez ajouter les cartes de stats, la timeline et description.</p>

        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/EspaceClient/projects/${id}/tickets`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Voir les tickets
          </button>
          <button onClick={() => router.push(`/EspaceClient/projects/${id}/board`)}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200">
            Aller au board
          </button>
        </div>
      </div>
    </div>
  );
}
