type BrandLogoProps = { size?: "sm" | "default" };

export function BrandLogo({ size = "default" }: BrandLogoProps) {
  const triangleSize = size === "sm" ? "size-6" : "size-7";
  const textSize = size === "sm" ? "text-lg" : "text-xl";
  return (
    <>
      <div
        className={`gradient-animated ${triangleSize}`}
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
          backgroundImage:
            "linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-chart-3), var(--color-primary))",
        }}
        aria-hidden="true"
      />
      <span
        className={`font-heading ${textSize} font-extrabold tracking-tight`}
      >
        Catalunya 2022
      </span>
    </>
  );
}
