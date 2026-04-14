interface ChordChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function ChordChip({ label, selected, onClick }: ChordChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-body font-medium text-sm transition-all duration-200 ${
        selected
          ? "chip-active"
          : "bg-[#353535] text-[#bfc7d4] hover:bg-[#393939]"
      }`}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
