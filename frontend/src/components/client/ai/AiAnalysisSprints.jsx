'use client';

export default function AiSprints({ sprints, onUpdateSprint, onRemoveSprint }) {
  if (!sprints?.length) return null;

  return (
    <div className="bg-white rounded-xl p-5 h-full flex flex-col" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#a08c4a' }}>
        Sprints
      </p>
      <div className="flex-1 overflow-y-auto space-y-0">
        {sprints.map((sprint, i) => (
          <div key={i} className="py-3" style={{ borderBottom: i < sprints.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#c9b479' }} />
              <div className="flex-1">
                <input
                  value={sprint.name || ''}
                  onChange={(e) => onUpdateSprint(i, 'name', e.target.value)}
                  className="text-sm font-medium text-slate-800 w-full focus:outline-none bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-300"
                />
                <input
                  value={sprint.goal || ''}
                  onChange={(e) => onUpdateSprint(i, 'goal', e.target.value)}
                  className="text-xs text-slate-500 w-full mt-1 focus:outline-none bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-300"
                  placeholder="Objectif du sprint..."
                />
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#f3edd6', color: '#a08c4a', border: '1px solid #e2d5a0' }}>
                    {sprint.duration}
                  </span>
                </div>
              </div>
              <button onClick={() => onRemoveSprint(i)}
                className="text-slate-300 hover:text-red-400 transition flex-shrink-0 mt-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}