import { FileDown } from "lucide-react";

export function DownloadCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      download
      className="group flex h-full flex-col gap-2 rounded-lg border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-accent"
    >
      <div className="flex items-center gap-2">
        <FileDown className="size-5 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </a>
  );
}
