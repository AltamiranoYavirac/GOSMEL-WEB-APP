import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentPropsWithoutRef } from "react";
import { describe, expect, it, vi } from "vitest";

import AboutMedia from "./AboutMedia";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: ComponentPropsWithoutRef<"img"> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));

vi.mock("@iconify/react", () => ({
  Icon: () => <span aria-hidden="true" />,
}));

describe("AboutMedia", () => {
  it("muestra un póster y difiere el reproductor hasta que la persona decide reproducirlo", () => {
    const { container } = render(
      <AboutMedia
        src="https://example.com/concierto.mp4"
        poster="https://example.com/concierto.jpg"
        title="Concierto de estudiantes"
        aspect="video"
        sizes="100vw"
      />
    );

    expect(screen.getByRole("img", { name: "Vista previa: Concierto de estudiantes" })).toBeVisible();
    expect(container.querySelector("video")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Reproducir video: Concierto de estudiantes" }));

    expect(container.querySelector("video")).toHaveAttribute("autoplay");
    expect(container.querySelector("video")).toHaveAttribute("controls");
  });
});
