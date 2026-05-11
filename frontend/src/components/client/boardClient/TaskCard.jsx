'use client';

import { useState } from 'react';

const STATUS_COLORS = {
  TODO:        { bg: '#f3edd6', text: '#a08c4a' },
  IN_PROGRESS: { bg: '#c9b479', text: '#fff' },
  REVIEW:      { bg: '#d4c48a', text: '#fff' },
  DONE:        { bg: '#8a9e6b', text: '#fff' },
  BLOCKED:     { bg: '#c47a5a', text: '#fff' },
};

const PRIORITY_COLORS = {
  CRITICAL: { bg: '#6b3a1f', text: '#fff' },
  HIGH:     { bg: '#c9b479', text: '#fff' },
  MEDIUM:   { bg: '#e2d5a0', text: '#7a6830' },
  LOW:      { bg: '#f3edd6', text: '#a08c4a' },
};

const getInitials = (name) => {
  if (!name) return '—';
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
};

export default function TaskCard({ task, members, onEdit, isDraggable = true }) {
  const [isDragging, setIsDragging] = useState(false);
  const member = members.find((m) => String(m.id) === String(task.assigneeId));

  const statusStyle = STATUS_COLORS[task.status] || STATUS_COLORS.TODO;
  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.LOW;

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('taskId', task.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={() => onEdit?.(task)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEdit?.(task); }}
      role="button"
      tabIndex={0}
      className={`bg-white border border-[#e8e0cc] rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      style={{ minHeight: '120px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-semibold text-[#c9b479]">
          {task.key || task.id}
        </span>
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.text }}
        >
          {task.priority}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-[#334155] mb-3 line-clamp-2">
        {task.title}
      </h3>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          {member ? (
            <>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: '#c9b479' }}
              >
                {getInitials(member.fullName)}
              </div>
              <span className="text-xs text-[#64748b] truncate max-w-[80px]" title={member.fullName}>
                {member.fullName}
              </span>
            </>
          ) : (
            <span className="text-xs text-[#a08c4a]">Unassigned</span>
          )}
        </div>

        {/* Status badge */}
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {task.status?.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
