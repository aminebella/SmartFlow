'use client';

export default function AiTimeline({ timeline, confidenceScore }) {
  if (!timeline) return null;

  const confColor = {
    HIGH:   '#8a9e6b',
    MEDIUM: '#c9b479',
    LOW:    '#c47a5a',
  }[confidenceScore] || '#c9b479';

  const confWidth = { HIGH: '85%', MEDIUM: '55%', LOW: '25%' }[confidenceScore] || '50%';

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4"
        style={{ color: '#a08c4a' }}>Timeline</p>

      <div className="space-y-2 mb-4">
        {timeline.phases?.map((phase, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-16 flex-shrink-0">{phase.name}</span>
            <div className="flex-1 h-5 rounded overflow-hidden"
              style={{ backgroundColor: '#f3edd6' }}>
              <div className="h-full flex items-center px-2"
                style={{ backgroundColor: '#c9b479', width: '100%' }}>
                <span className="text-xs text-white truncate">{phase.start}</span>
              </div>
            </div>
            <span className="text-xs text-slate-400 w-20 flex-shrink-0 text-right">
              {phase.end}
            </span>
          </div>
        ))}
      </div>

      {/* Confidence score */}
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