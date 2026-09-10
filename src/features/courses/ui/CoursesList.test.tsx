import { render, screen, within } from "@testing-library/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { COURSES } from "../model/courses.constants";
import type { ICourseCardTeacher } from "./CourseCard.types";
import CoursesList from "./CoursesList";

vi.mock("@/shared/ui", () => ({
  Reveal: ({ children }: { children: ReactNode }) => <>{children}</>,
  Avatar: ({ children }: { children: ReactNode }) => <span>{children}</span>,
  AvatarImage: ({ alt }: { alt: string }) => <span>{alt}</span>,
  AvatarFallback: ({ children }: { children: ReactNode }) => <span>{children}</span>,
}));

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: ComponentPropsWithoutRef<"img"> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}));

vi.mock("@iconify/react", () => ({
  Icon: () => <span aria-hidden="true" />,
}));

const teachersByCourse: Record<string, ICourseCardTeacher[]> = Object.fromEntries(
  COURSES.map((course, index) => [
    course.slug,
    [
      {
        slug: `docente-${index + 1}`,
        name: `Docente ${index + 1}`,
        photo: `/docente-${index + 1}.jpg`,
        photoAlt: `Retrato del docente ${index + 1}`,
      },
    ],
  ])
);

describe("CoursesList", () => {
  it("muestra los siete cursos y enlaza sus imágenes, acciones y docentes", () => {
    render(<CoursesList teachersByCourse={teachersByCourse} />);

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(7);

    COURSES.forEach((course, index) => {
      const article = articles[index];
      const courseHref = `/courses/${course.slug}`;
      const teacherHref = `/teachers/docente-${index + 1}`;

      expect(within(article).getByRole("heading", { name: course.title })).toBeVisible();
      expect(
        within(article).getByText(`${String(index + 1).padStart(2, "0")} / 07`)
      ).toBeVisible();
      expect(
        within(article).getByRole("link", { name: `Ver el curso de ${course.title}` })
      ).toHaveAttribute("href", courseHref);
      expect(within(article).getByRole("link", { name: "Ver curso" })).toHaveAttribute(
        "href",
        courseHref
      );
      expect(
        within(article).getByRole("link", { name: `Ver perfil de Docente ${index + 1}` })
      ).toHaveAttribute("href", teacherHref);
      expect(
        within(article).getByRole("img", { name: course.catalogImageAlt })
      ).toHaveAttribute("loading", "lazy");
    });
  });
});
