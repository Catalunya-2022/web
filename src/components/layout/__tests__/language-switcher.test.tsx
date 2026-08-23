// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const push = vi.fn();
let pathname = "/en/introduction";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({
    children,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  DropdownMenuContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    push.mockReset();
    pathname = "/en/introduction";
    document.cookie = "";
  });

  it("sets the locale cookie and navigates to the localized route", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcher currentLocale="en" />);

    await user.click(screen.getByRole("button", { name: "Español" }));

    expect(document.cookie).toContain("NEXT_LOCALE=es");
    expect(push).toHaveBeenCalledWith("/es/introduccion");
  });

  it("does not navigate when the current locale is selected", async () => {
    const user = userEvent.setup();

    render(<LanguageSwitcher currentLocale="en" />);

    await user.click(screen.getAllByRole("button", { name: "English" })[1]);

    expect(push).not.toHaveBeenCalled();
  });
});
