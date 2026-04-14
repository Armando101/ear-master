interface ResultsActionBarProps {
  onRetake: () => void;
  onBackToSettings: () => void;
}

export default function ResultsActionBar({
  onRetake,
  onBackToSettings,
}: ResultsActionBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
      {/* Primary CTA */}
      <button
        type="button"
        onClick={onRetake}
        className="group relative w-full md:w-64 px-10 py-5 rounded-md font-headline font-black uppercase tracking-widest overflow-hidden transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #9ecaff 0%, #2196f3 100%)",
          color: "#001d36",
          boxShadow: "0 8px 24px rgba(33,150,243,0.2)",
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">refresh</span>
          Retake Exercises
        </span>
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>

      {/* Ghost CTA */}
      <button
        type="button"
        onClick={onBackToSettings}
        className="w-full md:w-64 px-10 py-5 rounded-md font-headline font-bold uppercase tracking-widest text-[#e5e2e1] transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-[#353535]"
        style={{
          background: "transparent",
          border: "1px solid #404752",
        }}
      >
        <span className="material-symbols-outlined">settings</span>
        Back to Settings
      </button>
    </div>
  );
}
