import { Icon } from "@iconify/react";
import Image from "next/image";
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

      <div className="bg-cream/60 dark:bg-neutral-900 border border-cocoa/10 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-6">
        <h2 className="text-ginger font-semibold text-xl">Información</h2>

        <div className="flex items-start gap-4">
          <span className="mt-1 p-2 rounded-lg bg-cocoa/10 dark:bg-neutral-800 text-ginger">
            <Icon icon="mdi:map-marker" width={20} height={20} />
          </span>
          <div>
            <p className="text-cocoa dark:text-white font-semibold">Dirección</p>
            <p className="text-cocoa/70 dark:text-neutral-300 text-sm">{address}</p>
            <p className="text-ginger text-sm">{addressDetail}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 p-2 rounded-lg bg-cocoa/10 dark:bg-neutral-800 text-ginger">
            <Icon icon="mdi:phone" width={20} height={20} />
          </span>
          <div>
            <p className="text-cocoa dark:text-white font-semibold">Teléfono</p>
            <p className="text-cocoa/70 dark:text-neutral-300 text-sm">{phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <span className="mt-1 p-2 rounded-lg bg-cocoa/10 dark:bg-neutral-800 text-ginger">
            <Icon icon="mdi:email" width={20} height={20} />
          </span>
          <div>
            <p className="text-cocoa dark:text-white font-semibold">Email</p>
            {emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block text-ginger text-sm hover:underline"
              >
                {email}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden h-[200px] group">
        <Image
          src={mapImageUrl}
          alt="Ubicación GOSMEL"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black/80 transition"
        >
          <Icon icon="mdi:map-marker" width={12} height={12} />
          Ver en Google Maps
        </a>
      </div>

    </div>
  );
}