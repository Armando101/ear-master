interface AccuracyRingProps {
  percentage: number;
}

export default function AccuracyRing({ percentage }: AccuracyRingProps) {
  // Guard against NaN / Infinity (e.g. 0 exercises done → 0/0)
  const safePercentage = Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg
        className="w-full h-full"
        style={{ transform: "rotate(-90deg)" }}
        viewBox="0 0 160 160"
        aria-label={`Accuracy: ${safePercentage}%`}
      >
        {/* Track */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="var(--color-surface-variant)"
          strokeWidth="8"
        />
        {/* Progress */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="var(--color-primary)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-headline text-4xl font-bold text-[var(--color-on-surface)]">
          {safePercentage}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)]">
          Accuracy
        </span>
      </div>
    </div>
  );
}
