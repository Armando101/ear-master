interface TechnicalInsightBannerProps {
  insight: string;
}

export default function TechnicalInsightBanner({ insight }: TechnicalInsightBannerProps) {
  return (
    <div
      className="rounded-xl p-8 mb-10 flex flex-col md:flex-row items-center gap-8"
      style={{
        background: "var(--color-surface-container-high)",
        borderLeft: "4px solid var(--color-secondary)",
      }}
    >
      <div className="flex-1">
        <h3 className="font-headline text-2xl font-bold mb-3 text-[var(--color-on-surface)]">
          Technical Insight
        </h3>
        <p className="text-[var(--color-on-surface-variant)] leading-relaxed">{insight}</p>
      </div>
      <div className="shrink-0 w-full md:w-auto">
        <button
          type="button"
          className="w-full md:w-auto px-8 py-4 rounded-md font-headline font-bold uppercase tracking-widest text-[var(--color-on-surface)] flex items-center justify-center gap-2 transition-all hover:bg-[var(--color-surface-bright)]"
          style={{
            background: "var(--color-surface-variant)",
            border: `1px solid rgba(var(--rgb-outline-variant), 0.2)`,
          }}
        >
          <span className="material-symbols-outlined text-sm">auto_graph</span>
          View Full History
        </button>
      </div>
    </div>
  );
}
