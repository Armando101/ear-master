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
                ? "bg-[#2a2a2a] ring-2 ring-[#ffbf00]/20"
                : "bg-[#1c1b1b] opacity-50"
            }`}
            style={!isLast ? { borderRight: "1px solid #131313" } : undefined}
          >
            {isActive && (
              <div className="absolute -top-3 left-4 bg-[#ffbf00] text-[#261a00] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter">
                Active
              </div>
            )}
            <span
              className={`font-headline text-[10px] uppercase tracking-widest ${
                isActive ? "text-[#ffe2ab]" : "text-[#bfc7d4]"
              }`}
            >
              Step {id}
            </span>
            <span
              className={`font-headline font-black uppercase tracking-tight ${
                isActive ? "text-[#ffe2ab] text-lg" : "text-[#e5e2e1] text-sm"
              }`}
            >
              {label}
            </span>
            {isDone && (
              <span className="material-symbols-outlined text-[#4edea3] text-[14px]">
                check_circle
              </span>
            )}
          </div>
        );
      })}
    </section>
  );
}
