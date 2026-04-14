import type { ChordResult } from "@/features/training/domain/training.types";

interface ChordBreakdownRowProps {
  result: ChordResult;
}

function getColor(correct: number, total: number): string {
  const ratio = total > 0 ? correct / total : 0;
  if (ratio === 1) return "#4edea3"; // tertiary — perfect
  if (ratio >= 0.5) return "#ffe2ab"; // secondary — partial
  return "#ffb4ab"; // error — needs work
}

export default function ChordBreakdownRow({ result }: ChordBreakdownRowProps) {
  const { name, correct, total } = result;
  const ratio = total > 0 ? correct / total : 0;
  const color = getColor(correct, total);

  return (
    <div
      className="p-6 flex items-center justify-between group hover:bg-[#20201f] transition-colors"
      style={{ borderBottom: "1px solid rgba(64,71,82,0.05)" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-2 h-10 rounded-full"
          style={{ background: color }}
        />
        <div>
          <h4 className="font-headline text-base font-bold text-[#e5e2e1]">
            {name}
          </h4>
          <p
            className="text-xs uppercase tracking-wide"
            style={{ color: "#bfc7d4" }}
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
          style={{ background: "#353535" }}
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
