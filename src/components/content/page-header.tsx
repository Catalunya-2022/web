export function PageHeader({
  subtitle,
  title,
  description,
}: {
  subtitle: string;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        {subtitle}
      </p>
      <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        {title}
      </h1>
      {description != null && (
        <p className="mt-3 text-foreground/80">{description}</p>
      )}
    </header>
  );
}
