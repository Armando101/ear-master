interface ControlBarProps {
  onRepeat: () => void;
  onGiveContext: () => void;
}

export default function ControlBar({ onRepeat, onGiveContext }: ControlBarProps) {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      <button
        type="button"
        onClick={onRepeat}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-body font-bold text-sm uppercase tracking-wider text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] transition-all"
      >
        <span className="material-symbols-outlined text-sm">replay</span>
        Repeat
      </button>
      <button
        type="button"
        onClick={onGiveContext}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-body font-bold text-sm uppercase tracking-wider text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-variant)] transition-all"
      >
        <span className="material-symbols-outlined text-sm">info</span>
        Give Context
      </button>
    </div>
  );
}
