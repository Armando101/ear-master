interface ChordChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
}

export default function ChordChip({
  label,
  selected,
  onClick,
  disabled = false,
  tooltip,
}: ChordChipProps) {
  return (
    <div className="relative group inline-block">
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className="px-4 py-2 rounded-md font-body font-medium text-sm transition-all duration-200"
        style={
          disabled
            ? {
                background: "var(--color-surface-container)",
                color: "var(--color-on-surface-variant)",
                opacity: 0.4,
                cursor: "not-allowed",
              }
            : selected
            ? {
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
              }
            : {
                background: "var(--color-surface-variant)",
                color: "var(--color-on-surface-variant)",
              }
        }
        aria-pressed={!disabled && selected}
        aria-disabled={disabled}
      >
        {label}
      </button>

      {/* Tooltip */}
      {disabled && tooltip && (
        <div
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-[10px] font-label font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10"
          style={{
            background: "var(--color-surface-container-highest)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
