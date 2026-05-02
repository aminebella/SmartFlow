import "@/styles/ui/button.css";

export default function Button({ label, onClick, type = "button", variant = "primary", loading = false, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`sf-btn sf-btn-${variant}`}
    >
      {loading ? <div className="btn-spinner" /> : label}
    </button>
  );
}