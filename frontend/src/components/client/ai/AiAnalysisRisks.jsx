'use client';

export default function AiRisks({ risks, onUpdateRisk }) {
  if (!risks?.length) return null;

  const impactStyle = (impact) => ({
    HIGH:   { backgroundColor: '#c47a5a', color: 'white' },
    MEDIUM: { backgroundColor: '#e2d5a0', color: '#7a6830' },
    LOW:    { backgroundColor: '#f3edd6', color: '#a08c4a' },
  }[impact] || {});

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#a08c4a' }}>
        Risques
      </p>
      <div className="space-y-0">
        {risks.map((risk, i) => (
          <div key={i} className="py-3" style={{ borderBottom: i < risks.length - 1 ? '1px solid #f0ebe0' : 'none' }}>
            <div className="flex items-center gap-2 mb-1">
              <select
                value={risk.impact || 'MEDIUM'}
                onChange={(e) => onUpdateRisk(i, 'impact', e.target.value)}
                className="text-xs font-medium px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none"
                style={impactStyle(risk.impact)}>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
              <input
                value={risk.probability || ''}
                onChange={(e) => onUpdateRisk(i, 'probability', e.target.value)}
                className="text-xs text-slate-400 w-16 focus:outline-none bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-300"
                placeholder="30%"
              />
            </div>
            <input
              value={risk.description || ''}
              onChange={(e) => onUpdateRisk(i, 'description', e.target.value)}
              className="text-sm text-slate-700 w-full focus:outline-none bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-300"
            />
            <div className="flex items-start gap-1 mt-1">
              <span className="text-xs text-slate-400 flex-shrink-0">→</span>
              <input
                value={risk.mitigation || ''}
                onChange={(e) => onUpdateRisk(i, 'mitigation', e.target.value)}
                className="text-xs text-slate-400 flex-1 focus:outline-none bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-300"
                placeholder="Stratégie de mitigation..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}