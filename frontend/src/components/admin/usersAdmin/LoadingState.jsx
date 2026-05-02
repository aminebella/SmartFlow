// LoadingState.jsx
export default function LoadingState({ message = 'Chargement…' }) {
  return (
    <div className="au-loading">
      <div className="au-spinner" />
      <span>{message}</span>
    </div>
  );
}
