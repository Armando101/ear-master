import { create } from "zustand";
import type {
  ExerciseConfig,
  IntervalSymbol,
  TriadType,
  TetradType,
  TargetNotes,
  SessionResult,
} from "@/features/training/domain/training.types";
import { DEFAULT_EXERCISE_COUNT } from "@/features/training/domain/training.constants";

interface TrainingState {
  config: ExerciseConfig;
  sessionResult: SessionResult | null;

  // Config actions
  toggleTriad: (triad: TriadType) => void;
  toggleTetrad: (tetrad: TetradType) => void;
  selectAllTriads: () => void;
  selectAllTetrads: () => void;
  setTargetNotes: (target: TargetNotes) => void;
  setScaleIntervals: (intervals: IntervalSymbol[]) => void;
  setExerciseCount: (count: number) => void;
  toggleMelodicSequence: () => void;

  // Result actions
  setSessionResult: (result: SessionResult) => void;
  clearSessionResult: () => void;
}

const ALL_TRIADS: TriadType[] = [
  "major",
  "minor",
  "sus2",
  "sus4",
  "augmented",
  "diminished",
];
const ALL_TETRADS: TetradType[] = ["maj7", "7", "maj6", "mMaj7", "m7"];

/**
 * Default scale intervals includes both major and minor quality-sensitive variants
 * (3M+3m, 6M+6m, 7M+7m) because the default triads selection is both major+minor.
 * In "both" mode, a chip like "3" requires ALL its symbols ["3M","3m"] to be present
 * to appear selected. Starting with both variants ensures all chips start selected.
 */
const DEFAULT_SCALE_INTERVALS: IntervalSymbol[] = [
  "T", "2M", "3M", "3m", "4J", "5J", "6M", "6m", "7M", "7m",
];

export const useTrainingStore = create<TrainingState>((set) => ({
  config: {
    triads: ["major", "minor"],
    tetrads: ["7", "m7"],
    targetNotes: "chordTones",
    scaleIntervals: DEFAULT_SCALE_INTERVALS,
    count: DEFAULT_EXERCISE_COUNT,
    melodicSequence: true,
  },
  sessionResult: null,

  toggleTriad: (triad) =>
    set((state) => {
      const exists = state.config.triads.includes(triad);
      const triads = exists
        ? state.config.triads.filter((t) => t !== triad)
        : [...state.config.triads, triad];
      return { config: { ...state.config, triads } };
    }),

  toggleTetrad: (tetrad) =>
    set((state) => {
      const exists = state.config.tetrads.includes(tetrad);
      const tetrads = exists
        ? state.config.tetrads.filter((t) => t !== tetrad)
        : [...state.config.tetrads, tetrad];
      return { config: { ...state.config, tetrads } };
    }),

  selectAllTriads: () =>
    set((state) => ({
      config: {
        ...state.config,
        triads:
          state.config.triads.length === ALL_TRIADS.length ? [] : ALL_TRIADS,
      },
    })),

  selectAllTetrads: () =>
    set((state) => ({
      config: {
        ...state.config,
        tetrads:
          state.config.tetrads.length === ALL_TETRADS.length ? [] : ALL_TETRADS,
      },
    })),

  setTargetNotes: (targetNotes) =>
    set((state) => ({ config: { ...state.config, targetNotes } })),

  setScaleIntervals: (scaleIntervals) =>
    set((state) => ({ config: { ...state.config, scaleIntervals } })),

  setExerciseCount: (count) =>
    set((state) => ({ config: { ...state.config, count } })),

  toggleMelodicSequence: () =>
    set((state) => ({
      config: {
        ...state.config,
        melodicSequence: !state.config.melodicSequence,
      },
    })),

  setSessionResult: (result) => set({ sessionResult: result }),
  clearSessionResult: () => set({ sessionResult: null }),
}));
