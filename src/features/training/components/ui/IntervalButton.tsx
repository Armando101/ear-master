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
      "bg-[#353535] border border-[#404752]/10 hover:border-[#9ecaff]/50 hover:bg-[#393939] group",
    text: "text-[#e5e2e1] group-hover:text-[#9ecaff]",
  },
  correct: {
    container: "bg-[#00a673]/20 border border-[#4edea3]/40",
    text: "text-[#4edea3]",
  },
  incorrect: {
    container: "bg-[#93000a]/20 border border-[#ffb4ab]/40",
    text: "text-[#ffb4ab]",
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
      <span className="font-label text-[10px] text-[#bfc7d4] uppercase tracking-tighter mt-0.5">
        {name}
      </span>
    </button>
  );
}
