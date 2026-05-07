'use client';

export default function TicketFooter({ 
  filteredCount, totalCount, activeFiltersCount, onClearFilters,
  currentPage, totalPages, onPageChange
}) {
  return (
    <div className="border-t py-3 px-6 flex items-center justify-between" 
      style={{ borderColor: '#f0ebe0' }}>
      
      {/* Compteur */}
      <p className="text-xs text-slate-400">
        Affichage de{" "}
        <span className="font-medium text-slate-500">{filteredCount}</span>
        {" "}sur{" "}
        <span className="font-medium text-slate-500">{totalCount}</span>
        {" "}tickets
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="ml-3 hover:underline transition"
            style={{ color: '#c9b479' }}
          >
            Effacer les filtres
          </button>
        )}
      </p>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Précédent */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
            style={{ borderColor: '#e2d5a0', color: '#a08c4a' }}
          >
            ← Précédent
          </button>

          {/* Numéros de pages */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="w-8 h-8 text-xs rounded-lg border transition"
              style={{
                backgroundColor: currentPage === page ? '#c9b479' : 'white',
                color: currentPage === page ? 'white' : '#a08c4a',
                borderColor: currentPage === page ? '#c9b479' : '#e2d5a0',
              }}
            >
              {page}
            </button>
          ))}

          {/* Suivant */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
            style={{ borderColor: '#e2d5a0', color: '#a08c4a' }}
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
}