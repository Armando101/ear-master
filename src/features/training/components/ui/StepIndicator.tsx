import type { ExerciseStep } from "@/features/training/domain/training.types";

interface StepIndicatorProps {
  activeStep: ExerciseStep;
}

const STEPS: { id: ExerciseStep; label: string }[] = [
  { id: 1, label: "Sing" },
  { id: 2, label: "Listen" },
  { id: 3, label: "Choose" },
];

export default function StepIndicator({ activeStep }: StepIndicatorProps) {
  return (
    <section className="grid grid-cols-3 gap-1 mb-10">
      {STEPS.map(({ id, label }, index) => {
        const isActive = activeStep === id;
        const isDone = activeStep > id;
        const isFirst = index === 0;
        const isLast = index === STEPS.length - 1;

        return (
          <div
            key={id}
            className={`flex flex-col gap-2 py-3 px-4 relative ${
              isFirst ? "rounded-l-xl" : ""
            } ${isLast ? "rounded-r-xl" : ""} ${
              isActive
                ? "bg-[var(--color-surface-container-high)]"
                : "bg-[var(--color-surface-container-low)] opacity-50"
            }`}
            style={{
              ...(isActive
                ? { boxShadow: `0 0 0 2px rgba(var(--rgb-secondary-container), 0.2)` }
                : {}),
              ...(!isLast
                ? { borderRight: `1px solid var(--color-background)` }
                : {}),
            }}
          >
            {isActive && (
              <div className="absolute -top-3 left-4 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-fixed)] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">
                Active
              </div>
            )}
            <span
              className={`font-headline text-[10px] uppercase tracking-widest ${
                isActive ? "text-[var(--color-secondary)]" : "text-[var(--color-on-surface-variant)]"
              }`}
            >
              Step {id}
            </span>
            <span
              className={`font-headline font-black uppercase tracking-tight ${
                isActive
                  ? "text-[var(--color-secondary)] text-lg"
                  : "text-[var(--color-on-surface)] text-sm"
              }`}
            >
              {label}
            </span>
            {isDone && (
              <span className="material-symbols-outlined text-[var(--color-tertiary)] text-[14px]">
                check_circle
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}
