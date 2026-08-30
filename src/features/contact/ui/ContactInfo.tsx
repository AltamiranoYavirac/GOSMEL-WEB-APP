import { Icon } from "@iconify/react";

import { SOCIAL_LINKS } from "@/shared/config/social";
import { Button } from "@/shared/ui";
import ContactMap from "./ContactMap";
import type { IContactInfoProps } from "./ContactInfo.types";

const WHATSAPP_LINK = SOCIAL_LINKS.find((link) => link.label === "WhatsApp")?.href;

export default function ContactInfo({
  address,
  addressDetail,
  phone,
  emails,
  lat,
  lng,
}: IContactInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-8 sm:p-10 flex flex-col gap-8">
        <div className="space-y-2 relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Canales Directos
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
            Estamos disponibles para asesorarte en horarios de clases, selección de instrumentos y visitas guiadas a la academia.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-13 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Icon icon="ph:phone-call-fill" className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Línea Telefónica
              </div>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-base font-bold text-foreground hover:text-primary transition-colors block"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-13 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Icon icon="ph:envelope-simple-fill" className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Correo Institucional
              </div>
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="text-base font-bold text-foreground hover:text-primary transition-colors block"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-13 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Icon icon="ph:map-pin-fill" className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Sede Central
              </div>
              <div className="text-sm font-bold text-foreground">
                {address}
              </div>
              <div className="text-xs text-primary font-semibold">
                {addressDetail}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="size-13 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Icon icon="ph:clock-fill" className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Horario de Atención
              </div>
              <div className="text-sm font-bold text-foreground">
                Lunes a Sábado: 08:00 – 19:00
              </div>
              <div className="text-xs text-muted-foreground font-light">
                Domingos con cita previa
              </div>
            </div>
          </div>
        </div>

        {WHATSAPP_LINK && (
          <Button
            asChild
            size="2xl"
            className="relative z-10 w-full gap-2 bg-[#25D366] text-xs uppercase tracking-widest font-bold text-white hover:bg-[#25D366]/90 shadow-xl shadow-[#25D366]/25 hover:scale-[1.01] transition-all h-14"
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Icon icon="mdi:whatsapp" className="size-5" aria-hidden="true" />
              Escribir al Asesor por WhatsApp
            </a>
          </Button>
        )}
      </div>

      <div className="rounded-3xl bg-background border border-white/60 dark:border-white/5 p-3 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] overflow-hidden">
        <ContactMap lat={lat} lng={lng} label="GOSMEL Academia Musical" />
      </div>
    </div>
  );
}
