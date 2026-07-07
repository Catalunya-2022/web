import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ca">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center font-sans">
        {/* No locale segment is available in this boundary, so fall back to the site's default language. */}
        <h1 className="text-2xl font-bold tracking-tight">Pàgina no trobada</h1>
        <p className="text-sm text-muted-foreground">
          <Link href="/" className="text-primary underline-offset-2 hover:underline">
            Tornar a l&apos;inici
          </Link>
        </p>
      </body>
    </html>
  );
}
