import "@/styles/ui/input.css";

export default function Input({ label, id, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="input-wrap">
      {label && <label className="input-label" htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-field ${error ? "input-error" : ""}`}
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}