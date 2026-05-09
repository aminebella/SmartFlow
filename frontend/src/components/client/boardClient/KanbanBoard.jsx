'use client';

import { useState } from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'TODO', title: 'À faire', color: '#a08c4a' },
  { id: 'IN_PROGRESS', title: 'En cours', color: '#c9b479' },
  { id: 'REVIEW', title: 'Revue', color: '#d4c48a' },
  { id: 'DONE', title: 'Terminé', color: '#8a9e6b' },
  { id: 'BLOCKED', title: 'Bloqué', color: '#c47a5a' },
];

export default function KanbanBoard({ tickets, members, onEditTicket, onMoveTicket, isManager }) {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === targetStatus) return;
    if (!isManager && draggedTask.status === 'DONE') {
      alert('Seul un manager peut déplacer une tâche terminée (DONE).');
      return;
    }
    onMoveTicket?.(draggedTask.id, targetStatus);
    setDraggedTask(null);
  };

  const getTasksForColumn = (status) => {
    return tickets.filter((t) => t.status === status);
  };

  return (
    <div className="flex gap-4 pb-6 overflow-x-auto min-h-[500px]" style={{ backgroundColor: '#faf8f2' }}>
      {COLUMNS.map((column) => {
        const columnTasks = getTasksForColumn(column.id);
        return (
          <div
            key={column.id}
            className="flex-1 min-w-[280px] max-w-[320px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column header */}
            <div className="sticky top-0 z-10 mb-3">
              <div
                className="rounded-t-lg px-3 py-2 font-semibold text-white text-sm flex items-center justify-between"
                style={{ backgroundColor: column.color }}
              >
                <span>{column.title}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column body */}
            <div
              className="bg-[#f9f7f0] rounded-b-lg p-3 min-h-[400px] space-y-3 border border-[#e8e0cc]"
              style={{
                transition: 'background-color 0.2s',
              }}
            >
              {columnTasks.map((task) => {
                const member = members.find((m) => String(m.id) === String(task.assigneeId));
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    members={members}
                    onEdit={onEditTicket}
                    isDraggable={isManager || task.status !== 'DONE'}
                  />
                );
              })}
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-[#a08c4a] text-sm">
                  Aucune tâche
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
