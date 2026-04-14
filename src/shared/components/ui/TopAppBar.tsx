import Link from "next/link";

export default function TopAppBar() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 w-full bg-[#131313]">
      {/* Branding */}
      <div className="flex items-center gap-4">
        <Link
          href="/training"
          className="font-headline tracking-[-0.02em] uppercase font-bold text-lg text-[#9ecaff] hover:opacity-80 transition-opacity"
        >
          THE ATELIER
        </Link>
      </div>

      {/* Profile avatar */}
      <div className="w-8 h-8 rounded-full bg-[#353535] flex items-center justify-center overflow-hidden border border-[#404752]/20">
        <span
          className="material-symbols-outlined text-[#9ecaff] text-base"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          person
        </span>
      </div>
    </header>
  );
}
