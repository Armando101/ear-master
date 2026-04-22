import type { PitchClass } from "./music.types";
import type { IntervalSymbol } from "./training.types";

/** All 12 pitch classes in sharp notation, ordered chromatically from C. */
export const PITCH_CLASSES: PitchClass[] = [
  "C",
  "Cs",
  "D",
  "Ds",
  "E",
  "F",
  "Fs",
  "G",
  "Gs",
  "A",
  "As",
  "B",
];

/**
 * Maps a pitch class to the lowercase audio file key used in:
 *   - /public/audios/minor/{key}_min_context.wav
 *
 * Uses flat notation for Ds→eb, Gs→ab, As→bb to match actual filenames
 * (e.g. bb3_min_context.wav, ab3_min_context.wav, eb3_min_context.wav).
 */
export const PITCH_TO_AUDIO_KEY: Record<PitchClass, string> = {
  C:  "c",
  Cs: "cs",
  D:  "d",
  Ds: "eb",  // flat — no ds3_min_context.wav exists
  E:  "e",
  F:  "f",
  Fs: "fs",
  G:  "g",
  Gs: "ab",  // flat — no gs3_min_context.wav exists
  A:  "a",
  As: "bb",  // flat — no as3_min_context.wav exists
  B:  "b",
};

/**
 * Maps a pitch class to the lowercase audio file key used in:
 *   - /public/audios/notes/{key}{octave}.wav
 *
 * Note files use: c cs d eb e f fs g ab a bb b
 * i.e. flat notation for Ds→eb, Gs→ab, As→bb.
 */
export const PITCH_TO_NOTE_KEY: Record<PitchClass, string> = {
  C:  "c",
  Cs: "cs",
  D:  "d",
  Ds: "eb",  // flat
  E:  "e",
  F:  "f",
  Fs: "fs",
  G:  "g",
  Gs: "ab",  // flat
  A:  "a",
  As: "bb",  // flat
  B:  "b",
};

/**
 * Maps a pitch class to the lowercase audio file key used in:
 *   - /public/audios/major/{key}_context.wav
 *
 * Major context files use flat notation for three enharmonic pairs:
 *   Ds → "eb"  (no ds_context.wav, only eb_context.wav)
 *   Gs → "ab"  (no gs_context.wav, only ab_context.wav)
 *   As → "bb"  (no as_context.wav, only bb_context.wav)
 */
export const PITCH_TO_MAJOR_CONTEXT_KEY: Record<PitchClass, string> = {
  C:  "c",
  Cs: "cs",
  D:  "d",
  Ds: "eb",   // flat
  E:  "e",
  F:  "f",
  Fs: "fs",
  G:  "g",
  Gs: "ab",   // flat
  A:  "a",
  As: "bb",   // flat
  B:  "b",
};

/**
 * Maps an IntervalSymbol to its semitone offset from the tonic.
 */
export const INTERVAL_SEMITONES: Record<IntervalSymbol, number> = {
  T:  0,
  "2m": 1,
  "2M": 2,
  "3m": 3,
  "3M": 4,
  "4J": 5,
  "4A": 6,
  "5d": 6,
  "5J": 7,
  "5A": 8,
  "6m": 8,
  "6M": 9,
  "7m": 10,
  "7M": 11,
  "8": 12,
};

/** Interval display names for the grid label */
export const INTERVAL_LABELS: Record<IntervalSymbol, string> = {
  T:    "T",
  "2m": "2m",
  "2M": "2M",
  "3m": "3m",
  "3M": "3M",
  "4J": "4J",
  "4A": "4A",
  "5d": "5d",
  "5J": "5J",
  "5A": "5A",
  "6m": "6m",
  "6M": "6M",
  "7m": "7m",
  "7M": "7M",
  "8":  "8",
};

/** Chord tones for a major triad: T, 3M, 5J */
export const MAJOR_TRIAD_INTERVALS: IntervalSymbol[] = ["T", "3M", "5J"];

/** Chord tones for a minor triad: T, 3m, 5J */
export const MINOR_TRIAD_INTERVALS: IntervalSymbol[] = ["T", "3m", "5J"];

/** Major scale intervals (excluding octave to avoid confusing T/8 duplicates in pool) */
export const MAJOR_SCALE_INTERVALS: IntervalSymbol[] = [
  "T", "2M", "3M", "4J", "5J", "6M", "7M",
];

/** Natural minor scale intervals */
export const MINOR_SCALE_INTERVALS: IntervalSymbol[] = [
  "T", "2M", "3m", "4J", "5J", "6m", "7m",
];

/** All 12 chromatic intervals from tonic (no octave) */
export const CHROMATIC_INTERVALS: IntervalSymbol[] = [
  "T", "2m", "2M", "3m", "3M", "4J", "4A", "5J", "6m", "6M", "7m", "7M",
];

/** Range for melodic sequence length (inclusive) */
export const MELODIC_SEQUENCE_MIN = 2;
export const MELODIC_SEQUENCE_MAX = 4;
