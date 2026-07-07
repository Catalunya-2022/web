export function SectionHeader({
  subtitle,
  title,
  id,
  children,
}: {
  subtitle: string;
  title: string;
  id?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        {subtitle}
      </p>
      <h2 id={id} className="mt-1 text-lg font-semibold">
        {title}
      </h2>
      {children}
    </div>
  );
}
