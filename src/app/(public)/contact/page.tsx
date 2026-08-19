import Link from "next/link";
import { Icon } from "@iconify/react";

import { ContactForm, ContactHighlights, ContactInfo } from "@/features/contact";
import { Button } from "@/shared/ui";

const CONTACT_PHONE = "+593 98 602 3191";
const CONTACT_EMAIL = "andymelabur@gmail.com";

export const metadata = {
  title: "Contacto | GOSMEL Music Academy",
  description:
    "Escríbenos para solicitar más información o resolver cualquier duda sobre nuestros programas.",
};

export default function ContactPage() {
  return (
    <div className="relative flex-1 overflow-hidden bg-background">
      <section className="relative border-b border-border px-4 pb-12 pt-32 sm:px-6 md:pb-16 md:pt-40 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  Contacto · GOSMEL
                </span>
                <span className="hidden h-px w-12 bg-border sm:block" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Quito · Ecuador
                </span>
              </div>

              <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                <span className="block font-light italic text-primary">Hablemos de</span>
                <span>tu música.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
                Estamos aquí para acompañarte en tu viaje musical. Escríbenos para solicitar{" "}
                <span className="text-primary font-medium">más información</span> o resolver
                cualquier duda sobre nuestros programas.
              </p>
            </div>

            <div className="flex items-end gap-3 self-start lg:flex-col lg:items-end lg:self-end">
              <span className="font-mono text-7xl font-light leading-none text-accent-muted md:text-8xl">
                24
              </span>
              <span className="pb-2 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground lg:pb-0">
                horas de respuesta
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ContactHighlights />
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 md:pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
          <ContactInfo
            address="Av. América E5-30 y Av. Pérez Guerrero"
            addressDetail="Quito - Ecuador"
            phone={CONTACT_PHONE}
            emails={[CONTACT_EMAIL]}
            lat={-0.1985}
            lng={-78.5038}
          />
          <ContactForm />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary-200/60 bg-card-gradient px-8 py-20 text-center dark:border-warm-700/60 dark:bg-warm-900 md:px-14">
          <div className="bg-dot-pattern absolute inset-0 text-primary-500 dark:text-secondary-500" aria-hidden="true" />
          <div
            className="absolute left-1/2 top-0 h-1 w-32 -translate-x-1/2 rounded-b-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500"
            aria-hidden="true"
          />
          <div className="relative mx-auto mb-6 flex size-14 items-center justify-center rounded-full bg-primary-100 text-primary-700 ring-1 ring-primary-300/70 dark:bg-primary-tint dark:text-primary-foreground dark:ring-primary-400/30">
            <Icon icon="mdi:music-clef-treble" className="size-7" aria-hidden="true" />
          </div>
          <h2 className="relative mx-auto max-w-3xl font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl">
            ¿Listo para subir al escenario?
          </h2>
          <div className="relative mx-auto my-8 flex max-w-xs items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-warm-300 dark:bg-warm-600" />
            <span className="size-1.5 rounded-full bg-primary-500" />
            <span className="h-px flex-1 bg-warm-300 dark:bg-warm-600" />
          </div>
          <p className="relative mx-auto max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
            Reserva una clase de prueba gratuita y descubre cómo suena tu camino musical junto a
            nuestros maestros.
          </p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="2xl" className="uppercase tracking-widest text-sm">
              <Link href="/register">Reservar clase de prueba</Link>
            </Button>
            <Button
              asChild
              size="2xl"
              variant="outline"
              className="border-warm-700/40 bg-transparent text-warm-900 uppercase tracking-widest text-sm hover:bg-warm-200/60 hover:text-warm-900 dark:border-warm-200/40 dark:bg-transparent dark:text-warm-50 dark:hover:bg-warm-700/40 dark:hover:text-warm-50"
            >
              <Link href="/courses">Explorar cursos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
