import type { IntervalSymbol } from "@/features/training/domain/training.types";

interface ResponseSlotsProps {
  slots: (IntervalSymbol | null)[];
  onClearLast: () => void;
}

export default function ResponseSlots({ slots, onClearLast }: ResponseSlotsProps) {
  const filled = slots.filter(Boolean).length;

  return (
    <div className="flex flex-col items-center gap-6 mb-10">
      {/* Slots row */}
      <div className="flex gap-4 items-center">
        {slots.map((slot, i) => (
          <div
            key={i}
            className="w-20 h-24 md:w-24 md:h-28 rounded-xl flex items-center justify-center font-headline text-2xl font-bold transition-all duration-200 recessed-input"
            style={{
              background: "var(--color-surface-container-lowest)",
              border: slot
                ? `2px solid rgba(var(--rgb-secondary-container), 0.4)`
                : `2px dashed rgba(var(--rgb-outline-variant), 0.3)`,
              color: slot ? "var(--color-secondary)" : "var(--color-surface-variant)",
            }}
          >
            {slot ?? "?"}
          </div>
        ))}

        {/* Backspace */}
        <button
          type="button"
          onClick={onClearLast}
          disabled={filled === 0}
          className="flex items-center justify-center w-12 h-24 md:h-28 rounded-xl bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-error)] hover:bg-[var(--color-surface-variant)] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Clear last answer"
        >
          <span className="material-symbols-outlined">backspace</span>
        </button>
      </div>
    </div>
  );
}
