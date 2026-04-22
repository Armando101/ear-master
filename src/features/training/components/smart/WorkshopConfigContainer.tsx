"use client";

import { useRouter } from "next/navigation";
import { useTrainingStore } from "@/store/trainingStore";
import HarmonicBaseSection from "../ui/HarmonicBaseSection";
import TargetNotesSection from "../ui/TargetNotesSection";
import ExerciseModeSection from "../ui/ExerciseModeSection";
import StartButton from "../ui/StartButton";

export default function WorkshopConfigContainer() {
  const router = useRouter();
  const {
    config,
    toggleTriad,
    toggleTetrad,
    selectAllTriads,
    selectAllTetrads,
    setTargetNotes,
    setScaleIntervals,
    setExerciseCount,
    toggleMelodicSequence,
  } = useTrainingStore();

  const hasChordSelection = config.triads.length > 0 || config.tetrads.length > 0;

  // When "scaleNotes" is active, also require ≥ 2 intervals selected
  const scaleIntervalOk =
    config.targetNotes !== "scaleNotes" || config.scaleIntervals.length >= 2;

  const canStart = hasChordSelection && scaleIntervalOk;

  const handleStart = () => {
    router.push("/training/session");
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full mb-10">
        <p className="font-headline text-[var(--color-primary)] text-sm tracking-[0.2em] uppercase mb-2">
          Technical Drill
        </p>
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-on-surface)]">
          Workshop Configuration
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
        {/* Left Column */}
        <section className="md:col-span-7 flex flex-col gap-8">
          <HarmonicBaseSection
            selectedTriads={config.triads}
            selectedTetrads={config.tetrads}
            onToggleTriad={toggleTriad}
            onToggleTetrad={toggleTetrad}
            onSelectAllTriads={selectAllTriads}
            onSelectAllTetrads={selectAllTetrads}
          />
          <TargetNotesSection
            value={config.targetNotes}
            onChange={setTargetNotes}
            scaleIntervals={config.scaleIntervals}
            onScaleIntervalsChange={setScaleIntervals}
            selectedTriads={config.triads}
          />
        </section>

        {/* Right Column */}
        <aside className="md:col-span-5 flex flex-col gap-6">
          <ExerciseModeSection
            count={config.count}
            melodicSequence={config.melodicSequence}
            onCountChange={setExerciseCount}
            onToggleMelodicSequence={toggleMelodicSequence}
          />
          <StartButton onClick={handleStart} disabled={!canStart} />
        </aside>
      </div>
    </div>
  );
}
