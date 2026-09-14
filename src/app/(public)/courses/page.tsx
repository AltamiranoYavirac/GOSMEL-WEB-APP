import { getPublicSiteAssets } from "@/entities/site-asset";
import { CoursesList, getPublicCourses } from "@/features/courses";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { FinalCta } from "@/widgets/FinalCta";
import { PageHero } from "@/widgets/PageHero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cursos | GOSMEL Music Academy",
  description: "Cursos de música publicados por GOSMEL Music Academy.",
};

export default async function CoursesPage() {
  const [coursesResult, assetsResult] = await Promise.all([
    getPublicCourses(),
    getPublicSiteAssets(),
  ]);

  if (coursesResult.error) throw new Error(coursesResult.error);
  if (assetsResult.error) throw new Error(assetsResult.error);

  const assets = assetsResult.data ?? {};
  const hero = assets.page_hero_courses;
  const cta = assets.landing_cta;

  return (
    <div className="flex-1 bg-background">
      <PageHero
        image={buildCloudinaryImageUrl(hero?.publicId, "ar_16:9,c_fill,g_auto,w_1920,q_auto,f_auto")}
        imageAlt={hero?.alt}
        titleId="courses-title"
        eyebrow="Cursos · GOSMEL"
        title="Elige tu camino musical."
        description="Aprender se disfruta cuando el proceso te representa. Instrumento o lenguaje musical, a tu ritmo."
      />
      <CoursesList courses={coursesResult.data ?? []} />
      <FinalCta
        image={buildCloudinaryImageUrl(cta?.publicId, "ar_16:9,c_fill,g_south,w_1920,q_auto,f_auto")}
        imageAlt={cta?.alt}
        titleId="courses-cta-title"
        title="Tu próxima canción empieza aquí."
        description="Cuéntanos qué te gustaría aprender y te ayudamos a encontrar el curso que mejor se adapta a tu momento."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Hablar con nosotros", href: "/contact" }}
      />
    </div>
  );
}
