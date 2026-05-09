'use client';

import { useState, useEffect } from 'react';

export default function AiTimeline({ timeline, confidenceScore, onUpdateTimeline, onUpdatePhase }) {

  const [localTimeline, setLocalTimeline] = useState(timeline);

  // Sync si les props changent depuis l'extérieur (ex: reset)
  useEffect(() => {
    setLocalTimeline(timeline);
  }, [timeline]);

  if (!localTimeline) return null;

  const confColor = {
    HIGH:   '#8a9e6b',
    MEDIUM: '#c9b479',
    LOW:    '#c47a5a',
  }[confidenceScore] || '#c9b479';

  const confWidth = { HIGH: '85%', MEDIUM: '55%', LOW: '25%' }[confidenceScore] || '50%';

  const handleFieldChange = (field, value) => {
    setLocalTimeline(prev => ({ ...prev, [field]: value }));
  };

  const commitField = (field, value) => {
    onUpdateTimeline?.(field, value);
  };

  const handlePhaseChange = (rowIndex, field, value) => {
    setLocalTimeline(prev => {
      const phases = [...(prev.phases || [])];
      phases[rowIndex] = { ...phases[rowIndex], [field]: value };
      return { ...prev, phases };
    });
  };

  const commitPhase = (rowIndex, field, value) => {
    onUpdatePhase?.(rowIndex, field, value);
  };

  const inlineInput = (field, value, style = {}) => (
    <input
      value={value ?? ''}
      onChange={(e) => handleFieldChange(field, e.target.value)}
      onBlur={(e) => commitField(field, e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid transparent',
        outline: 'none',
        fontSize: 12,
        minWidth: 80,
        cursor: 'text',
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderBottomColor = '#e2d5a0')}
      onBlurCapture={(e) => (e.target.style.borderBottomColor = 'transparent')}
    />
  );

  const cellInput = (rowIndex, field, value, style = {}) => (
    <input
      value={value ?? ''}
      onChange={(e) => handlePhaseChange(rowIndex, field, e.target.value)}
      onBlur={(e) => commitPhase(rowIndex, field, e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
      style={{
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid transparent',
        outline: 'none',
        fontSize: 12,
        width: '100%',
        cursor: 'text',
        ...style,
      }}
      onFocus={(e) => (e.target.style.borderBottomColor = '#e2d5a0')}
      onBlurCapture={(e) => (e.target.style.borderBottomColor = 'transparent')}
    />
  );

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#a08c4a' }}>
        Timeline
      </p>

      <div className="flex items-center gap-3 mb-4 text-xs text-slate-400">
        <span>Début :</span>
        {inlineInput('startDate', localTimeline.startDate, { color: '#a08c4a', fontWeight: 500 })}
        <span className="mx-1">→</span>
        <span>Fin :</span>
        {inlineInput('endDate', localTimeline.endDate, { color: '#a08c4a', fontWeight: 500 })}
      </div>

      <div className="space-y-2 mb-4">
        {localTimeline.phases?.map((phase, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-16 flex-shrink-0">
              {cellInput(i, 'name', phase.name, { color: '#94a3b8' })}
            </div>
            <div className="flex-1 h-5 rounded overflow-hidden" style={{ backgroundColor: '#f3edd6' }}>
              <div className="h-full flex items-center px-2" style={{ backgroundColor: '#c9b479', width: '100%' }}>
                {cellInput(i, 'start', phase.start, { color: 'white' })}
              </div>
            </div>
            <div className="w-20 flex-shrink-0 text-right">
              {cellInput(i, 'end', phase.end, { color: '#94a3b8' })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg"
        style={{ backgroundColor: '#f3edd6', border: '1px solid #e2d5a0' }}>
        <span className="text-xs" style={{ color: '#a08c4a' }}>Confidence</span>
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#e2d5a0' }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: confWidth, backgroundColor: confColor }} />
        </div>
        <span className="text-xs font-medium" style={{ color: confColor }}>
          {confidenceScore}
        </span>
      </div>
    </div>
  );
}