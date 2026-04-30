'use client';

export default function TicketDeleteModal({ ticket, onClose, onConfirm }) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Supprimer le ticket ?</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-slate-600 text-sm mb-4">
            Êtes-vous sûr de vouloir supprimer le ticket <span className="font-mono font-bold text-slate-800">{ticket.key || ticket.id}</span> ?
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-sm font-medium text-slate-800">{ticket.title}</p>
            <p className="text-xs text-slate-500 mt-1">Cette action est irréversible.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-sm"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
