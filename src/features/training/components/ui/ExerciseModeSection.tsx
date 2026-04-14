import ToggleSwitch from "./ToggleSwitch";

interface ExerciseModeSectionProps {
  count: number;
  melodicSequence: boolean;
  onCountChange: (v: number) => void;
  onToggleMelodicSequence: () => void;
}

export default function ExerciseModeSection({
  count,
  melodicSequence,
  onCountChange,
  onToggleMelodicSequence,
}: ExerciseModeSectionProps) {
  return (
    <div
      className="p-8 rounded-xl"
      style={{
        background: "var(--color-surface-container-high)",
        borderLeft: "4px solid var(--color-primary)",
      }}
    >
      <h3 className="font-headline text-xl font-bold mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[var(--color-primary)]">tune</span>
        Exercise Mode
      </h3>

      <div className="space-y-10">
        {/* Drill Intensity */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label
              htmlFor="drill-intensity"
              className="font-label text-xs uppercase tracking-widest text-[var(--color-outline)]"
            >
              Drill Intensity
            </label>
            <span className="font-headline text-2xl font-bold text-[var(--color-primary)]">
              {count}
            </span>
          </div>
          <input
            id="drill-intensity"
            type="range"
            min={1}
            max={50}
            value={count}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[var(--color-surface-container-lowest)] accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-[10px] text-[var(--color-outline-variant)] font-bold uppercase tracking-tighter">
            <span>Quick Session</span>
            <span>Mastery Grind</span>
          </div>
        </div>

        {/* Melodic Sequence Toggle */}
        <div
          className="pt-6"
          style={{ borderTop: `1px solid rgba(var(--rgb-outline-variant), 0.1)` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-body font-bold text-[var(--color-on-surface)]">
                Melodic Sequence
              </span>
              <span className="text-xs text-[var(--color-outline)]">
                Notes played individually vs simultaneously
              </span>
            </div>
            <ToggleSwitch
              id="melodic-sequence"
              checked={melodicSequence}
              onChange={onToggleMelodicSequence}
            />
          </div>
        </div>

        {/* Session Preview Card */}
        <div
          className="rounded-lg p-6 relative overflow-hidden group"
          style={{
            background: "var(--color-surface-container-low)",
            border: `1px solid rgba(var(--rgb-outline-variant), 0.05)`,
          }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-6xl">
              graphic_eq
            </span>
          </div>
          <p className="text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-widest mb-2">
            Preview
          </p>
          <h4 className="font-headline text-lg font-bold mb-1">
            {melodicSequence ? "Melodic Sequence" : "Single Note"} Test
          </h4>
          <p className="text-sm text-[var(--color-outline)] leading-snug">
            {count} exercise{count !== 1 ? "s" : ""} ·{" "}
            {melodicSequence ? "2–4 note sequences" : "Single note per question"}
          </p>
        </div>
      </div>
    </div>
  );
}
