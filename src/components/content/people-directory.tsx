"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatUiString, uiStrings } from "@/lib/ui-strings";
import { normalizeForSearch } from "@/lib/search-normalization";
import type { Person } from "@/lib/data/people-consulted";
import type { Locale } from "@/i18n/routing";

type PersonDirectoryEntry = Person & {
  normalizedFirstName: string;
  normalizedLastName: string;
  groupLetter: string;
  stableKey: string;
};

export function PeopleDirectory({
  people,
  locale,
}: {
  people: PersonDirectoryEntry[];
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const t = uiStrings[locale];

  const filtered = useMemo(() => {
    if (!query) return people;
    const q = normalizeForSearch(query);
    return people.filter(
      (p) =>
        p.normalizedLastName.includes(q) ||
        p.normalizedFirstName.includes(q)
    );
  }, [people, query]);

  const groups = useMemo(() => {
    const map = new Map<string, PersonDirectoryEntry[]>();
    for (const p of filtered) {
      const key = p.groupLetter;
      const list = map.get(key);
      if (list) list.push(p);
      else map.set(key, [p]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div>
      <div className="relative mb-6 print:hidden">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.searchPeople}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
          aria-label={t.searchPeople}
        />
      </div>

      <p className="mb-6 text-sm text-muted-foreground print:hidden" aria-live="polite">
        {formatUiString(t.showingOfPeople, {
          count: filtered.length,
          total: people.length,
        })}
      </p>

      {groups.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {formatUiString(t.noResultsPeople, { query })}
        </p>
      )}

      <div>
        {groups.map(([letter, members]) => (
          <section key={letter} id={`letter-${letter}`} className="mt-10 first:mt-0">
            <h2 className="mb-4 border-b pb-1 text-lg font-bold text-primary">
              {letter}
            </h2>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((p) => (
                <li key={p.stableKey} className="text-sm">
                  {p.firstName} {p.lastName}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
