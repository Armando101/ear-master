import { create } from "zustand";
import type {
  ExerciseConfig,
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

export const useTrainingStore = create<TrainingState>((set) => ({
  config: {
    triads: ["major", "minor"],
    tetrads: ["7", "m7"],
    targetNotes: "chordTones",
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
    set((state) => ({ config: { ...state.config, triads: ALL_TRIADS } })),

  selectAllTetrads: () =>
    set((state) => ({ config: { ...state.config, tetrads: ALL_TETRADS } })),

  setTargetNotes: (targetNotes) =>
    set((state) => ({ config: { ...state.config, targetNotes } })),

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
