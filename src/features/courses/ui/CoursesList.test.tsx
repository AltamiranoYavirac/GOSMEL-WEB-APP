import { render, screen, within } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { IPublicCourseCard } from "../model/course-public.types";
import CoursesList from "./CoursesList";

vi.mock("@/shared/ui", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
  Avatar: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  AvatarImage: ({ alt }: { alt: string }) => <span>{alt}</span>,
  AvatarFallback: ({ children }: { children: ReactNode }) => <span>{children}</span>,
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

vi.mock("@iconify/react", () => ({ Icon: () => <span aria-hidden="true" /> }));

const COURSES: IPublicCourseCard[] = ["Piano", "Guitarra"].map((title, index) => ({
  id: `c${index}`,
  slug: title.toLowerCase(),
  title,
  category: "Instrumento",
  categoryValue: "instrumento",
  icon: "ph:music-notes",
  description: `Curso de ${title}`,
  learns: ["Técnica"],
  image: `/curso-${index}.jpg`,
  imageAlt: `Portada de ${title}`,
  priceLabel: index === 0 ? "Desde $40 / mes" : null,
  rating: index === 0 ? 4.5 : 0,
  totalReviews: index === 0 ? 12 : 0,
  teachers: [{
    id: `d${index}`,
    slug: `docente-${index}`,
    name: `Docente ${index}`,
    headline: "Docente",
    photo: `/docente-${index}.jpg`,
    photoAlt: `Retrato del docente ${index}`,
  }],
}));

describe("CoursesList", () => {
  it("muestra los cursos y enlaza imágenes, acciones y docentes", () => {
    render(<CoursesList courses={COURSES} />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(2);

    COURSES.forEach((course, index) => {
      const article = articles[index];
      expect(within(article).getByRole("heading", { name: course.title })).toBeVisible();
      expect(within(article).getByText(`${String(index + 1).padStart(2, "0")} / 02`)).toBeVisible();
      expect(within(article).getByRole("link", { name: `Ver el curso de ${course.title}` })).toHaveAttribute("href", `/courses/${course.slug}`);
      expect(within(article).getByRole("link", { name: "Ver curso" })).toHaveAttribute("href", `/courses/${course.slug}`);
      expect(within(article).getByRole("link", { name: new RegExp(`Docente ${index}`) })).toHaveAttribute("href", `/teachers/docente-${index}`);
      expect(within(article).getByRole("img", { name: course.imageAlt })).toHaveAttribute("loading", "lazy");
    });

    expect(within(articles[0]).getByText("Desde $40 / mes")).toBeVisible();
    expect(within(articles[1]).queryByText(/Desde/)).toBeNull();
  });
});
