"use client";

import { useEffect, useRef, useState } from "react";
import type {
  IntervalSymbol,
  TargetNotes,
  TriadType,
} from "@/features/training/domain/training.types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TargetNotesSectionProps {
  value: TargetNotes;
  onChange: (v: TargetNotes) => void;
  scaleIntervals: IntervalSymbol[];
  onScaleIntervalsChange: (intervals: IntervalSymbol[]) => void;
  selectedTriads: TriadType[];
}

type QualityMode = "major" | "minor" | "both";

interface DisplayInterval {
  /** Human-readable label shown on the chip (e.g. "3", "4J") */
  label: string;
  /** Actual IntervalSymbol(s) this chip represents */
  symbols: IntervalSymbol[];
}

// ---------------------------------------------------------------------------
// Pool helpers
// ---------------------------------------------------------------------------

function getQualityMode(triads: TriadType[]): QualityMode {
  const MAJOR_TYPES: TriadType[] = ["major", "sus2", "sus4", "augmented"];
  const MINOR_TYPES: TriadType[] = ["minor", "diminished"];
  const hasMajor = triads.some((t) => MAJOR_TYPES.includes(t));
  const hasMinor = triads.some((t) => MINOR_TYPES.includes(t));
  if (hasMajor && hasMinor) return "both";
  if (hasMinor) return "minor";
  return "major";
}

function buildPool(mode: QualityMode): DisplayInterval[] {
  if (mode === "major")
    return [
      { label: "T",   symbols: ["T"] },
      { label: "2M",  symbols: ["2M"] },
      { label: "3",   symbols: ["3M"] },
      { label: "4J",  symbols: ["4J"] },
      { label: "5J",  symbols: ["5J"] },
      { label: "6",   symbols: ["6M"] },
      { label: "7",   symbols: ["7M"] },
    ];
  if (mode === "minor")
    return [
      { label: "T",   symbols: ["T"] },
      { label: "2M",  symbols: ["2M"] },
      { label: "3",   symbols: ["3m"] },
      { label: "4J",  symbols: ["4J"] },
      { label: "5J",  symbols: ["5J"] },
      { label: "6",   symbols: ["6m"] },
      { label: "7",   symbols: ["7m"] },
    ];
  // both — chips are the same labels, but store both variants
  return [
    { label: "T",   symbols: ["T"] },
    { label: "2M",  symbols: ["2M"] },
    { label: "3",   symbols: ["3M", "3m"] },
    { label: "4J",  symbols: ["4J"] },
    { label: "5J",  symbols: ["5J"] },
    { label: "6",   symbols: ["6M", "6m"] },
    { label: "7",   symbols: ["7M", "7m"] },
  ];
}

/**
 * Preserves which "positions" (T, 2M, 3, 4J, 5J, 6, 7) were selected
 * when the quality mode changes, remapping the stored symbols to the
 * correct variants for the new mode.
 */
function remapIntervals(
  current: IntervalSymbol[],
  fromPool: DisplayInterval[],
  toPool: DisplayInterval[]
): IntervalSymbol[] {
  const selectedLabels = new Set(
    fromPool
      .filter((di) => di.symbols.every((s) => current.includes(s)))
      .map((di) => di.label)
  );
  return toPool
    .filter((di) => selectedLabels.has(di.label))
    .flatMap((di) => di.symbols);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TargetNotesSection({
  value,
  onChange,
  scaleIntervals,
  onScaleIntervalsChange,
  selectedTriads,
}: TargetNotesSectionProps) {
  const qualityMode = getQualityMode(selectedTriads);
  const pool = buildPool(qualityMode);

  // Remap stored symbols when the quality mode changes
  const prevModeRef = useRef<QualityMode>(qualityMode);
  useEffect(() => {
    if (prevModeRef.current === qualityMode) return;
    const fromPool = buildPool(prevModeRef.current);
    const remapped = remapIntervals(scaleIntervals, fromPool, pool);
    prevModeRef.current = qualityMode;
    onScaleIntervalsChange(remapped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qualityMode]);

  const allSelected = pool.every((di) =>
    di.symbols.every((s) => scaleIntervals.includes(s))
  );

  const toggleAll = () => {
    onScaleIntervalsChange(allSelected ? [] : pool.flatMap((di) => di.symbols));
  };

  const toggleChip = (di: DisplayInterval) => {
    const isSelected = di.symbols.every((s) => scaleIntervals.includes(s));
    if (isSelected) {
      onScaleIntervalsChange(
        scaleIntervals.filter((s) => !di.symbols.includes(s))
      );
    } else {
      const next = [...scaleIntervals];
      for (const s of di.symbols) {
        if (!next.includes(s)) next.push(s);
      }
      onScaleIntervalsChange(next);
    }
  };

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
              style={{ accentColor: "var(--color-primary)" }}
            />
            <span className="ml-4 font-body font-medium text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">
              {opt.label}
            </span>
            {opt.info && <InfoTooltip text={opt.info} />}
          </label>
        ))}
      </div>

      {/* ── Scale interval picker ─────────────────────────────────────────── */}
      {value === "scaleNotes" && (
        <div
          className="mt-5 rounded-xl overflow-hidden"
          style={{
            border: `1px solid rgba(var(--rgb-outline-variant), 0.2)`,
            background: "var(--color-surface-container)",
          }}
        >
          {/* Header row */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              borderBottom: `1px solid rgba(var(--rgb-outline-variant), 0.15)`,
            }}
          >
            <span className="text-xs font-label uppercase tracking-widest text-[var(--color-on-surface-variant)]">
              Scale intervals
              {qualityMode !== "both" && (
                <span className="ml-2 capitalize opacity-60">
                  ({qualityMode})
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-label font-semibold uppercase tracking-wider transition-colors"
              style={{
                color: allSelected
                  ? "var(--color-primary)"
                  : "var(--color-on-surface-variant)",
              }}
            >
              {allSelected ? "✓ All" : "Select all"}
            </button>
          </div>

          {/* Chip grid */}
          <div className="p-4 flex flex-wrap gap-2">
            {pool.map((di) => {
              const selected = di.symbols.every((s) =>
                scaleIntervals.includes(s)
              );
              return (
                <button
                  key={di.label}
                  type="button"
                  id={`scale-interval-${di.label}`}
                  onClick={() => toggleChip(di)}
                  aria-pressed={selected}
                  className="px-4 py-2 rounded-full text-sm font-label font-semibold transition-all duration-150"
                  style={{
                    background: selected
                      ? "var(--color-primary)"
                      : "var(--color-surface-container-high)",
                    color: selected
                      ? "var(--color-on-primary)"
                      : "var(--color-on-surface-variant)",
                    border: selected
                      ? "1.5px solid var(--color-primary)"
                      : "1.5px solid transparent",
                    transform: selected ? "scale(1.05)" : "scale(1)",
                    boxShadow: selected
                      ? "0 0 10px rgba(var(--rgb-primary), 0.3)"
                      : "none",
                  }}
                >
                  {di.label}
                </button>
              );
            })}
          </div>

          {scaleIntervals.length < 2 && (
            <p
              className="px-5 pb-4 text-xs font-label"
              style={{ color: "var(--color-error)" }}
            >
              Select at least 2 intervals to start.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
