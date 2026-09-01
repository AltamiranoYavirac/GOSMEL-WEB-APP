import type { Metadata } from "next";

import { PublicCoursesCatalog } from "@/features/courses";

export const metadata: Metadata = {
  title: "Cursos | GOSMEL Music Academy",
  description:
    "Explora los cursos de piano, violín, guitarra, solfeo, charango y quena de GOSMEL Music Academy.",
};

export default function CoursesPage() {
  return <PublicCoursesCatalog />;
}