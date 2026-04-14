"use client";

import { useRouter } from "next/navigation";
import { useTrainingStore } from "@/store/trainingStore";
import AccuracyRing from "../ui/AccuracyRing";
import ChordBreakdownRow from "../ui/ChordBreakdownRow";
import TechnicalInsightBanner from "../ui/TechnicalInsightBanner";
import ResultsActionBar from "../ui/ResultsActionBar";

// Fallback mock data (shown when navigating directly to /training/results)
const MOCK_RESULT = {
  correct: 8,
  total: 10,
  timeElapsed: "12:44",
  breakdown: [
    { name: "Major Triad", correct: 3, total: 3 },
    { name: "Minor Triad", correct: 2, total: 3 },
    { name: "Maj7", correct: 2, total: 2 },
    { name: "sus4", correct: 1, total: 2 },
  ],
  insight:
    "Your identification of tension intervals (sus4) remains consistent but slow. Focus your next daily drill on 4th-interval resolution patterns to decrease identification time by an estimated 15%.",
};

export default function ResultsContainer() {
  const router = useRouter();
  const { sessionResult, clearSessionResult } = useTrainingStore();

  const result = sessionResult ?? MOCK_RESULT;
  const percentage = Math.round((result.correct / result.total) * 100);

  const handleRetake = () => {
    clearSessionResult();
    router.push("/training/session");
  };

  const handleBackToSettings = () => {
    clearSessionResult();
    router.push("/training");
  };

  return (
    <div className="w-full">
      {/* Asymmetric header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <div className="lg:col-span-8">
          <p className="font-headline text-[var(--color-secondary)] tracking-widest uppercase text-sm mb-2">
            Session Complete
          </p>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-6 text-[var(--color-on-surface)]">
            Workshop Completed
          </h1>
          <div className="flex items-baseline gap-4">
            <span className="font-headline text-7xl font-bold text-[var(--color-primary)]">
              {result.correct}/{result.total}
            </span>
            <span className="font-headline text-2xl text-[var(--color-on-surface-variant)]/60 uppercase">
              Correct
            </span>
          </div>
        </div>

        {/* Time card */}
        <div className="lg:col-span-4 flex flex-col justify-end">
          <div
            className="p-6 rounded-xl"
            style={{
              background: "var(--color-surface-container-low)",
              borderLeft: "4px solid var(--color-primary)",
            }}
          >
            <p className="text-sm text-[var(--color-on-surface-variant)] mb-1">Time Elapsed</p>
            <p className="font-headline text-2xl font-bold text-[var(--color-on-surface)]">
              {result.timeElapsed}
            </p>
          </div>
        </div>
      </div>

      {/* Bento Grid Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Accuracy ring */}
        <div
          className="md:col-span-1 p-8 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
          style={{ background: "var(--color-surface-container-low)" }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <span
              className="material-symbols-outlined text-8xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              analytics
            </span>
          </div>
          <AccuracyRing percentage={percentage} />
          <p className="mt-6 text-center text-sm font-medium text-[var(--color-on-surface-variant)]">
            {percentage >= 80
              ? "High precision maintained."
              : "Keep practising to improve accuracy."}
          </p>
        </div>

        {/* Breakdown list */}
        <div
          className="md:col-span-2 rounded-xl overflow-hidden"
          style={{ background: "var(--color-surface-container-low)" }}
        >
          <div
            className="p-6 flex justify-between items-center"
            style={{ borderBottom: `1px solid rgba(var(--rgb-outline-variant), 0.1)` }}
          >
            <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-[var(--color-on-surface)]">
              Technical Breakdown
            </h3>
            <span className="text-xs font-label text-[var(--color-on-surface-variant)]/60">
              {result.breakdown.length} PARAMETERS
            </span>
          </div>
          <div>
            {result.breakdown.map((row) => (
              <ChordBreakdownRow key={row.name} result={row} />
            ))}
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <TechnicalInsightBanner insight={result.insight} />

      {/* Action Buttons */}
      <ResultsActionBar
        onRetake={handleRetake}
        onBackToSettings={handleBackToSettings}
      />

      {/* Decorative fretboard strings (desktop) */}
      <div className="fixed bottom-0 right-0 w-1/3 h-2/3 pointer-events-none opacity-5 overflow-hidden hidden lg:block">
        <div className="flex h-full gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-px h-full"
              style={{ background: "var(--color-surface-bright)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
