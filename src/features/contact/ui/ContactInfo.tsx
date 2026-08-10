import { Icon } from "@iconify/react";

import { Card, IconTile, MediaFrame } from "@/shared/ui";

import type { IContactInfoProps } from "./ContactInfo.types";

export default function ContactInfo({
  address,
  addressDetail,
  phone,
  emails,
  mapImageUrl,
  mapsUrl,
}: IContactInfoProps) {
  return (
    <div className="flex flex-col gap-4">

      <Card className="rounded-2xl p-6 gap-6">
        <h2 className="text-primary font-semibold text-xl">Información</h2>

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
            <p className="text-muted-foreground text-sm">{phone}</p>
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
      </Card>

      <MediaFrame
        variant="image"
        src={mapImageUrl}
        alt="Ubicación GOSMEL"
        aspect="fixed"
        className="w-full"
      >
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black/80 transition"
        >
          <Icon icon="mdi:map-marker" width={12} height={12} aria-hidden="true" />
          Ver en Google Maps
        </a>
      </MediaFrame>

    </div>
  );
}
