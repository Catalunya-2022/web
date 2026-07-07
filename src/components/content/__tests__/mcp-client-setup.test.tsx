// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { McpClientSetup } from "@/components/content/mcp-client-setup";
import type { McpClientConfig } from "@/lib/data/mcp";

const configs: McpClientConfig[] = [
  {
    id: "alpha",
    name: "Alpha",
    instructions: {
      ca: "Primer pas",
      en: "First step",
      es: "Primer paso",
    },
    code: "alpha command",
    language: "bash",
  },
  {
    id: "beta",
    name: "Beta",
    instructions: {
      ca: "Segon pas",
      en: "Second step",
      es: "Segundo paso",
    },
    code: "beta command",
    language: "bash",
    note: {
      ca: "Nota beta",
      en: "Beta note",
      es: "Nota beta",
    },
  },
];

describe("McpClientSetup", () => {
  it("keeps only one setup panel open at a time", async () => {
    const user = userEvent.setup();

    render(
      <McpClientSetup
        configs={configs}
        locale="en"
        labels={{ copyCommand: "Copy command" }}
      />
    );

    await user.click(screen.getByRole("button", { name: /Alpha/i }));
    expect(screen.getByText("First step")).toBeInTheDocument();
    expect(screen.queryByText("Second step")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Beta/i }));
    expect(screen.getByText("Second step")).toBeInTheDocument();
    expect(screen.getByText("Beta note")).toBeInTheDocument();
    expect(screen.queryByText("First step")).not.toBeInTheDocument();
  });
});
