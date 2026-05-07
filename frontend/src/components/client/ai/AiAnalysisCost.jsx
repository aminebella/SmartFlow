'use client';

export default function AiCost({ costEstimation }) {
  if (!costEstimation) return null;

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4"
        style={{ color: '#a08c4a' }}>Cost estimation</p>
      <div className="flex items-center justify-between p-3 rounded-lg mb-3"
        style={{ backgroundColor: '#f3edd6', border: '1px solid #e2d5a0' }}>
        <span className="text-sm font-medium" style={{ color: '#a08c4a' }}>Total</span>
        <span className="text-lg font-semibold" style={{ color: '#c9b479' }}>
          {costEstimation.estimatedTotalCost} {costEstimation.currency}
        </span>
      </div>
      <div className="space-y-0 max-h-48 overflow-y-auto">
        {costEstimation.breakdown?.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 text-sm"
            style={{ borderBottom: '1px solid #f0ebe0' }}>
            <span className="text-slate-700 flex-1 truncate">{item.task}</span>
            <span className="text-xs text-slate-400 mx-2 flex-shrink-0">{item.type}</span>
            <span className="font-medium flex-shrink-0" style={{ color: '#a08c4a' }}>
              {item.cost}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}