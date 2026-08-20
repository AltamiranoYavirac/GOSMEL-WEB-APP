"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import animationData from "./construccion.json";
import type { IComingSoonProps } from "./ComingSoon.types";

export default function ComingSoon({
  title = "Próximamente",
  description = "Estamos trabajando en algo especial para ti. ¡Vuelve pronto!",
  backHref = "/",
  backLabel = "Volver al inicio",
}: IComingSoonProps) {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-lg">
        <Lottie
          animationData={animationData}
          loop
          className="w-full h-auto"
        />
      </div>

      <div className="mt-4 space-y-4 max-w-md">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          {description}
        </p>
      </div>

      <Button
        asChild
        variant="link"
        className="mt-10 gap-2 uppercase tracking-wider text-sm font-semibold"
      >
        <Link href={backHref}>
          <Icon icon="ph:arrow-left" width={16} height={16} aria-hidden="true" />
          {backLabel}
        </Link>
      </Button>
    </div>
  );
}
