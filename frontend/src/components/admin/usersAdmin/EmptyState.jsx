// EmptyState.jsx
export default function EmptyState({ message = 'Aucun utilisateur trouvé.', onRetry }) {
  return (
    <div className="au-empty">
      <svg className="au-empty-icon" viewBox="0 0 64 64" fill="none" width="40" height="40">
        <circle cx="32" cy="24" r="12" stroke="#c5cae0" strokeWidth="2" />
        <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24"
          stroke="#c5cae0" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <p className="au-empty-text">{message}</p>
      {onRetry && (
        <button className="au-retry-btn" onClick={onRetry}>Réessayer</button>
      )}
    </div>
  );
}
