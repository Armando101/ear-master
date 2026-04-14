interface ControlBarProps {
  onRepeat: () => void;
  onGiveContext: () => void;
}

export default function ControlBar({ onRepeat, onGiveContext }: ControlBarProps) {
  return (
    <div className="flex gap-4 flex-wrap justify-center">
      <button
        type="button"
        onClick={onRepeat}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-body font-bold text-sm uppercase tracking-wider text-[#bfc7d4] bg-[#2a2a2a] hover:bg-[#353535] transition-all"
      >
        <span className="material-symbols-outlined text-sm">replay</span>
        Repeat
      </button>
      <button
        type="button"
        onClick={onGiveContext}
        className="flex items-center gap-2 px-6 py-3 rounded-lg font-body font-bold text-sm uppercase tracking-wider text-[#bfc7d4] bg-[#2a2a2a] hover:bg-[#353535] transition-all"
      >
        <span className="material-symbols-outlined text-sm">info</span>
        Give Context
      </button>
    </div>
  );
}
