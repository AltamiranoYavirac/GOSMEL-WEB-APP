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
    </div>
  );
}
