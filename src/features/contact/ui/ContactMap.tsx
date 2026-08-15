"use client";

import { useEffect, useRef } from "react";
import type { StaticImageData } from "next/image";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Icon } from "@iconify/react";

import iconRetinaUrlAsset from "leaflet/dist/images/marker-icon-2x.png";
import iconUrlAsset from "leaflet/dist/images/marker-icon.png";
import shadowUrlAsset from "leaflet/dist/images/marker-shadow.png";

import type { IContactMapProps } from "./ContactMap.types";

const resolveAsset = (asset: string | StaticImageData): string =>
  typeof asset === "string" ? asset : asset.src;

export default function ContactMap({ lat, lng, label }: IContactMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: LeafletMap | null = null;
    let isCancelled = false;

    import("leaflet").then((L) => {
      if (isCancelled || !containerRef.current) return;

      const defaultIcon = L.icon({
        iconUrl: resolveAsset(iconUrlAsset),
        iconRetinaUrl: resolveAsset(iconRetinaUrlAsset),
        shadowUrl: resolveAsset(shadowUrlAsset),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      L.marker([lat, lng], { icon: defaultIcon })
        .addTo(map)
        .bindPopup(`<strong>${label}</strong>`)
        .openPopup();
    });

    return () => {
      isCancelled = true;
      map?.remove();
    };
  }, [lat, lng, label]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border">
      <div
        ref={containerRef}
        className="h-64 w-full md:h-80"
        aria-label={`Mapa de ubicación: ${label}`}
      />
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 left-3 bg-scrim-strong text-background text-xs px-3 py-1 rounded-full flex items-center gap-1 transition"
      >
        <Icon icon="mdi:map-marker" width={12} height={12} aria-hidden="true" />
        Cómo llegar
      </a>
    </div>
  );
}
