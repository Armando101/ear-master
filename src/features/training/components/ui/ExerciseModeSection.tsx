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
        background: "#2a2a2a",
        borderLeft: "4px solid #9ecaff",
      }}
    >
      <h3 className="font-headline text-xl font-bold mb-8 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#9ecaff]">tune</span>
        Exercise Mode
      </h3>

      <div className="space-y-10">
        {/* Drill Intensity */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label
              htmlFor="drill-intensity"
              className="font-label text-xs uppercase tracking-widest text-[#89919d]"
            >
              Drill Intensity
            </label>
            <span className="font-headline text-2xl font-bold text-[#9ecaff]">
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
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[#0e0e0e] accent-[#9ecaff]"
          />
          <div className="flex justify-between text-[10px] text-[#404752] font-bold uppercase tracking-tighter">
            <span>Quick Session</span>
            <span>Mastery Grind</span>
          </div>
        </div>

        {/* Melodic Sequence Toggle */}
        <div
          className="pt-6"
          style={{ borderTop: "1px solid rgba(64,71,82,0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-body font-bold text-[#e5e2e1]">
                Melodic Sequence
              </span>
              <span className="text-xs text-[#89919d]">
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
            background: "#1c1b1b",
            border: "1px solid rgba(64,71,82,0.05)",
          }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-6xl">
              graphic_eq
            </span>
          </div>
          <p className="text-[10px] text-[#ffe2ab] font-bold uppercase tracking-widest mb-2">
            Preview
          </p>
          <h4 className="font-headline text-lg font-bold mb-1">
            {melodicSequence ? "Melodic Sequence" : "Single Note"} Test
          </h4>
          <p className="text-sm text-[#89919d] leading-snug">
            {count} exercise{count !== 1 ? "s" : ""} ·{" "}
            {melodicSequence ? "2–4 note sequences" : "Single note per question"}
          </p>
        </div>
      </div>
    </div>
  );
}
