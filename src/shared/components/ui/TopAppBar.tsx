import Link from "next/link";

export default function TopAppBar() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-6 h-16 w-full bg-[var(--color-background)]">
      {/* Branding */}
      <div className="flex items-center gap-4">
        <Link
          href="/training"
          className="font-headline tracking-[-0.02em] uppercase font-bold text-lg text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          THE ATELIER
        </Link>
      </div>

      {/* Profile avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: "var(--color-surface-variant)",
          border: `1px solid rgba(var(--rgb-outline-variant), 0.2)`,
        }}
      >
        <span
          className="material-symbols-outlined text-[var(--color-primary)] text-base"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          person
        </span>
      </div>
    </header>
  );
}
