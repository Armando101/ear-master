interface ExerciseProgressBarProps {
  current: number;
  total: number;
}

export default function ExerciseProgressBar({
  current,
  total,
}: ExerciseProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex flex-col items-end gap-2">
      <span className="font-headline text-[var(--color-on-surface-variant)] text-sm uppercase tracking-wider">
        Exercise {current} of {total}
      </span>
      <div
        className="w-48 h-1 rounded-full overflow-hidden"
        style={{ background: "var(--color-surface-container-high)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: "var(--color-primary)" }}
        />
      </div>
    </div>
  );
}
