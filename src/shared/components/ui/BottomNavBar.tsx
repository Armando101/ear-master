"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/training", icon: "music_note", label: "Training" },
  { href: "/library", icon: "menu_book", label: "Library" },
  { href: "/stats", icon: "analytics", label: "Stats" },
  { href: "/profile", icon: "person", label: "Profile" },
] as const;

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4"
      style={{
        background: "rgba(19,19,19,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(64,71,82,0.15)",
        boxShadow: "0 -8px 32px rgba(0,97,164,0.08)",
      }}
    >
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-0.5 transition-all"
            style={{ color: isActive ? "#ffe2ab" : "#353535" }}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {icon}
            </span>
            <span className="font-label text-[10px] font-semibold tracking-wider uppercase">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
