'use client';
import { useState } from "react";

export function useAiAnalysis(projectId) {

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [edited, setEdited] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [saved, setSaved] = useState(false);

  // ── Analyse document ─────────────────────────────
  const analyzeDocument = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setEdited(null);
    setSaved(false);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKENDSPRINGBOOT_URL}/projects/${projectId}/ai-analysis/analyze`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error: ${response.status} - ${errText}`);
      }

      const parsed = await response.json();

      // ✅ Sécuriser toutes les données
      const safeData = {
        projectSummary: parsed.projectSummary || "",
        documentQuality: parsed.documentQuality || "LOW",
        confidenceScore: parsed.confidenceScore || "LOW",
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
        risks: Array.isArray(parsed.risks) ? parsed.risks : [],
        humanResources: Array.isArray(parsed.humanResources) ? parsed.humanResources : [],
        materialResources: Array.isArray(parsed.materialResources) ? parsed.materialResources : [],
        timeline: parsed.timeline || {
          startDate: null,
          endDate: null,
          phases: [],
          justification: ""
        },
        costEstimation: parsed.costEstimation || {
          estimatedTotalCost: null,
          currency: "MAD",
          breakdown: [],
          assumptions: ""
        },
      };

      setResult(safeData);
      setEdited(safeData);   // ✅ edited = true → boutons apparaissent

    } catch (err) {
      setError(err.message || "Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  // ── Modification ─────────────────────────────
  const updateEdited = (field, value) => {
    setEdited(prev => ({ ...prev, [field]: value }));
  };

  const updateTask = (index, field, value) => {
    setEdited(prev => {
      const tasks = [...(prev?.tasks || [])];
      if (!tasks[index]) return prev;
      tasks[index] = { ...tasks[index], [field]: value };
      return { ...prev, tasks };
    });
  };

  const removeTask = (index) => {
    setEdited(prev => ({
      ...prev,
      tasks: (prev?.tasks || []).filter((_, i) => i !== index)
    }));
  };

  const addTask = () => {
    setEdited(prev => ({
      ...prev,
      tasks: [
        ...(prev?.tasks || []),
        {
          title: "",
          description: "",
          priority: "MEDIUM",
          estimatedComplexity: "MEDIUM",
          sprint: "Sprint 1"
        }
      ]
    }));
  };

  // ── Sauvegarde ─────────────────────────────
  const saveToDatabase = async () => {
    if (!edited || !projectId) return;

    setSaving(true);
    setError(null);

    try {
      // ✅ URL correcte avec base URL du backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BACKENDSPRINGBOOT_URL}/projects/${projectId}/ai-analysis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            projectSummary: edited.projectSummary,
            tasks: edited.tasks || [],
            sprints: edited.sprints || [],
            risks: edited.risks || [],
            humanResources: edited.humanResources || [],
            materialResources: edited.materialResources || [],
            timeline: edited.timeline || {},
            costEstimation: edited.costEstimation || {},
            confidenceScore: edited.confidenceScore,
            documentQuality: edited.documentQuality,
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Erreur sauvegarde: ${response.status} - ${errText}`);
      }

      setSaved(true);

    } catch (err) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  // ── Reset ─────────────────────────────
  const reset = () => {
    setResult(null);
    setEdited(null);
    setError(null);
    setFileName(null);
    setSaved(false);
  };

  return {
    loading,
    saving,
    error,
    saved,
    result,
    edited,
    fileName,
    analyzeDocument,
    updateEdited,
    updateTask,
    removeTask,
    addTask,
    saveToDatabase,
    reset,
  };
}