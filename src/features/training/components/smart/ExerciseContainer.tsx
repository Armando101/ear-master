"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { useTrainingStore } from "@/store/trainingStore";
import type {
  IntervalSymbol,
  IntervalState,
  ExerciseStep,
} from "@/features/training/domain/training.types";
import { INTERVALS } from "@/features/training/domain/training.constants";
import StepIndicator from "../ui/StepIndicator";
import ExerciseProgressBar from "../ui/ExerciseProgressBar";
import ResponseSlots from "../ui/ResponseSlots";
import ControlBar from "../ui/ControlBar";
import IntervalGrid from "../ui/IntervalGrid";

// Mock answer for the demo — in real implementation this comes from the session engine
const MOCK_ANSWER: IntervalSymbol[] = ["T", "5J"];
const MOCK_CONTEXT_LABEL = "MAJOR TRIAD";
const MOCK_CHORD_NAME = "Triad of C";

export default function ExerciseContainer() {
  const router = useRouter();
  const { config, setSessionResult } = useTrainingStore();

  const [currentExercise, setCurrentExercise] = useState(1);
  const [activeStep, setActiveStep] = useState<ExerciseStep>(3);
  const [slots, setSlots] = useState<(IntervalSymbol | null)[]>(() =>
    config.melodicSequence ? [null, null, null] : [null]
  );
  const [intervalStates, setIntervalStates] = useState<
    Partial<Record<IntervalSymbol, IntervalState>>
  >({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedbackCorrect, setFeedbackCorrect] = useState<boolean | null>(null);

  const slotsNeeded = config.melodicSequence ? MOCK_ANSWER.length : 1;
  const currentSlots = slots.slice(0, slotsNeeded);
  const filledCount = currentSlots.filter(Boolean).length;
  const allFilled = filledCount === slotsNeeded;

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      // Use raw hex values here — canvas-confetti does not support CSS variables
      colors: ["#9ecaff", "#4edea3", "#ffe2ab", "#ffbf00"],
    });
  }, []);

  const checkAnswer = useCallback(
    (filledSlots: (IntervalSymbol | null)[]) => {
      const answer = filledSlots.filter(Boolean) as IntervalSymbol[];
      const isCorrect = answer.every((v, i) => v === MOCK_ANSWER[i]);
      const newStates: Partial<Record<IntervalSymbol, IntervalState>> = {};
      answer.forEach((sym, i) => {
        newStates[sym] = sym === MOCK_ANSWER[i] ? "correct" : "incorrect";
      });
      setIntervalStates(newStates);
      setIsAnswered(true);
      setFeedbackCorrect(isCorrect);
      if (isCorrect) fireConfetti();
    },
    [fireConfetti]
  );

  // Auto-verify when all slots are filled
  useEffect(() => {
    if (allFilled && !isAnswered) {
      checkAnswer(currentSlots);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilled]);

  const handleIntervalSelect = (symbol: IntervalSymbol) => {
    if (isAnswered) return;
    if (!config.melodicSequence) {
      // Single note — immediate answer
      const newSlots = [symbol];
      setSlots([symbol]);
      checkAnswer(newSlots);
      return;
    }
    // Fill next empty slot
    const nextEmpty = currentSlots.findIndex((s) => s === null);
    if (nextEmpty === -1) return;
    const updated = [...slots];
    updated[nextEmpty] = symbol;
    setSlots(updated);
  };

  const handleClearLast = () => {
    if (isAnswered) return;
    const lastFilled = [...currentSlots].reverse().findIndex((s) => s !== null);
    if (lastFilled === -1) return;
    const realIndex = slotsNeeded - 1 - lastFilled;
    const updated = [...slots];
    updated[realIndex] = null;
    setSlots(updated);
  };

  const handleNext = () => {
    if (currentExercise >= config.count) {
      // Go to results with mock data
      setSessionResult({
        correct: Math.floor(config.count * 0.8),
        total: config.count,
        timeElapsed: "12:44",
        breakdown: [
          { name: "Major Triad", correct: 3, total: 3 },
          { name: "Minor Triad", correct: 2, total: 3 },
          { name: "Maj7", correct: 2, total: 2 },
          { name: "sus4", correct: 1, total: 2 },
        ],
        insight:
          "Your identification of tension intervals (sus4) remains consistent but slow. Focus on 4th-interval resolution patterns.",
      });
      router.push("/training/results");
      return;
    }
    // Reset for next exercise
    setCurrentExercise((n) => n + 1);
    setSlots(config.melodicSequence ? [null, null, null] : [null]);
    setIntervalStates({});
    setIsAnswered(false);
    setFeedbackCorrect(null);
    setActiveStep(3);
  };

  return (
    <div className="w-full">
      {/* Context Banner & Progress */}
      <section className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-headline text-[var(--color-primary)] uppercase tracking-widest text-xs font-bold">
            Context: {MOCK_CONTEXT_LABEL}
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-on-surface)]">
            {config.melodicSequence ? "Melodic Sequence" : "Single Note"}
          </h1>
          <p className="font-headline text-lg font-medium text-[var(--color-on-surface-variant)] mt-1">
            {MOCK_CHORD_NAME}
          </p>
        </div>
        <ExerciseProgressBar
          current={currentExercise}
          total={config.count}
        />
      </section>

      {/* Step Indicator */}
      <StepIndicator activeStep={activeStep} />

      {/* Response Area */}
      <section className="flex flex-col items-center mb-10">
        {config.melodicSequence && (
          <ResponseSlots
            slots={currentSlots}
            onClearLast={handleClearLast}
          />
        )}

        {/* Feedback banner */}
        {isAnswered && feedbackCorrect !== null && (
          <div
            className="w-full max-w-lg rounded-xl px-6 py-4 mb-6 text-center font-headline font-bold text-lg transition-all duration-300"
            style={{
              background: feedbackCorrect
                ? `rgba(var(--rgb-tertiary-container), 0.15)`
                : `rgba(var(--rgb-error-container), 0.15)`,
              border: feedbackCorrect
                ? `1px solid rgba(var(--rgb-tertiary), 0.3)`
                : `1px solid rgba(var(--rgb-error), 0.3)`,
              color: feedbackCorrect
                ? "var(--color-tertiary)"
                : "var(--color-error)",
            }}
          >
            {feedbackCorrect ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                Correct!
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">cancel</span>
                The answer was:{" "}
                <strong>{MOCK_ANSWER.join(" → ")}</strong>
              </span>
            )}
          </div>
        )}

        <ControlBar
          onRepeat={() => {}}
          onGiveContext={() => setActiveStep(1)}
        />
      </section>

      {/* Interval Grid */}
      <IntervalGrid
        intervals={INTERVALS}
        intervalStates={intervalStates}
        onSelect={handleIntervalSelect}
        disabled={isAnswered && !allFilled}
      />

      {/* Next button (appears after answering) */}
      {isAnswered && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleNext}
            className="px-12 py-4 rounded-xl font-headline font-black text-base uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
              color: "var(--color-on-primary)",
              boxShadow: `0 8px 32px rgba(var(--rgb-primary-container), 0.25)`,
            }}
          >
            {currentExercise >= config.count ? "See Results" : "Next Exercise"}{" "}
            <span className="inline-block ml-2">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
