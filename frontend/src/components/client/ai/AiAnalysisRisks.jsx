'use client';

export default function AiRisks({ risks }) {
  if (!risks?.length) return null;

  const impactStyle = (impact) => ({
    HIGH:   { backgroundColor: '#c47a5a', color: 'white' },
    MEDIUM: { backgroundColor: '#e2d5a0', color: '#7a6830' },
    LOW:    { backgroundColor: '#f3edd6', color: '#a08c4a' },
  }[impact] || {});

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4"
        style={{ color: '#a08c4a' }}>Risks</p>
      <div className="space-y-0">
        {risks.map((risk, i) => (
          <div key={i} className="py-3"
            style={{ borderBottom: i < risks.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={impactStyle(risk.impact)}>
                {risk.impact}
              </span>
              <span className="text-xs text-slate-400">{risk.probability}</span>
            </div>
            <p className="text-sm text-slate-700">{risk.description}</p>
            <p className="text-xs text-slate-400 mt-1">→ {risk.mitigation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}