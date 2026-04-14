import type { TriadType, TetradType } from "@/features/training/domain/training.types";
import { TRIADS, TETRADS } from "@/features/training/domain/training.constants";
import ChordChip from "./ChordChip";

interface HarmonicBaseSectionProps {
  selectedTriads: TriadType[];
  selectedTetrads: TetradType[];
  onToggleTriad: (t: TriadType) => void;
  onToggleTetrad: (t: TetradType) => void;
  onSelectAllTriads: () => void;
  onSelectAllTetrads: () => void;
}

export default function HarmonicBaseSection({
  selectedTriads,
  selectedTetrads,
  onToggleTriad,
  onToggleTetrad,
  onSelectAllTriads,
  onSelectAllTetrads,
}: HarmonicBaseSectionProps) {
  return (
    <div className="bg-[#1c1b1b] p-8 rounded-xl">
      <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-[#ffe2ab]">layers</span>
        Harmonic Base
      </h3>

      <div className="space-y-8">
        {/* Triads */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <label className="font-label text-xs uppercase tracking-widest text-[#89919d]">
              Triads to practice
            </label>
            <button
              type="button"
              onClick={onSelectAllTriads}
              className="text-xs text-[#9ecaff] font-bold hover:underline"
            >
              Select All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRIADS.map(({ value, label }) => (
              <ChordChip
                key={value}
                label={label}
                selected={selectedTriads.includes(value)}
                onClick={() => onToggleTriad(value)}
              />
            ))}
          </div>
        </div>

        {/* Tetrads */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <label className="font-label text-xs uppercase tracking-widest text-[#89919d]">
              Tetrads to practice
            </label>
            <button
              type="button"
              onClick={onSelectAllTetrads}
              className="text-xs text-[#9ecaff] font-bold hover:underline"
            >
              Select All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {TETRADS.map(({ value, label }) => (
              <ChordChip
                key={value}
                label={label}
                selected={selectedTetrads.includes(value)}
                onClick={() => onToggleTetrad(value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
