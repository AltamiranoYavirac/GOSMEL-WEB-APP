import { ContactForm, ContactHighlights, ContactInfo } from "@/features/contact";

const CONTACT_PHONE = "+593 98 602 3191";
const CONTACT_EMAIL = "andymelabur@gmail.com";

export const metadata = {
  title: "Contacto | GOSMEL Music Academy",
  description:
    "Ponte en contacto con la academia musical GOSMEL en Quito. Solicita información sobre cursos de piano, guitarra, violín, canto y solfeo.",
};

export default function ContactPage() {
  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <section className="relative overflow-hidden border-b border-border/80 px-4 pb-20 pt-28 sm:px-6 md:pb-28 md:pt-40 lg:px-8">
        <div className="bg-dot-pattern absolute inset-0 pointer-events-none" />
        <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 size-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        <div className="relative z-20 mx-auto max-w-7xl space-y-12">
          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-muted/80 text-primary border border-border text-xs uppercase tracking-widest font-bold backdrop-blur-md">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admisiones Abiertas · Ciclo 2026</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-muted-foreground font-semibold">Quito, Ecuador</span>
            </div>

            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-bold leading-[0.98] tracking-tight text-foreground">
              Da vida a tu
              <span className="text-brand-gradient block font-light italic mt-2">
                pasión musical.
              </span>
            </h1>

            <p className="max-w-2xl text-lg sm:text-xl font-light leading-relaxed text-muted-foreground border-l-2 border-primary/50 pl-6">
              Te acompañamos en cada etapa de tu aprendizaje con maestros de conservatorio, repertorio a tu medida e instrumentos de alta gama en nuestras salas acústicas.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-30 -mt-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ContactHighlights />
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <ContactInfo
              address="Av. América E5-30 y Av. Pérez Guerrero"
              addressDetail="Quito - Ecuador"
              phone={CONTACT_PHONE}
              emails={[CONTACT_EMAIL]}
              lat={-0.1985}
              lng={-78.5038}
            />
          </div>
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
