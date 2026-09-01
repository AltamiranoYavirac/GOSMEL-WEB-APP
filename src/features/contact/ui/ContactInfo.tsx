import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import {
  CONTACT_DETAILS,
  CONTACT_SOCIAL_LINKS,
  CONTACT_WHATSAPP_HREF,
} from "../model/contact.constants";
import ContactMap from "./ContactMap";

const ROWS = [
  {
    icon: "ph:map-pin",
    label: "Dirección",
    value: CONTACT_DETAILS.address,
    detail: CONTACT_DETAILS.addressDetail,
  },
  {
    icon: "ph:phone",
    label: "Teléfono",
    value: CONTACT_DETAILS.phone,
    href: `tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`,
  },
  {
    icon: "ph:envelope-simple",
    label: "Correo",
    value: CONTACT_DETAILS.email,
    href: `mailto:${CONTACT_DETAILS.email}`,
  },
] as const;

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="rounded-[18px] border border-border bg-card p-6 md:rounded-[20px] md:p-8">
        <div className="flex flex-col gap-5">
          {ROWS.map((row) => (
            <div key={row.label} className="flex items-start gap-4">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-primary">
                <Icon icon={row.icon} className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {row.label}
                </p>
                {"href" in row ? (
                  <a
                    href={row.href}
                    className="text-[15px] font-medium transition-colors hover:text-primary"
                  >
                    {row.value}
                  </a>
                ) : (
                  <p className="text-[15px] font-medium">{row.value}</p>
                )}
                {"detail" in row ? (
                  <p className="text-sm text-muted-foreground">{row.detail}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {CONTACT_WHATSAPP_HREF ? (
          <Button
            asChild
            className="mt-6 h-[52px] w-full gap-2 rounded-full bg-success text-[15px] font-semibold text-surface-dark-foreground hover:bg-success/90"
          >
            <a href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              <Icon icon="ph:whatsapp-logo" className="size-5" aria-hidden="true" />
              Escríbenos por WhatsApp
            </a>
          </Button>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2.5">
          {CONTACT_SOCIAL_LINKS.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] font-medium transition-colors hover:border-primary hover:text-primary"
            >
              <Icon icon={icon} className="size-4" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      </div>

      <ContactMap
        lat={CONTACT_DETAILS.lat}
        lng={CONTACT_DETAILS.lng}
        label={CONTACT_DETAILS.mapLabel}
      />
    </div>
  );
}
