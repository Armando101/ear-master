import type { ChordResult } from "@/features/training/domain/training.types";

interface ChordBreakdownRowProps {
  result: ChordResult;
}

function getColorVar(correct: number, total: number): string {
  const ratio = total > 0 ? correct / total : 0;
  if (ratio === 1) return "var(--color-tertiary)";       // perfect
  if (ratio >= 0.5) return "var(--color-secondary)";    // partial
  return "var(--color-error)";                           // needs work
}

export default function ChordBreakdownRow({ result }: ChordBreakdownRowProps) {
  const { name, correct, total } = result;
  const ratio = total > 0 ? correct / total : 0;
  const color = getColorVar(correct, total);

  return (
    <div
      className="p-6 flex items-center justify-between group hover:bg-[var(--color-surface-container)] transition-colors"
      style={{ borderBottom: `1px solid rgba(var(--rgb-outline-variant), 0.05)` }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-2 h-10 rounded-full"
          style={{ background: color }}
        />
        <div>
          <h4 className="font-headline text-base font-bold text-[var(--color-on-surface)]">
            {name}
          </h4>
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {ratio === 1
              ? "Perfect"
              : ratio >= 0.5
              ? "Needs Focus"
              : "Requires Work"}
          </p>
        </div>
      </div>

      <div className="text-right">
        <span
          className="font-headline text-xl font-bold"
          style={{ color }}
        >
          {correct}/{total}
        </span>
        <div
          className="w-24 h-1 mt-2 rounded-full overflow-hidden"
          style={{ background: "var(--color-surface-variant)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${ratio * 100}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}
