"use client";

import { useTrainingStore } from "@/store/trainingStore";
import type { IntervalSymbol } from "@/features/training/domain/training.types";
import { useExerciseSession } from "@/features/training/hooks/useExerciseSession";
import StepIndicator from "../ui/StepIndicator";
import ExerciseProgressBar from "../ui/ExerciseProgressBar";
import ResponseSlots from "../ui/ResponseSlots";
import ControlBar from "../ui/ControlBar";
import IntervalGrid from "../ui/IntervalGrid";

export default function ExerciseContainer() {
  const { config } = useTrainingStore();

  const {
    currentExercise,
    activeStep,
    question,
    slots,
    intervalStates,
    isAnswered,
    feedbackCorrect,
    isPlayingAudio,
    handleRepeat,
    handleGiveContext,
    handleIntervalSelect,
    handleClearLast,
    handleNext,
    handleEndSession,
  } = useExerciseSession();

  // Derive display values from question
  const contextLabel = question
    ? `${question.chord.quality === "major" ? "Major" : "Minor"} Triad`
    : "—";

  const chordName = question
    ? `Triad of ${question.chord.root.replace("s", "♯")}`
    : "Loading…";

  const targetLabel = question
    ? question.targetIntervals.join(" → ")
    : "";

  // The intervals shown in the grid come from the question's available pool
  const gridIntervals: { symbol: IntervalSymbol; name: string }[] = question
    ? question.availableIntervals.map((sym) => ({ symbol: sym, name: sym }))
    : [];

  return (
    <div className="w-full">
      {/* Context Banner, Progress & End Session */}
      <section className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-headline text-[var(--color-primary)] uppercase tracking-widest text-xs font-bold">
            Context: {contextLabel}
          </span>
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-on-surface)]">
            {config.melodicSequence ? "Melodic Sequence" : "Single Note"}
          </h1>
          <p className="font-headline text-lg font-medium text-[var(--color-on-surface-variant)] mt-1">
            {chordName}
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <ExerciseProgressBar current={currentExercise} total={config.count} />

          {/* End Session button */}
          <button
            type="button"
            onClick={handleEndSession}
            className="flex items-center gap-1.5 text-xs font-label font-bold uppercase tracking-widest transition-all px-3 py-1.5 rounded-lg"
            style={{
              color: "var(--color-error)",
              border: `1px solid rgba(var(--rgb-error), 0.35)`,
              background: `rgba(var(--rgb-error-container), 0.08)`,
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.color = "var(--color-on-error)";
              btn.style.borderColor = "transparent";
              btn.style.background = "var(--color-error)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.color = "var(--color-error)";
              btn.style.borderColor = `rgba(var(--rgb-error), 0.35)`;
              btn.style.background = `rgba(var(--rgb-error-container), 0.08)`;
            }}
          >
            <span className="material-symbols-outlined text-[14px] leading-none">stop_circle</span>
            End Session
          </button>
        </div>
      </section>

      {/* Step Indicator */}
      <StepIndicator activeStep={activeStep} />

      {/* Audio playing indicator */}
      {isPlayingAudio && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <span
            className="material-symbols-outlined text-[var(--color-secondary)] animate-pulse"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            music_note
          </span>
          <span className="text-sm font-label font-medium text-[var(--color-on-surface-variant)] uppercase tracking-widest">
            {activeStep === 1 ? "Playing context…" : "Listen…"}
          </span>
        </div>
      )}

      {/* Response Area */}
      <section className="flex flex-col items-center mb-10">
        {config.melodicSequence && (
          <ResponseSlots slots={slots} onClearLast={handleClearLast} />
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
                <strong>{targetLabel}</strong>
              </span>
            )}
          </div>
        )}

        <ControlBar
          onRepeat={handleRepeat}
          onGiveContext={handleGiveContext}
          disabled={isPlayingAudio}
        />
      </section>

      {/* Interval Grid */}
      <IntervalGrid
        intervals={gridIntervals}
        intervalStates={intervalStates}
        onSelect={handleIntervalSelect}
        disabled={isAnswered || activeStep < 3 || isPlayingAudio}
      />

      {/* Next button (appears after answering) */}
      {isAnswered && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={handleNext}
            className="px-12 py-4 rounded-xl font-headline font-black text-base uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
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
