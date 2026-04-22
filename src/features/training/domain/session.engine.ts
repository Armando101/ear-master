import type { ExerciseConfig, IntervalSymbol } from "../domain/training.types";
import type { ExerciseQuestion, ChordQuality } from "../domain/music.types";
import {
  getAvailableIntervals,
  pickRandomRoot,
  pickTargetInterval,
  generateMelodicSequence,
  pickMelodicSequenceLength,
} from "../domain/music.rules";

/**
 * The session engine generates one ExerciseQuestion per exercise.
 *
 * First iteration scope: only "major" and "minor" triads are supported.
 * Any other triad types in the config are silently ignored.
 */

const SUPPORTED_QUALITIES: ChordQuality[] = ["major", "minor"];

/**
 * The octave for the tonic. All context and note files are recorded at octave 3
 * (e.g. `c3_context.mp3`, `C3.mp3`, `Cs4.mp3`).
 * Update this constant if a different register is preferred in future iterations.
 */
const DEFAULT_OCTAVE = 3;

function resolveQualities(config: ExerciseConfig): ChordQuality[] {
  const selected = config.triads.filter((t): t is ChordQuality =>
    SUPPORTED_QUALITIES.includes(t as ChordQuality)
  );
  return selected.length > 0 ? selected : SUPPORTED_QUALITIES;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a single exercise question based on the current session config.
 */
// Maps quality-relative equivalents so "3" selected as 3M also covers 3m for minor.
const QUALITY_BRIDGE: Partial<Record<IntervalSymbol, IntervalSymbol>> = {
  "3M": "3m", "3m": "3M",
  "6M": "6m", "6m": "6M",
  "7M": "7m", "7m": "7M",
};

export function generateQuestion(config: ExerciseConfig): ExerciseQuestion {
  const qualities = resolveQualities(config);
  const quality = pickRandom(qualities);
  const root = pickRandomRoot();

  let availableIntervals = getAvailableIntervals(quality, config.targetNotes);

  if (config.targetNotes === "scaleNotes" && config.scaleIntervals.length >= 2) {
    // Expand the selection to include quality-bridged equivalents so that
    // selecting "3" (stored as 3M in major-default store) also matches 3m
    // when the generated chord is minor, and vice-versa.
    const expandedSelection = new Set<IntervalSymbol>(config.scaleIntervals);
    for (const sym of config.scaleIntervals) {
      const bridged = QUALITY_BRIDGE[sym];
      if (bridged) expandedSelection.add(bridged);
    }
    const filtered = availableIntervals.filter((i) => expandedSelection.has(i));
    if (filtered.length >= 1) availableIntervals = filtered;
  }

  const targetIntervals = config.melodicSequence
    ? generateMelodicSequence(availableIntervals, pickMelodicSequenceLength())
    : [pickTargetInterval(availableIntervals)];

  return {
    chord: { root, octave: DEFAULT_OCTAVE, quality },
    targetIntervals,
    availableIntervals,
  };
}
