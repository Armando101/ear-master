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
      className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9ecaff]/60"
      style={{
        background: checked
          ? "linear-gradient(135deg, #9ecaff 0%, #2196f3 100%)"
          : "#353535",
      }}
    >
      <span
        className="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
        style={{ transform: checked ? "translateX(1.5rem)" : "translateX(0.25rem)" }}
      />
    </button>
  );
}
