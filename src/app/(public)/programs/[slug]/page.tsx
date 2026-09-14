import { notFound } from "next/navigation";

import { getPublicSiteAssets } from "@/entities/site-asset";
import { getPublicProgramBySlug, ProgramDetail } from "@/features/programas";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { FinalCta } from "@/widgets/FinalCta";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: program } = await getPublicProgramBySlug(slug);

  if (!program) return {};
  return { title: `${program.title} | GOSMEL Music Academy`, description: program.description };
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ data: program, error }, assetsResult] = await Promise.all([
    getPublicProgramBySlug(slug),
    getPublicSiteAssets(),
  ]);

  if (error) throw new Error(error);
  if (assetsResult.error) throw new Error(assetsResult.error);
  if (!program) notFound();

  const cta = (assetsResult.data ?? {}).landing_cta;

  return (
    <div className="flex-1 bg-background">
      <ProgramDetail program={program} />
      <FinalCta
        image={buildCloudinaryImageUrl(cta?.publicId, "ar_16:9,c_fill,g_south,w_1920,q_auto,f_auto")}
        imageAlt={cta?.alt}
        titleId="program-cta-title"
        title="Tu próxima canción empieza aquí."
        description="Cuéntanos qué te gustaría aprender y te ayudamos a encontrar el camino que mejor se adapta a tu momento."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Ver cursos", href: "/courses" }}
      />
    </div>
  );
}
