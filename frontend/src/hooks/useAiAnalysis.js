'use client';
import { useState } from "react";
import API from "@/api/axios";

export function useAiAnalysis(projectId) {

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [edited, setEdited] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [saved, setSaved] = useState(false);

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

      const response = await API.post(
        `/projects/${projectId}/ai-analysis/analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const parsed = response.data;

      const safeData = {
        projectSummary: parsed.projectSummary || "",
        documentQuality: parsed.documentQuality || "LOW",
        confidenceScore: parsed.confidenceScore || "LOW",
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        sprints: Array.isArray(parsed.sprints) ? parsed.sprints : [],
        risks: Array.isArray(parsed.risks) ? parsed.risks : [],
        humanResources: Array.isArray(parsed.humanResources) ? parsed.humanResources : [],
        materialResources: Array.isArray(parsed.materialResources) ? parsed.materialResources : [],
        timeline: parsed.timeline || { startDate: null, endDate: null, phases: [], justification: "" },
        costEstimation: parsed.costEstimation || { estimatedTotalCost: null, currency: "MAD", breakdown: [], assumptions: "" },
      };

      setResult(safeData);
      setEdited(safeData);

    } catch (err) {
      setError(err.response?.data?.error || err.message || "Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  // ── Modifications générales ─────────────────────────────
  const updateEdited = (field, value) => {
    setEdited(prev => ({ ...prev, [field]: value }));
  };

  // ── Tasks ─────────────────────────────
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
        { title: "", description: "", priority: "MEDIUM", estimatedComplexity: "MEDIUM", sprint: "Sprint 1" }
      ]
    }));
  };

  // ── Sprints ─────────────────────────────
  const updateSprint = (index, field, value) => {
    setEdited(prev => {
      const sprints = [...(prev?.sprints || [])];
      if (!sprints[index]) return prev;
      sprints[index] = { ...sprints[index], [field]: value };
      return { ...prev, sprints };
    });
  };

  const removeSprint = (index) => {
    setEdited(prev => ({
      ...prev,
      sprints: (prev?.sprints || []).filter((_, i) => i !== index)
    }));
  };

  // ── Risks ─────────────────────────────
  const updateRisk = (index, field, value) => {
    setEdited(prev => {
      const risks = [...(prev?.risks || [])];
      if (!risks[index]) return prev;
      risks[index] = { ...risks[index], [field]: value };
      return { ...prev, risks };
    });
  };

  // ── Human Resources ─────────────────────────────
  const updateResource = (index, field, value) => {
    setEdited(prev => {
      const humanResources = [...(prev?.humanResources || [])];
      if (!humanResources[index]) return prev;
      humanResources[index] = { ...humanResources[index], [field]: value };
      return { ...prev, humanResources };
    });
  };

  // ── Cost Estimation ─────────────────────────────
  const updateCost = (field, value) => {
    setEdited(prev => ({
      ...prev,
      costEstimation: {
        ...prev.costEstimation,
        [field]: value,
      }
    }));
  };

  const updateBreakdownItem = (index, field, value) => {
    setEdited(prev => {
      const breakdown = [...(prev?.costEstimation?.breakdown || [])];
      if (!breakdown[index]) return prev;
      breakdown[index] = { ...breakdown[index], [field]: value };
      return {
        ...prev,
        costEstimation: { ...prev.costEstimation, breakdown }
      };
    });
  };
const updateTimeline = (field, value) => {
  setEdited(prev => ({
    ...prev,
    timeline: { ...prev.timeline, [field]: value }
  }));
};

const updatePhase = (index, field, value) => {
  setEdited(prev => {
    const phases = [...(prev?.timeline?.phases || [])];
    if (!phases[index]) return prev;
    phases[index] = { ...phases[index], [field]: value };
    return { ...prev, timeline: { ...prev.timeline, phases } };
  });
};
  // ── Sauvegarde ─────────────────────────────
  const saveToDatabase = async () => {
    if (!edited || !projectId) return;
    setSaving(true);
    setError(null);

    try {
      await API.post(
        `/projects/${projectId}/ai-analysis/validate`,
        {
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
        }
      );
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Erreur lors de la sauvegarde");
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
    loading, saving, error, saved,
    result, edited, fileName,
    analyzeDocument,
    updateEdited,
    updateTask, removeTask, addTask,
    updateSprint, removeSprint,
    updateRisk,
    updateResource,
    updateCost, updateBreakdownItem,
    updateTimeline, updatePhase,  // ← vérifie que cette ligne existe
    saveToDatabase,
    reset,
  };
}