'use client';

export default function AiSprints({ sprints }) {
  if (!sprints?.length) return null;

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4"
        style={{ color: '#a08c4a' }}>Sprints</p>
      <div className="space-y-0">
        {sprints.map((sprint, i) => (
          <div key={i} className="flex gap-3 py-3"
            style={{ borderBottom: i < sprints.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
              style={{ backgroundColor: '#c9b479' }} />
            <div>
              <p className="text-sm font-medium text-slate-800">{sprint.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{sprint.goal}</p>
              <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1"
                style={{ backgroundColor: '#f3edd6', color: '#a08c4a', border: '1px solid #e2d5a0' }}>
                {sprint.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}