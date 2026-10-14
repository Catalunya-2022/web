// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { OrgTable } from "@/components/content/org-table";
import { normalizeForSearch } from "@/lib/search-normalization";

const rows = [
  { name: "Generalitat de Catalunya", website: "https://gencat.cat" },
  { name: "Òmnium Cultural", website: null },
  { name: "Associació Catalana d'Universitats Públiques", website: null },
  { name: "Banco de España", website: "https://bde.es" },
  { name: "Fundació Bofill", website: null },
];

function filterLikeTheOldPropPath(query: string) {
  const q = normalizeForSearch(query);
  return rows
    .map((row) => ({ ...row, normalizedName: normalizeForSearch(row.name) }))
    .filter((row) => row.normalizedName.includes(q))
    .map((row) => row.name);
}

function listedNames() {
  return within(screen.getByRole("list")).getAllByRole("listitem").map((li) => li.querySelector("span")?.textContent);
}

afterEach(cleanup);

describe("OrgTable", () => {
  it.each(["Catala", "ÒMNIUM", "espana", "  fundacio  ", "ó"])(
    "filters %j exactly like the precomputed normalizedName prop did",
    async (query) => {
      const user = userEvent.setup();
      render(<OrgTable organizations={rows} locale="en" />);

      await user.type(screen.getByRole("textbox"), query);

      expect(listedNames()).toEqual(filterLikeTheOldPropPath(query));
      expect(listedNames().length).toBeGreaterThan(0);
    }
  );

  it("shows every organization while the query is empty", () => {
    render(<OrgTable organizations={rows} locale="en" />);
    expect(listedNames()).toEqual(rows.map((row) => row.name));
    expect(screen.getByText(`Showing ${rows.length} of ${rows.length} organizations`)).toBeInTheDocument();
  });
});
