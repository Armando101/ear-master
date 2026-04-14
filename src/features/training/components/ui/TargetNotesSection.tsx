"use client";

import { useState } from "react";
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

function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-2">
      <button
        type="button"
        aria-label="More information"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => setVisible((v) => !v)}
        className="material-symbols-outlined text-[16px] leading-none text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors cursor-help focus:outline-none"
        style={{ fontVariationSettings: "'FILL' 0" }}
      >
        info
      </button>

      {/* Floating tooltip — absolute, outside flow */}
      {visible && (
        <span
          role="tooltip"
          className="pointer-events-none absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg px-3 py-2 text-xs leading-relaxed font-label shadow-lg"
          style={{
            background: "var(--color-surface-container-highest)",
            color: "var(--color-on-surface-variant)",
            border: `1px solid rgba(var(--rgb-outline-variant), 0.25)`,
            boxShadow: `0 8px 24px rgba(var(--rgb-black), 0.4)`,
            whiteSpace: "normal",
          }}
        >
          {/* Arrow */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 block w-2 h-2 rotate-45"
            style={{
              background: "var(--color-surface-container-highest)",
              borderRight: `1px solid rgba(var(--rgb-outline-variant), 0.25)`,
              borderBottom: `1px solid rgba(var(--rgb-outline-variant), 0.25)`,
              marginTop: "-5px",
            }}
          />
          {text}
        </span>
      )}
    </span>
  );
}

export default function TargetNotesSection({
  value,
  onChange,
}: TargetNotesSectionProps) {
  return (
    <div className="bg-[var(--color-surface-container-low)] p-8 rounded-xl">
      <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-[var(--color-tertiary)]">
          ads_click
        </span>
        Target Notes
      </h3>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center p-4 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer group"
          >
            <input
              type="radio"
              name="target_notes"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="w-5 h-5 flex-shrink-0"
              style={{
                accentColor: "var(--color-primary)",
              }}
            />
            <span className="ml-4 font-body font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
              {opt.label}
            </span>
            {opt.info && <InfoTooltip text={opt.info} />}
          </label>
        ))}
      </div>
    </div>
  );
}
