interface ControlBarProps {
  onRepeat: () => void;
  onGiveContext: () => void;
  disabled?: boolean;
}

export default function ControlBar({
  onRepeat,
  onGiveContext,
  disabled = false,
}: ControlBarProps) {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      <button
        type="button"
        onClick={onRepeat}
        disabled={disabled}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-body font-bold text-sm uppercase tracking-wider text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-sm">replay</span>
        Repeat
      </button>
      <button
        type="button"
        onClick={onGiveContext}
        disabled={disabled}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-body font-bold text-sm uppercase tracking-wider text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-sm">refresh</span>
        Give Context
      </button>
    </div>
  );
}
