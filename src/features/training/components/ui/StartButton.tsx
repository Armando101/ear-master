interface StartButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function StartButton({ onClick, disabled = false }: StartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group w-full py-6 rounded-xl font-headline text-xl font-black tracking-widest uppercase flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{
        background: disabled
          ? "var(--color-surface-variant)"
          : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
        color: "var(--color-on-primary)",
        boxShadow: disabled
          ? "none"
          : `0 8px 32px rgba(var(--rgb-primary-container), 0.25)`,
      }}
    >
      START WORKSHOP
      <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
        arrow_forward
      </span>
    </button>
  );
}
