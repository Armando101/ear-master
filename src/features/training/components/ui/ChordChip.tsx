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
      className="px-4 py-2 rounded-md font-body font-medium text-sm transition-all duration-200"
      style={
        selected
          ? {
              background: "var(--color-primary)",
              color: "var(--color-on-primary)",
            }
          : {
              background: "var(--color-surface-variant)",
              color: "var(--color-on-surface-variant)",
            }
      }
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
