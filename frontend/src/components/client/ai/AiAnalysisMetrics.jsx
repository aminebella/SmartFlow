'use client';

export default function AiMetrics({ edited }) {
  const totalCost = edited?.costEstimation?.estimatedTotalCost || "—";
  const currency  = edited?.costEstimation?.currency || "MAD";
  const duration  = edited?.timeline
    ? calculateDuration(edited.timeline.startDate, edited.timeline.endDate)
    : "—";

  return (
    <div className="grid grid-cols-4 gap-4 mb-5">
      {[
        { label: "Tasks",    value: edited?.tasks?.length || 0,    sub: "identified" },
        { label: "Sprints",  value: edited?.sprints?.length || 0,  sub: "planned" },
        { label: "Duration", value: duration,                       sub: "estimated" },
        { label: "Cost",     value: totalCost,                      sub: currency },
      ].map((m) => (
        <div key={m.label} className="bg-white rounded-xl p-4"
          style={{ border: '1px solid #e8e0cc' }}>
          <p className="text-xs text-slate-400 mb-1">{m.label}</p>
          <p className="text-2xl font-semibold" style={{ color: '#c9b479' }}>{m.value}</p>
          <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
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