import type { IntervalSymbol } from "./training.types";

export type PitchClass =
  | "C"
  | "Cs"
  | "D"
  | "Ds"
  | "E"
  | "F"
  | "Fs"
  | "G"
  | "Gs"
  | "A"
  | "As"
  | "B";

export type ChordQuality = "major" | "minor";

export interface Chord {
  root: PitchClass;
  quality: ChordQuality;
}

export interface ExerciseQuestion {
  chord: Chord;
  /** The correct answer (one interval, or a sequence of intervals for melodic mode) */
  targetIntervals: IntervalSymbol[];
  /** Options shown to the user in the interval grid */
  availableIntervals: IntervalSymbol[];
}
