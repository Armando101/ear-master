interface ChordChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function ChordChip({ label, selected, onClick }: ChordChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-body font-medium text-sm transition-all duration-200 ${
        selected
          ? "chip-active"
          : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-bright)]"
      }`}
      style={
        !selected
          ? { background: "var(--color-surface-variant)" }
          : undefined
      }
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
