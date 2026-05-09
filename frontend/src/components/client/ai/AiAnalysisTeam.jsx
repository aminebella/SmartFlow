'use client';

const INITIALS = {
  "Frontend Developer": "FD",
  "Backend Developer":  "BD",
  "Project Manager":    "PM",
  "UI/UX Designer":     "UX",
  "QA Tester":          "QA",
};

export default function AiTeam({ humanResources, onUpdateResource }) {
  if (!humanResources?.length) return null;

  const getInitials = (role) =>
    INITIALS[role] || role.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-xl p-5" style={{ border: '1px solid #e8e0cc' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#a08c4a' }}>
        Équipe
      </p>
      <div className="grid grid-cols-2 gap-2">
        {humanResources.map((r, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg"
            style={{ backgroundColor: '#faf8f2', border: '0.5px solid #e8e0cc' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
              style={{ backgroundColor: '#c9b479' }}>
              {getInitials(r.role)}
            </div>
            <div className="flex-1 min-w-0">
              <input
                value={r.role || ''}
                onChange={(e) => onUpdateResource(i, 'role', e.target.value)}
                className="text-xs font-medium text-slate-700 w-full focus:outline-none bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-300 truncate"
              />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">x</span>
                <input
                  type="number"
                  min="1"
                  value={r.count || 1}
                  onChange={(e) => onUpdateResource(i, 'count', parseInt(e.target.value))}
                  className="text-xs text-slate-400 w-8 focus:outline-none bg-transparent border-b border-transparent hover:border-amber-200 focus:border-amber-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}