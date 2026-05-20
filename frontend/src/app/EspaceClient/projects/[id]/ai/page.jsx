'use client';

import { useParams } from "next/navigation";
import { useRole } from "@/hooks/useRole";
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
  const { isManager } = useRole(projectId);

  const {
    loading, saving, error, saved,
    result, edited, fileName,
    analyzeDocument,
    updateEdited, updateTask, removeTask, addTask,
    updateSprint, removeSprint,
    updateRisk,
    updateResource,
    updateCost, updateBreakdownItem,
    updateTimeline, updatePhase,
    saveToDatabase, reset,
  } = useAiAnalysis(projectId);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9F8F5' }}>
      {!isManager ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a2030' }}>Accès Restreint</h2>
            <p className="text-slate-600 mb-4">Seuls les managers du projet peuvent accéder à l'analyse IA.</p>
            <a
              href={`/EspaceClient/projects/${projectId}/dashboard`}
              className="inline-block px-6 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
              style={{ backgroundColor: '#c9b479' }}
            >
              Retour au projet
            </a>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

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

        {!result && (
          <AiUploadZone
            onFileSelect={analyzeDocument}
            loading={loading}
            fileName={fileName}
          />
        )}

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

        {edited && (
          <>
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

            <AiMetrics edited={edited} />

            <div className="grid grid-cols-2 gap-5 mb-5" style={{ minHeight: '600px' }}>
              <AiSprints
                sprints={edited.sprints}
                onUpdateSprint={updateSprint}
                onRemoveSprint={removeSprint}
              />
              <AiTasks
                tasks={edited.tasks}
                onUpdateTask={updateTask}
                onRemoveTask={removeTask}
                onAddTask={addTask}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <AiRisks
                risks={edited.risks}
                onUpdateRisk={updateRisk}
              />
              <AiCost
                costEstimation={edited.costEstimation}
                onUpdateCost={updateCost}
                onUpdateBreakdownItem={updateBreakdownItem}
              />
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <AiTeam
                humanResources={edited.humanResources}
                onUpdateResource={updateResource}
              />
              <AiTimeline
                timeline={edited.timeline}
                confidenceScore={edited.confidenceScore}
                onUpdateTimeline={updateTimeline}
                onUpdatePhase={updatePhase}
              />
            </div>
          </>
        )}
        </div>
      )}
    </div>
  );
}