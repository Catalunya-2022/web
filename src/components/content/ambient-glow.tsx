export function AmbientGlow() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden"
      style={{ contain: "layout style paint" }}
      aria-hidden="true"
    >
      <div
        className="absolute -left-16 -top-16 size-[500px] rounded-full opacity-[0.15] blur-[60px] will-change-transform md:blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary), transparent 70%)",
          animation: "blob-drift-1 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-16 -top-16 size-[400px] rounded-full opacity-[0.12] blur-[60px] will-change-transform md:blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-secondary), transparent 70%)",
          animation: "blob-drift-2 29s ease-in-out infinite",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}
