"use client";

import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import { getTickets } from "@/services/taskService";

const COLUMNS = [
  { key: "TODO",        label: "To Do",       color: "bg-gray-400" },
  { key: "IN_PROGRESS", label: "In Progress", color: "bg-blue-500" },
  { key: "REVIEW",      label: "Review",      color: "bg-purple-500" },
  { key: "DONE",        label: "Done",        color: "bg-green-500" },
];

export default function TaskBoard({ projectId }) {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    getTickets(projectId)
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch(() => setError("Erreur lors du chargement des tâches."))
      .finally(() => setLoading(false));
  }, [projectId]);

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <span className="ml-3 text-slate-400 text-sm">Chargement…</span>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-3xl mb-2">⚠️</div>
      <p className="text-slate-500 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <div key={col.key} className="flex-shrink-0 w-64 bg-gray-50 rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
            <span className="text-sm font-semibold text-gray-700">{col.label}</span>
            <span className="ml-auto text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
              {tasksByStatus(col.key).length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {tasksByStatus(col.key).length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Aucune tâche</p>
            ) : (
              tasksByStatus(col.key).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}