export type TriadType =
  | "major"
  | "minor"
  | "sus2"
  | "sus4"
  | "augmented"
  | "diminished";

export type TetradType = "maj7" | "7" | "maj6" | "mMaj7" | "m7";

export type TargetNotes = "chordTones" | "scaleNotes" | "allChromatic";

export type IntervalSymbol =
  | "T"
  | "2m"
  | "2M"
  | "3m"
  | "3M"
  | "4J"
  | "4A"
  | "5d"
  | "5J"
  | "5A"
  | "6m"
  | "6M"
  | "7m"
  | "7M"
  | "8";

export type IntervalState = "default" | "correct" | "incorrect";

export type ExerciseStep = 1 | 2 | 3;

export interface ExerciseConfig {
  triads: TriadType[];
  tetrads: TetradType[];
  targetNotes: TargetNotes;
  /** Active when targetNotes === "scaleNotes": the subset of scale intervals to ask. */
  scaleIntervals: IntervalSymbol[];
  count: number;
  melodicSequence: boolean;
}

export interface ChordResult {
  name: string;
  correct: number;
  total: number;
}

export interface SessionResult {
  correct: number;
  total: number;
  timeElapsed: string;
  breakdown: ChordResult[];
  insight: string;
  /** Intervals practiced when targetNotes was "scaleNotes" */
  selectedScaleIntervals?: IntervalSymbol[];
}
