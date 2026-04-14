interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

export default function ToggleSwitch({ checked, onChange, id }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      onClick={onChange}
      className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none"
      style={{
        background: checked
          ? "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)"
          : "var(--color-surface-variant)",
        boxShadow: checked
          ? `0 0 0 2px rgba(var(--rgb-primary), 0.6)`
          : "none",
      }}
    >
      <span
        className="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
        style={{ transform: checked ? "translateX(1.5rem)" : "translateX(0.25rem)" }}
      />
    </button>
  );
}
