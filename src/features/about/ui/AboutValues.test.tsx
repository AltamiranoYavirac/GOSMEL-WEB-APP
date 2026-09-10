import { render, screen } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { ABOUT_VALUES } from "../model/about.constants";
import AboutValues from "./AboutValues";

vi.mock("@/shared/ui", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: ComponentPropsWithoutRef<"img"> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));

describe("AboutValues", () => {
  it("presenta los tres valores como capítulos numerados", () => {
    render(<AboutValues values={ABOUT_VALUES} />);

    expect(screen.getByRole("heading", { name: "La esencia de GOSMEL." })).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(3);

    ABOUT_VALUES.forEach((value, index) => {
      expect(screen.getByRole("heading", { name: value.title })).toBeVisible();
      expect(screen.getByText(String(index + 1).padStart(2, "0"))).toBeVisible();
      expect(screen.getByRole("img", { name: value.imageAlt })).toBeVisible();
    });
  });
});
