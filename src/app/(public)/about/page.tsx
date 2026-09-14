import { getPublicSiteAssets } from "@/entities/site-asset";
import {
  AboutBehindScenes,
  AboutConcerts,
  AboutHero,
  AboutTestimonials,
  AboutValues,
  ABOUT_TESTIMONIALS,
} from "@/features/about";
import { AppImages } from "@/shared/config";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { CtaPanel } from "@/widgets/CtaPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nosotros | GOSMEL Music Academy",
  description: "Conoce la esencia, la misión y los valores de GOSMEL Music Academy.",
};

export default async function AboutPage() {
  const { data: assets, error } = await getPublicSiteAssets();
  if (error) throw new Error(error);

  const hero = assets?.page_hero_about;
  const values = [
    {
      title: "Pasión",
      description: "El motor de nuestra creatividad y la chispa de vida a cada nota que interpretamos.",
      imageUrl: buildCloudinaryImageUrl(assets?.about_value_passion?.publicId, "ar_4:5,c_fill,g_auto,w_960,q_auto,f_auto"),
      imageAlt: assets?.about_value_passion?.alt ?? "",
    },
    {
      title: "Disciplina",
      description: "El camino riguroso hacia la maestría. Sin constancia, no existe el verdadero arte.",
      imageUrl: buildCloudinaryImageUrl(assets?.about_value_discipline?.publicId, "ar_4:5,c_fill,g_auto,w_960,q_auto,f_auto"),
      imageAlt: assets?.about_value_discipline?.alt ?? "",
    },
    {
      title: "Innovación",
      description: "Evolucionando el sonido del mañana mediante la exploración de nuevas fronteras sonoras.",
      imageUrl: buildCloudinaryImageUrl(assets?.about_value_innovation?.publicId, "ar_4:5,c_fill,g_auto,w_960,q_auto,f_auto"),
      imageAlt: assets?.about_value_innovation?.alt ?? "",
    },
  ].filter((value): value is typeof value & { imageUrl: string } => Boolean(value.imageUrl));

  return (
    <div className="flex-1 bg-background">
      <AboutHero
        image={buildCloudinaryImageUrl(hero?.publicId, "ar_16:9,c_fill,g_auto,w_1920,q_auto,f_auto")}
        imageAlt={hero?.alt ?? ""}
        eyebrow="Sobre nosotros"
        title="Una academia donde la música se vive."
        description="Más que aprender notas, construyes herramientas para expresarte con confianza y disfrutar cada etapa del proceso."
      />
      <AboutConcerts
        videoUrl={AppImages.ABOUT_VIDEO}
        posterUrl={AppImages.ABOUT_VIDEO_POSTER}
        videoTitle="La música también se vive en escena."
        description="Cada etapa cierra con una presentación en público: la oportunidad perfecta para consolidar lo aprendido, ganar confianza y celebrar tu evolución musical."
      />
      <AboutBehindScenes
        videoUrl={AppImages.ABOUT_VIDEO_PORTRAIT}
        posterUrl={AppImages.ABOUT_VIDEO_PORTRAIT_POSTER}
        videoTitle="Así se prepara cada presentación."
        description="Del salón de práctica al escenario: un vistazo cercano al proceso que viven nuestros estudiantes antes de cada concierto."
      />
      {values.length ? <AboutValues values={values} /> : null}
      <AboutTestimonials testimonials={ABOUT_TESTIMONIALS} />
      <CtaPanel
        titleId="about-cta-title"
        title="Tu próxima canción empieza aquí."
        description="Cuéntanos qué te gustaría aprender y te ayudamos a encontrar el curso que mejor se adapta a tu momento."
        primary={{ label: "Reservar clase de prueba", href: "/contact" }}
        secondary={{ label: "Hablar con nosotros", href: "/contact" }}
      />
    </div>
  );
}
