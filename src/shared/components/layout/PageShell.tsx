import type { ReactNode } from "react";
import TopAppBar from "@/shared/components/ui/TopAppBar";
import BottomNavBar from "@/shared/components/ui/BottomNavBar";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <>
      {/* Ambient decorative gradients */}
      <div className="ambient-right" aria-hidden="true" />
      <div className="ambient-left" aria-hidden="true" />

      <TopAppBar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 pb-28 md:pb-12">
        {children}
      </main>

      <BottomNavBar />
    </>
  );
}
