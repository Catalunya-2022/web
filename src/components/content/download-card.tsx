import { FileDown } from "lucide-react";

export function DownloadCard({
  title,
  description,
  href,
  disabled,
  className,
}: {
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
  className?: string;
}) {
  if (disabled || !href) {
    return (
      <div className={`flex flex-col gap-2 rounded-lg border border-dashed p-5 opacity-60${className ? ` ${className}` : ""}`}>
        <div className="flex items-center gap-2">
          <FileDown className="size-5 text-muted-foreground" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    );
  }

  return (
    <a
      href={href}
      download
      className={`group flex h-full flex-col gap-2 rounded-lg border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-accent${className ? ` ${className}` : ""}`}
    >
      <div className="flex items-center gap-2">
        <FileDown className="size-5 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </a>
  );
}
