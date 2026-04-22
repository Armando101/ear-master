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

/** Octave number (e.g. 3 for the default middle-register octave). */
export type Octave = number;

/**
 * A fully-resolved note: pitch class + octave.
 * E.g. { pitch: "Cs", octave: 4 } → file "Cs4.mp3"
 */
export interface PitchNote {
  pitch: PitchClass;
  octave: Octave;
}

export type ChordQuality = "major" | "minor";

export interface Chord {
  root: PitchClass;
  /** The octave of the tonic (determines which audio files are used). */
  octave: Octave;
  quality: ChordQuality;
}

export interface ExerciseQuestion {
  chord: Chord;
  /** The correct answer (one interval, or a sequence of intervals for melodic mode) */
  targetIntervals: IntervalSymbol[];
  /** Options shown to the user in the interval grid */
  availableIntervals: IntervalSymbol[];
}
