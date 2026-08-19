import { Icon } from "@iconify/react";

import { SOCIAL_LINKS } from "@/shared/config/social";
import { Button, Card, IconTile } from "@/shared/ui";

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
    <div className="flex flex-col gap-4">
      <Card className="rounded-2xl p-6 gap-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Información
          </span>
          <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">
            Estamos en Quito
          </h2>
        </div>

        <div className="grid gap-4">
          <div className="flex items-start gap-4">
            <IconTile
              icon="mdi:map-marker"
              size="sm"
              iconSize={20}
              className="mt-1"
            />
            <div>
              <p className="text-foreground font-semibold">Dirección</p>
              <p className="text-muted-foreground text-sm">{address}</p>
              <p className="text-primary text-sm">{addressDetail}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <IconTile icon="mdi:phone" size="sm" iconSize={20} className="mt-1" />
            <div>
              <p className="text-foreground font-semibold">Teléfono</p>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <IconTile icon="mdi:email" size="sm" iconSize={20} className="mt-1" />
            <div>
              <p className="text-foreground font-semibold">Email</p>
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="block text-primary text-sm hover:underline"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Síguenos
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SOCIAL_LINKS.map(({ href, icon, label }) => (
            <Button
              key={label}
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full border border-border bg-muted text-muted-foreground hover:border-primary hover:text-primary"
            >
              <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                <Icon icon={icon} className="size-5" aria-hidden="true" />
              </a>
            </Button>
          ))}
        </div>

        {WHATSAPP_LINK && (
          <Button
            asChild
            size="xl"
            className="w-full gap-2 bg-[#25D366] text-sm uppercase tracking-widest text-white hover:bg-[#25D366]/90"
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <Icon icon="mdi:whatsapp" className="size-5" aria-hidden="true" />
              Escríbenos por WhatsApp
            </a>
          </Button>
        )}
      </Card>

      <ContactMap lat={lat} lng={lng} label="GOSMEL Academia Musical" />
    </div>
  );
}
