'use client';

export default function TicketHeader({ count, activeSprint, loading, onCreateClick }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tickets</h1>
        {!loading && (
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
            <span>{count} total</span>
            {activeSprint && (
              <>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#c9b479' }} />
                  <span className="font-medium" style={{ color: '#c9b479' }}>
                    {activeSprint.name} actif
                  </span>
                </span>
              </>
            )}
          </p>
        )}
      </div>

      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition hover:opacity-90"
        style={{ backgroundColor: '#c9b479' }}
      >
        <span className="text-lg leading-none font-light">+</span>
        New Ticket
      </button>
    </div>
  );
}