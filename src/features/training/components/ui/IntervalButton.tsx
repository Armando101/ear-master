import type { IntervalSymbol, IntervalState } from "@/features/training/domain/training.types";

interface IntervalButtonProps {
  symbol: IntervalSymbol;
  name: string;
  state: IntervalState;
  onClick: (symbol: IntervalSymbol) => void;
  disabled?: boolean;
}

const STATE_STYLES: Record<IntervalState, { container: string; text: string }> = {
  default: {
    container:
      "bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)]/10 hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-bright)] group",
    text: "text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)]",
  },
  correct: {
    container: "bg-[var(--color-tertiary-container)]/20 border border-[var(--color-tertiary)]/40",
    text: "text-[var(--color-tertiary)]",
  },
  incorrect: {
    container: "bg-[var(--color-error-container)]/20 border border-[var(--color-error)]/40",
    text: "text-[var(--color-error)]",
  },
};

export default function IntervalButton({
  symbol,
  name,
  state,
  onClick,
  disabled = false,
}: IntervalButtonProps) {
  const { container, text } = STATE_STYLES[state];

  return (
    <button
      type="button"
      onClick={() => onClick(symbol)}
      disabled={disabled}
      className={`flex flex-col items-center justify-center aspect-square md:aspect-auto md:h-24 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${container}`}
    >
      <span className={`font-headline text-2xl font-bold transition-colors ${text}`}>
        {symbol}
      </span>
      <span className="font-label text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-tighter mt-0.5">
        {name}
      </span>
    </button>
  );
}
