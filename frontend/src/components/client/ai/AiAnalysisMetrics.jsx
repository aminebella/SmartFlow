'use client';

import { useState } from 'react';

export default function AiMetrics({ edited, onUpdateMetric }) {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const totalCost = edited?.costEstimation?.estimatedTotalCost ?? "—";
  const currency  = edited?.costEstimation?.currency || "MAD";
  const duration  = edited?.timeline
    ? calculateDuration(edited.timeline.startDate, edited.timeline.endDate)
    : "—";

  const metrics = [
    { label: "Tasks",    value: edited?.tasks?.length || 0,   sub: "identified", field: null,   subField: null },
    { label: "Sprints",  value: edited?.sprints?.length || 0, sub: "planned",    field: null,   subField: null },
    { label: "Duration", value: duration,                      sub: "estimated",  field: null,   subField: null },
    { label: "Cost",     value: totalCost,                     sub: currency,     field: "cost", subField: "currency" },
  ];

  const startEditing = (field, currentValue) => {
    if (!field) return;
    setEditingField(field);
    setTempValue(currentValue === "—" ? "" : String(currentValue));
  };

  const commitEdit = (field) => {
    onUpdateMetric?.(field, tempValue);
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter' || e.key === 'Escape') commitEdit(field);
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-xl p-4" style={{ border: '1px solid #e8e0cc' }}>
          <p className="text-xs text-slate-400 mb-1">{m.label}</p>

          {/* Value */}
          {m.field && editingField === m.field ? (
            <input
              autoFocus
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => commitEdit(m.field)}
              onKeyDown={(e) => handleKeyDown(e, m.field)}
              className="text-2xl font-semibold w-full focus:outline-none bg-transparent border-b"
              style={{ color: '#c9b479', borderColor: '#e8e0cc' }}
            />
          ) : (
            <p
              className={`text-2xl font-semibold ${m.field ? 'cursor-pointer hover:opacity-70 transition' : ''}`}
              style={{ color: '#c9b479' }}
              onClick={() => startEditing(m.field, m.value)}
              title={m.field ? 'Cliquer pour modifier' : undefined}
            >
              {m.value}
            </p>
          )}

          {/* Sub label */}
          {m.subField && editingField === m.subField ? (
            <input
              autoFocus
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => commitEdit(m.subField)}
              onKeyDown={(e) => handleKeyDown(e, m.subField)}
              className="text-xs w-full mt-1 focus:outline-none bg-transparent border-b"
              style={{ color: '#94a3b8', borderColor: '#e8e0cc' }}
            />
          ) : (
            <p
              className={`text-xs text-slate-400 mt-1 ${m.subField ? 'cursor-pointer hover:opacity-70 transition' : ''}`}
              onClick={() => startEditing(m.subField, m.sub)}
              title={m.subField ? 'Cliquer pour modifier' : undefined}
            >
              {m.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function calculateDuration(start, end) {
  if (!start || !end) return "—";
  const diff = new Date(end) - new Date(start);
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 30)  return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}