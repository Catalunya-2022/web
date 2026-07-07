"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatUiString, uiStrings } from "@/lib/ui-strings";
import { normalizeForSearch } from "@/lib/search-normalization";
import type { Locale } from "@/i18n/routing";

type OrgForTable = {
  name: string;
  normalizedName: string;
  website: string | null;
};

export function OrgTable({ organizations, locale }: { organizations: OrgForTable[]; locale: Locale }) {
  const [query, setQuery] = useState("");
  const t = uiStrings[locale];

  const filtered = useMemo(() => {
    if (!query) return organizations;
    const q = normalizeForSearch(query);
    return organizations.filter((org) => org.normalizedName.includes(q));
  }, [organizations, query]);

  const showingText = formatUiString(t.showingOf, {
    count: filtered.length,
    total: organizations.length,
  });

  return (
    <div>
      <div className="relative mb-6 print:hidden">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.searchOrganizations}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label={t.searchOrganizations}
        />
      </div>

      <p
        className="mb-4 text-sm text-muted-foreground print:hidden"
        aria-live="polite"
      >
        {showingText}
      </p>

      <ul className="divide-y">
        {filtered.map((org) => (
          <li key={org.name} className="py-2.5">
            {org.website ? (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm transition-colors hover:text-primary"
              >
                <span>{org.name}</span>
                <ExternalLink className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ) : (
              <span className="text-sm">{org.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
