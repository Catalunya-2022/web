"use client";

import { useEffect } from "react";

// Replaces the root layout when it crashes, so it must render its own
// <html>/<body> and carry its own styles: the app CSS never loads here.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ca">
      <body>
        <style>{`
          body {
            margin: 0;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #F2F2F2;
            color: #252226;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            text-align: center;
          }
          main { padding: 2rem; }
          .brand {
            color: #BF1523;
            font-size: 0.875rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin: 0 0 0.75rem;
          }
          h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; }
          .alt { color: #6b6b6e; font-size: 0.95rem; margin: 0 0 1.75rem; }
          button {
            background: #BF1523;
            color: #ffffff;
            border: none;
            border-radius: 0.5rem;
            padding: 0.65rem 1.4rem;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
          }
          button:hover { background: #D95560; }
          @media (prefers-color-scheme: dark) {
            body { background: #252226; color: #F2F2F2; }
            .alt { color: #a3a3a6; }
          }
        `}</style>
        <main>
          <p className="brand">Catalunya 2022</p>
          <h1>Alguna cosa no ha anat b&eacute;</h1>
          <p className="alt">Something went wrong &middot; Algo no ha ido bien</p>
          <button onClick={reset}>Torna-ho a provar / Try again</button>
        </main>
      </body>
    </html>
  );
}
