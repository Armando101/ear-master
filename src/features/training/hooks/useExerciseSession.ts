"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useTrainingStore } from "@/store/trainingStore";
import type { IntervalSymbol, IntervalState, ExerciseStep } from "@/features/training/domain/training.types";
import type { ExerciseQuestion } from "@/features/training/domain/music.types";
import type { PitchClass } from "@/features/training/domain/music.types";
import { generateQuestion } from "@/features/training/domain/session.engine";
import { transposePitch, intervalToSemitones } from "@/features/training/domain/music.rules";
import { audioService } from "@/features/training/services/audio.service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExerciseSessionState {
  currentExercise: number;
  activeStep: ExerciseStep;
  question: ExerciseQuestion | null;
  slots: (IntervalSymbol | null)[];
  intervalStates: Partial<Record<IntervalSymbol, IntervalState>>;
  isAnswered: boolean;
  feedbackCorrect: boolean | null;
  isPlayingAudio: boolean;
  correctCount: number;
}

export interface ExerciseSessionActions {
  handleRepeat: () => void;
  handleGiveContext: () => void;
  handleIntervalSelect: (symbol: IntervalSymbol) => void;
  handleClearLast: () => void;
  handleNext: () => void;
  handleEndSession: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildEmptySlots(count: number): (IntervalSymbol | null)[] {
  return Array<IntervalSymbol | null>(count).fill(null);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useExerciseSession(): ExerciseSessionState & ExerciseSessionActions {
  const router = useRouter();
  const { config, setSessionResult } = useTrainingStore();

  // We use a ref to track the initial question generation across StrictMode double-mount
  const initializedRef = useRef(false);

  const [currentExercise, setCurrentExercise] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [activeStep, setActiveStep] = useState<ExerciseStep>(1);
  const [question, setQuestion] = useState<ExerciseQuestion | null>(null);
  const [slots, setSlots] = useState<(IntervalSymbol | null)[]>([null]);
  const [intervalStates, setIntervalStates] = useState<Partial<Record<IntervalSymbol, IntervalState>>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // ---------------------------------------------------------------------------
  // Audio orchestration
  // ---------------------------------------------------------------------------

  const playContext = useCallback(async (q: ExerciseQuestion) => {
    setIsPlayingAudio(true);
    await audioService.playContext(q.chord.root, q.chord.quality);
    setIsPlayingAudio(false);
    setActiveStep(2);

    // Auto-play the note(s) after context finishes
    setIsPlayingAudio(true);
    for (const interval of q.targetIntervals) {
      const semitones = intervalToSemitones(interval);
      const notePitch: PitchClass = transposePitch(q.chord.root, semitones);
      await audioService.playNote(notePitch);
    }
    setIsPlayingAudio(false);
    setActiveStep(3);
  }, []);

  const playNoteOnly = useCallback(async (q: ExerciseQuestion) => {
    setIsPlayingAudio(true);
    for (const interval of q.targetIntervals) {
      const semitones = intervalToSemitones(interval);
      const notePitch: PitchClass = transposePitch(q.chord.root, semitones);
      await audioService.playNote(notePitch);
    }
    setIsPlayingAudio(false);
  }, []);

  // ---------------------------------------------------------------------------
  // Question initialization
  // ---------------------------------------------------------------------------

  const startNewQuestion = useCallback(
    (q: ExerciseQuestion) => {
      const slotCount = config.melodicSequence ? q.targetIntervals.length : 1;
      setQuestion(q);
      setSlots(buildEmptySlots(slotCount));
      setIntervalStates({});
      setIsAnswered(false);
      setFeedbackCorrect(null);
      setActiveStep(1);
      playContext(q);
    },
    [config.melodicSequence, playContext]
  );

  // Initialize first question on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const q = generateQuestion(config);
    startNewQuestion(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Answer verification
  // ---------------------------------------------------------------------------

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ["#9ecaff", "#4edea3", "#ffe2ab", "#ffbf00"],
    });
  }, []);

  const checkAnswer = useCallback(
    (filledSlots: (IntervalSymbol | null)[], targetIntervals: IntervalSymbol[]) => {
      const answer = filledSlots.filter(Boolean) as IntervalSymbol[];
      const isCorrect =
        answer.length === targetIntervals.length &&
        answer.every((v, i) => v === targetIntervals[i]);

      const newStates: Partial<Record<IntervalSymbol, IntervalState>> = {};
      answer.forEach((sym, i) => {
        newStates[sym] = sym === targetIntervals[i] ? "correct" : "incorrect";
      });

      setIntervalStates(newStates);
      setIsAnswered(true);
      setFeedbackCorrect(isCorrect);
      if (isCorrect) {
        setCorrectCount((n) => n + 1);
        fireConfetti();
      }
    },
    [fireConfetti]
  );

  // Auto-verify when all slots are filled
  const slotsNeeded = question && config.melodicSequence ? question.targetIntervals.length : 1;
  const currentSlots = slots.slice(0, slotsNeeded);
  const allFilled = currentSlots.every((s) => s !== null);

  useEffect(() => {
    if (allFilled && !isAnswered && question) {
      checkAnswer(currentSlots, question.targetIntervals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilled]);

  // ---------------------------------------------------------------------------
  // Results
  // ---------------------------------------------------------------------------

  const pushResults = useCallback(
    (doneCount: number, doneCorrect: number) => {
      // Build breakdown per chord quality actually encountered
      setSessionResult({
        correct: doneCorrect,
        total: doneCount,
        timeElapsed: "—",
        breakdown: [
          { name: "Major Triad", correct: 0, total: 0 },
          { name: "Minor Triad", correct: 0, total: 0 },
        ],
        insight:
          doneCorrect / Math.max(doneCount, 1) >= 0.8
            ? "Great precision! Keep up the consistency in future sessions."
            : "Keep practising — focus on slow, deliberate listening before answering.",
      });
      router.push("/training/results");
    },
    [setSessionResult, router]
  );

  // ---------------------------------------------------------------------------
  // Public actions
  // ---------------------------------------------------------------------------

  const handleRepeat = useCallback(() => {
    if (!question || isPlayingAudio) return;
    playNoteOnly(question);
  }, [question, isPlayingAudio, playNoteOnly]);

  const handleGiveContext = useCallback(() => {
    if (!question || isPlayingAudio) return;
    // Reset feedback state so user can answer again after re-listening
    setIsAnswered(false);
    setFeedbackCorrect(null);
    setIntervalStates({});
    setSlots(buildEmptySlots(slotsNeeded));
    setActiveStep(1);
    playContext(question);
  }, [question, isPlayingAudio, slotsNeeded, playContext]);

  const handleIntervalSelect = useCallback(
    (symbol: IntervalSymbol) => {
      if (isAnswered || !question) return;
      if (!config.melodicSequence) {
        const newSlots: (IntervalSymbol | null)[] = [symbol];
        setSlots(newSlots);
        checkAnswer(newSlots, question.targetIntervals);
        return;
      }
      const nextEmpty = currentSlots.findIndex((s) => s === null);
      if (nextEmpty === -1) return;
      const updated = [...slots];
      updated[nextEmpty] = symbol;
      setSlots(updated);
    },
    [isAnswered, question, config.melodicSequence, currentSlots, slots, checkAnswer]
  );

  const handleClearLast = useCallback(() => {
    if (isAnswered) return;
    const lastFilled = [...currentSlots].reverse().findIndex((s) => s !== null);
    if (lastFilled === -1) return;
    const realIndex = slotsNeeded - 1 - lastFilled;
    const updated = [...slots];
    updated[realIndex] = null;
    setSlots(updated);
  }, [isAnswered, currentSlots, slots, slotsNeeded]);

  const handleNext = useCallback(() => {
    audioService.stop();
    if (currentExercise >= config.count) {
      pushResults(config.count, correctCount);
      return;
    }
    const nextExercise = currentExercise + 1;
    setCurrentExercise(nextExercise);
    const q = generateQuestion(config);
    startNewQuestion(q);
  }, [currentExercise, config, correctCount, pushResults, startNewQuestion]);

  const handleEndSession = useCallback(() => {
    audioService.stop();
    const doneCount = isAnswered ? currentExercise : currentExercise - 1;
    pushResults(Math.max(doneCount, 0), correctCount);
  }, [isAnswered, currentExercise, correctCount, pushResults]);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    // State
    currentExercise,
    activeStep,
    question,
    slots: currentSlots,
    intervalStates,
    isAnswered,
    feedbackCorrect,
    isPlayingAudio,
    correctCount,
    // Actions
    handleRepeat,
    handleGiveContext,
    handleIntervalSelect,
    handleClearLast,
    handleNext,
    handleEndSession,
  };
}
