import type { PitchClass, ChordQuality } from "./music.types";
import type { IntervalSymbol } from "./training.types";
import type { TargetNotes } from "./training.types";
import {
  PITCH_CLASSES,
  PITCH_TO_AUDIO_KEY,
  PITCH_TO_MAJOR_CONTEXT_KEY,
  INTERVAL_SEMITONES,
  MAJOR_TRIAD_INTERVALS,
  MINOR_TRIAD_INTERVALS,
  MAJOR_SCALE_INTERVALS,
  MINOR_SCALE_INTERVALS,
  CHROMATIC_INTERVALS,
  MELODIC_SEQUENCE_MIN,
  MELODIC_SEQUENCE_MAX,
} from "./music.constants";

// ---------------------------------------------------------------------------
// Pitch utilities
// ---------------------------------------------------------------------------

/**
 * Converts a pitch class to the lowercase audio file key for:
 *   - Minor context files (/audios/minor/{key}_min_context.wav)
 *   - Individual note files (/audios/notes/{key}.wav)
 * Uses sharp notation throughout (cs, ds, fs, gs, as).
 */
export function pitchToAudioKey(pitch: PitchClass): string {
  return PITCH_TO_AUDIO_KEY[pitch];
}

/**
 * Converts a pitch class to the lowercase audio file key for:
 *   - Major context files (/audios/major/{key}_context.wav)
 * Uses flat notation for Ds→eb, Gs→ab, As→bb (matching actual filenames).
 */
export function pitchToMajorContextKey(pitch: PitchClass): string {
  return PITCH_TO_MAJOR_CONTEXT_KEY[pitch];
}

/**
 * Resolves enharmonic equivalents (flats → sharps) and returns the
 * corresponding PitchClass.
 * Used when the scale/interval calculation yields a flat name.
 */
export function resolveEnharmonic(note: string): PitchClass {
  const ENHARMONIC: Record<string, PitchClass> = {
    Cb: "B",
    Db: "Cs",
    Eb: "Ds",
    Fb: "E",
    Gb: "Fs",
    Ab: "Gs",
    Bb: "As",
  };
  return (ENHARMONIC[note] ?? note) as PitchClass;
}

/**
 * Returns the pitch class that is `semitones` above `root`.
 */
export function transposePitch(root: PitchClass, semitones: number): PitchClass {
  const rootIndex = PITCH_CLASSES.indexOf(root);
  const targetIndex = (rootIndex + semitones) % 12;
  return PITCH_CLASSES[targetIndex];
}

// ---------------------------------------------------------------------------
// Interval pool selectors
// ---------------------------------------------------------------------------

/**
 * Returns the chord tones (intervals) for a given quality.
 */
export function getChordTones(quality: ChordQuality): IntervalSymbol[] {
  return quality === "major" ? MAJOR_TRIAD_INTERVALS : MINOR_TRIAD_INTERVALS;
}

/**
 * Returns the scale intervals for a given quality.
 */
export function getScaleIntervals(quality: ChordQuality): IntervalSymbol[] {
  return quality === "major" ? MAJOR_SCALE_INTERVALS : MINOR_SCALE_INTERVALS;
}

/**
 * Returns the full chromatic pool (12 intervals, no octave duplicate).
 */
export function getAllChromaticIntervals(): IntervalSymbol[] {
  return CHROMATIC_INTERVALS;
}

/**
 * Returns the set of intervals that should be displayed and asked, based on
 * the user's target notes configuration and chord quality.
 */
export function getAvailableIntervals(
  quality: ChordQuality,
  targetNotes: TargetNotes
): IntervalSymbol[] {
  switch (targetNotes) {
    case "chordTones":
      return getChordTones(quality);
    case "scaleNotes":
      return getScaleIntervals(quality);
    case "allChromatic":
      return getAllChromaticIntervals();
  }
}

// ---------------------------------------------------------------------------
// Interval → semitones
// ---------------------------------------------------------------------------

export function intervalToSemitones(interval: IntervalSymbol): number {
  return INTERVAL_SEMITONES[interval];
}

// ---------------------------------------------------------------------------
// Random helpers
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Picks a random element from the pool, optionally excluding some values.
 */
function pickRandomExcluding<T>(arr: T[], exclude: T[]): T {
  const filtered = arr.filter((v) => !exclude.includes(v));
  return filtered.length > 0 ? pickRandom(filtered) : pickRandom(arr);
}

// ---------------------------------------------------------------------------
// Question builder
// ---------------------------------------------------------------------------

/**
 * Picks a random target interval from the available pool.
 * Excludes "8" to avoid confusion with "T" (same pitch, different octave).
 */
export function pickTargetInterval(
  available: IntervalSymbol[]
): IntervalSymbol {
  return pickRandomExcluding(available, ["8"]);
}

/**
 * Picks a random root pitch class.
 */
export function pickRandomRoot(): PitchClass {
  return pickRandom(PITCH_CLASSES);
}

/**
 * Picks how many notes a melodic sequence will have (2, 3, or 4).
 */
export function pickMelodicSequenceLength(): number {
  return (
    Math.floor(Math.random() * (MELODIC_SEQUENCE_MAX - MELODIC_SEQUENCE_MIN + 1)) +
    MELODIC_SEQUENCE_MIN
  );
}

/**
 * Generates a melodic sequence of `length` unique intervals from the pool.
 * Notes can repeat (realistic musical context), but we avoid repeating
 * the same interval consecutively.
 */
export function generateMelodicSequence(
  available: IntervalSymbol[],
  length: number
): IntervalSymbol[] {
  const pool = available.filter((i) => i !== "8");
  const sequence: IntervalSymbol[] = [];

  for (let i = 0; i < length; i++) {
    const prev = sequence[i - 1];
    const next =
      pool.length > 1
        ? pickRandomExcluding(pool, prev ? [prev] : [])
        : pickRandom(pool);
    sequence.push(next);
  }

  return sequence;
}
