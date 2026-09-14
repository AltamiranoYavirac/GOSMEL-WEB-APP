import { getPublicSiteAssets } from "@/entities/site-asset";
import { getPublicPrograms, ProgramsCatalog } from "@/features/programas";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { FinalCta } from "@/widgets/FinalCta";
import { PageHero } from "@/widgets/PageHero";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Programas | GOSMEL Music Academy",
  description: "Programas formativos que combinan cursos de GOSMEL Music Academy.",
};

export default async function ProgramsPage() {
  const [programsResult, assetsResult] = await Promise.all([
    getPublicPrograms(),
    getPublicSiteAssets(),
  ]);

  if (programsResult.error) throw new Error(programsResult.error);
  if (assetsResult.error) throw new Error(assetsResult.error);

  const assets = assetsResult.data ?? {};
  const hero = assets.page_hero_programs;
  const cta = assets.landing_cta;

  return (
    <div className="flex-1 bg-background">
      <PageHero
        image={buildCloudinaryImageUrl(hero?.publicId, "ar_16:9,c_fill,g_auto,w_1920,q_auto,f_auto")}
        imageAlt={hero?.alt}
        titleId="programs-title"
        eyebrow="Programas · GOSMEL"
        title="Un solo camino, varios cursos."
        description="Rutas formativas que combinan cursos para llevarte de un nivel al siguiente con un objetivo claro."
      />
      <ProgramsCatalog programs={programsResult.data ?? []} />
      <FinalCta
        image={buildCloudinaryImageUrl(cta?.publicId, "ar_16:9,c_fill,g_south,w_1920,q_auto,f_auto")}
        imageAlt={cta?.alt}
        titleId="programs-cta-title"
        title="Tu próxima canción empieza aquí."
        description="Cuéntanos qué te gustaría aprender y te ayudamos a encontrar el programa que mejor se adapta a tu momento."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Hablar con nosotros", href: "/contact" }}
      />
    </div>
  );
}
