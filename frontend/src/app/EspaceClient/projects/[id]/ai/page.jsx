'use client';

import { useState, useRef } from "react";
import { useParams } from "next/navigation"; 
import { useAiAnalysis } from "@/hooks/useAiAnalysis.js";
import AiUploadZone   from "@/components/client/ai/AiAnalysisUpload.jsx";
import AiMetrics      from "@/components/client/ai/AiAnalysisMetrics.jsx";
import AiSprints      from "@/components/client/ai/AiAnalysisSprints.jsx";
import AiTasks        from "@/components/client/ai/AiAnalysisTasks.jsx";
import AiRisks        from "@/components/client/ai/AiAnalysisRisks.jsx";
import AiCost         from "@/components/client/ai/AiAnalysisCost.jsx";
import AiTeam         from "@/components/client/ai/AiAnalysisTeam.jsx";
import AiTimeline     from "@/components/client/ai/AiAnalysisTimeline.jsx";
export default function AiAnalysisPage() {
  const { id: projectId } = useParams();

  const {
    loading, saving, error, saved,
    result, edited, fileName,
    analyzeDocument,
    updateEdited, updateTask, removeTask, addTask,
    saveToDatabase, reset,
  } = useAiAnalysis(projectId);

  const handleFileSelect = (file) => {
    analyzeDocument(file);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F8F5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ══ Header ══════════════════════════════════════════════ */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">AI Analysis</h1>
              <span className="text-white text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#c9b479' }}>New</span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Powered by Gemini — Upload your cahier des charges
            </p>
          </div>

          {/* Boutons action */}
          {edited && !saved && (
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 text-sm font-medium rounded-lg border transition hover:opacity-80"
                style={{ color: '#a08c4a', borderColor: '#e2d5a0' }}
              >
                Recommencer
              </button>
              <button
                onClick={saveToDatabase}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: '#c9b479' }}
              >
                {saving ? "Sauvegarde..." : "✓ Valider & Sauvegarder"}
              </button>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#f3edd6', border: '1px solid #e2d5a0' }}>
              <span className="text-sm font-medium" style={{ color: '#c9b479' }}>
                ✓ Sauvegardé avec succès
              </span>
            </div>
          )}
        </div>

        {/* ══ Upload Zone ══════════════════════════════════════════ */}
        {!result && (
          <AiUploadZone
            onFileSelect={handleFileSelect}
            loading={loading}
            fileName={fileName}
          />
        )}

        {/* ══ Erreur ═══════════════════════════════════════════════ */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg mb-6"
            style={{ backgroundColor: '#fdf0ec', border: '1px solid #f0c4b0' }}>
            <span className="text-sm" style={{ color: '#c47a5a' }}>⚠️ {error}</span>
            <button onClick={reset} className="text-sm underline ml-auto"
              style={{ color: '#c47a5a' }}>
              Réessayer
            </button>
          </div>
        )}

        {/* ══ Résultats ════════════════════════════════════════════ */}
        {edited && (
          <>
            {/* Bannière preview */}
            {!saved && (
              <div className="flex items-center justify-between p-3 rounded-lg mb-6"
                style={{ backgroundColor: '#faf3e0', border: '1px solid #c9b479' }}>
                <p className="text-sm" style={{ color: '#a08c4a' }}>
                  📋 Résultats en mode <strong>prévisualisation</strong> — 
                  Vérifiez et modifiez avant de valider
                </p>
                <button
                  onClick={saveToDatabase}
                  disabled={saving}
                  className="px-3 py-1.5 text-sm font-medium text-white rounded-lg hover:opacity-90 transition"
                  style={{ backgroundColor: '#c9b479' }}
                >
                  {saving ? "..." : "Valider & Sauvegarder"}
                </button>
              </div>
            )}

            {/* Project Summary */}
            {edited.projectSummary && (
              <div className="bg-white rounded-xl p-5 mb-5"
                style={{ border: '1px solid #e8e0cc' }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: '#a08c4a' }}>Résumé du projet</p>
                <textarea
                  value={edited.projectSummary}
                  onChange={(e) => updateEdited('projectSummary', e.target.value)}
                  rows={3}
                  className="w-full text-sm text-slate-700 resize-none focus:outline-none"
                  style={{ border: 'none', background: 'transparent' }}
                />
              </div>
            )}

            {/* Métriques */}
            <AiMetrics edited={edited} />

            {/* Grille principale */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <AiSprints sprints={edited.sprints} />
              <AiTasks
                tasks={edited.tasks}
                onUpdateTask={updateTask}
                onRemoveTask={removeTask}
                onAddTask={addTask}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <AiRisks risks={edited.risks} />
              <AiCost costEstimation={edited.costEstimation} />
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <AiTeam humanResources={edited.humanResources} />
              <AiTimeline
                timeline={edited.timeline}
                confidenceScore={edited.confidenceScore}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}