import type { TargetNotes } from "@/features/training/domain/training.types";

interface TargetNotesSectionProps {
  value: TargetNotes;
  onChange: (v: TargetNotes) => void;
}

const OPTIONS: { value: TargetNotes; label: string; info?: string }[] = [
  { value: "chordTones", label: "Chord tones only" },
  { value: "scaleNotes", label: "Scale notes" },
  {
    value: "allChromatic",
    label: "All chromatic notes",
    info: "Only available for major/minor triads and maj7/m7",
  },
];

export default function TargetNotesSection({
  value,
  onChange,
}: TargetNotesSectionProps) {
  return (
    <div className="bg-[var(--color-surface-container-low)] p-8 rounded-xl">
      <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-[var(--color-secondary)]">
          ads_click
        </span>
        Target Notes
      </h3>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-start p-4 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer group"
          >
            <input
              type="radio"
              name="target_notes"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="mt-0.5 w-5 h-5 bg-[var(--color-surface-container-lowest)] border-[var(--color-outline-variant)] flex-shrink-0"
              style={{
                accentColor: "var(--color-secondary-container)",
              }}
            />
            <div className="ml-4">
              <span className="font-body font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-secondary)] transition-colors">
                {opt.label}
              </span>
              {opt.info && (
                <div
                  className="flex items-start gap-1.5 mt-2 text-xs leading-relaxed p-2 rounded"
                  style={{
                    color: "var(--color-outline)",
                    background: `rgba(var(--rgb-surface-container-lowest), 0.6)`,
                  }}
                >
                  <span className="material-symbols-outlined text-sm flex-shrink-0">
                    info
                  </span>
                  <span>{opt.info}</span>
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
