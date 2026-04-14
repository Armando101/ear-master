import type { IntervalSymbol, IntervalState } from "@/features/training/domain/training.types";
import IntervalButton from "./IntervalButton";

interface IntervalGridProps {
  intervals: { symbol: IntervalSymbol; name: string }[];
  intervalStates: Partial<Record<IntervalSymbol, IntervalState>>;
  onSelect: (symbol: IntervalSymbol) => void;
  disabled?: boolean;
}

export default function IntervalGrid({
  intervals,
  intervalStates,
  onSelect,
  disabled = false,
}: IntervalGridProps) {
  return (
    <section className="grid grid-cols-4 md:grid-cols-8 gap-3">
      {intervals.map(({ symbol, name }) => (
        <IntervalButton
          key={symbol}
          symbol={symbol}
          name={name}
          state={intervalStates[symbol] ?? "default"}
          onClick={onSelect}
          disabled={disabled}
        />
      ))}
    </section>
  );
}
