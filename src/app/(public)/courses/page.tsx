import { CoursesList, COURSES } from "@/features/courses";
import type { ICourseCardTeacher } from "@/features/courses";
import { TEACHERS } from "@/features/teachers";
import { AppImages } from "@/shared/config";
import { FinalCta } from "@/widgets/FinalCta";
import { PageHero } from "@/widgets/PageHero";

export const metadata = {
  title: "Cursos | GOSMEL Music Academy",
  description:
    "Siete programas de música en Quito: piano, violín, guitarra, guitarra eléctrica, solfeo, charango y quena.",
};

const teachersByCourse: Record<string, ICourseCardTeacher[]> = Object.fromEntries(
  COURSES.map((course) => [
    course.slug,
    TEACHERS.filter((teacher) => teacher.courseSlug === course.slug).map((teacher) => ({
      slug: teacher.slug,
      name: teacher.name,
      photo: teacher.photo,
      photoAlt: teacher.photoAlt,
    })),
  ])
);

export default function CoursesPage() {
  return (
    <div className="flex-1 bg-background">
      <PageHero
        image={AppImages.PAGE_HERO_COURSES}
        imageAlt="Estudiante interpretando piano en un concierto de GOSMEL"
        titleId="courses-title"
        eyebrow="Cursos · GOSMEL"
        title="Elige tu camino musical."
        description="Aprender se disfruta cuando el proceso te representa. Instrumento o lenguaje musical, a tu ritmo."
      />
      <CoursesList teachersByCourse={teachersByCourse} />
      <FinalCta
        image={AppImages.LANDING_CTA}
        imageAlt="Estudiantes de GOSMEL agradeciendo al público al final de un concierto"
        titleId="courses-cta-title"
        title="Tu próxima canción empieza aquí."
        description="Cuéntanos qué te gustaría aprender y te ayudamos a encontrar el curso que mejor se adapta a tu momento."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Hablar con nosotros", href: "/contact" }}
      />
    </div>
  );
}
