"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";

import { AppImages } from "@/shared/config";

import { PANEL_FEATURES } from "./authSidePanel.constants";
import type { IAuthSidePanelProps } from "./AuthSidePanel.types";

export default function AuthSidePanel({
  image = AppImages.HERO_COVER,
  quote = "Lo bello de la teoría en la práctica",
}: IAuthSidePanelProps) {
  return (
    <aside className="relative hidden overflow-hidden bg-surface-dark rounded-r-3xl lg:block lg:min-h-[640px]">
      <Image
        src={image}
        alt="Estudiante de GOSMEL Academia de Música"
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/55 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-staff-lines opacity-30" />

      <div className="relative z-10 flex h-full flex-col justify-end p-12 pb-16 xl:p-16 xl:pb-20">
        <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-secondary-300 uppercase">
          GOSMEL · Academia de Música
        </p>
        <h2 className="font-heading text-5xl font-black tracking-tight text-warm-50 xl:text-6xl">
          GOSMEL
        </h2>
        <p className="text-brand-gradient mt-4 max-w-md font-heading text-2xl font-light italic xl:text-3xl">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="mt-10 h-px w-full max-w-sm bg-gradient-to-r from-primary-400/60 to-transparent" />
        <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          {PANEL_FEATURES.map(({ icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-warm-200">
              <span className="grid size-9 place-items-center rounded-full bg-primary-400/15 ring-1 ring-primary-300/30">
                <Icon icon={icon} className="size-5 text-secondary-200" aria-hidden="true" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
