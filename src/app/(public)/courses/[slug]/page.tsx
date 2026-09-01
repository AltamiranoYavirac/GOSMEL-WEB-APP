import { notFound } from "next/navigation";

import { COURSES, COURSE_DETAILS, CourseDetail } from "@/features/courses";
import { getTeacherBySlug } from "@/features/teachers";
import { CtaPanel } from "@/widgets/CtaPanel";

export function generateStaticParams() {
  return COURSES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = COURSES.find((item) => item.slug === slug);

  if (!course) return {};

  return {
    title: `${course.title} | GOSMEL Music Academy`,
    description: course.description,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = COURSES.find((item) => item.slug === slug);
  const detail = COURSE_DETAILS[slug];

  if (!course || !detail) notFound();

  const teacher = getTeacherBySlug(detail.teacherSlug);

  if (!teacher) notFound();

  return (
    <div className="flex-1 bg-background">
      <CourseDetail
        course={course}
        detail={detail}
        teacher={{
          name: teacher.name,
          slug: teacher.slug,
          headline: `${teacher.headline} · ${teacher.education[0].title}`,
          photo: teacher.photo,
          photoAlt: teacher.photoAlt,
        }}
      />
      <CtaPanel
        titleId="course-cta-title"
        title={detail.ctaTitle}
        description="Reserva una clase de prueba gratuita y descubre cómo suena tu camino musical."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Ver otros cursos", href: "/courses" }}
      />
    </div>
  );
}
