import type { TriadType, TetradType, IntervalSymbol } from "./training.types";

export const TRIADS: { value: TriadType; label: string }[] = [
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "sus2", label: "sus2" },
  { value: "sus4", label: "sus4" },
  { value: "augmented", label: "Augmented" },
  { value: "diminished", label: "Diminished" },
];

export const TETRADS: { value: TetradType; label: string }[] = [
  { value: "maj7", label: "Maj7" },
  { value: "7", label: "7" },
  { value: "maj6", label: "Maj6" },
  { value: "mMaj7", label: "m(Maj7)" },
  { value: "m7", label: "m7" },
];

export const INTERVALS: { symbol: IntervalSymbol; name: string }[] = [
  { symbol: "T", name: "Tonic" },
  { symbol: "2M", name: "Maj 2nd" },
  { symbol: "3M", name: "Maj 3rd" },
  { symbol: "4J", name: "Perf 4th" },
  { symbol: "5J", name: "Perf 5th" },
  { symbol: "6M", name: "Maj 6th" },
  { symbol: "7M", name: "Maj 7th" },
  { symbol: "8", name: "Octave" },
];

export const INTERVALS_MINOR: { symbol: IntervalSymbol; name: string }[] = [
  { symbol: "T", name: "Tonic" },
  { symbol: "2M", name: "Maj 2nd" },
  { symbol: "3m", name: "Min 3rd" },
  { symbol: "4J", name: "Perf 4th" },
  { symbol: "5J", name: "Perf 5th" },
  { symbol: "6m", name: "Min 6th" },
  { symbol: "7m", name: "Min 7th" },
  { symbol: "8", name: "Octave" },
];

export const DEFAULT_EXERCISE_COUNT = 10;
