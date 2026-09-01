import { ContactForm, ContactInfo } from "@/features/contact";
import { AppImages } from "@/shared/config";
import { CtaPanel } from "@/widgets/CtaPanel";
import { PageHero } from "@/widgets/PageHero";

export const metadata = {
  title: "Contacto | GOSMEL Music Academy",
  description:
    "Ponte en contacto con la academia musical GOSMEL en Quito. Solicita información sobre cursos de piano, guitarra, violín, canto y solfeo.",
};

export default function ContactPage() {
  return (
    <div className="flex-1 bg-background">
      <PageHero
        image={AppImages.PAGE_HERO_CONTACT}
        imageAlt="Estudiante de canto en una clase de GOSMEL"
        titleId="contact-title"
        eyebrow="Contacto · Quito, Ecuador"
        title="Hablemos de tu música."
        description="Estamos aquí para acompañarte en tu viaje musical. Escríbenos para más información o resolver cualquier duda sobre nuestros programas."
      />

      <section className="bg-background pb-[70px] pt-[52px] md:pb-[110px] md:pt-[70px]">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-3.5 px-[22px] md:px-14 lg:grid-cols-[0.85fr_1fr]">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>

      <CtaPanel
        titleId="contact-cta-title"
        title="¿Listo para subir al escenario?"
        description="Reserva una clase de prueba gratuita y descubre cómo suena tu camino musical junto a nuestros maestros."
        primary={{ label: "Reservar clase de prueba", href: "/register" }}
        secondary={{ label: "Explorar cursos", href: "/courses" }}
      />
    </div>
  );
}
