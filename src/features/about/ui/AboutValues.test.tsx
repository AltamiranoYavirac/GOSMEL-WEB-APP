import { render, screen } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { IAboutValue } from "../model/about.types";
import AboutValues from "./AboutValues";

vi.mock("@/shared/ui", () => ({
  Reveal: ({ as: Tag = "div", children }: { as?: ElementType; children: ReactNode }) => <Tag>{children}</Tag>,
}));

vi.mock("next/image", () => ({
  default: ({ fill, ...props }: ComponentPropsWithoutRef<"img"> & { fill?: boolean }) => {
    void fill;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...props} alt={props.alt ?? ""} />
    );
  },
}));

const ABOUT_VALUES: IAboutValue[] = ["Pasión", "Disciplina", "Innovación"].map((title) => ({
  title,
  description: `Descripción de ${title}`,
  imageUrl: `/${title}.jpg`,
  imageAlt: `Imagen de ${title}`,
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
