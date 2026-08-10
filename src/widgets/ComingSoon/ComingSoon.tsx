"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/shared/ui";

import animationData from "./construccion.json";

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-lg">
        <Lottie
          animationData={animationData}
          loop
          className="w-full h-auto"
        />
      </div>

      <div className="mt-4 space-y-4 max-w-md">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
          Próximamente
        </h1>
        <p className="text-muted-foreground text-lg font-light">
          Estamos trabajando en algo especial para ti. ¡Vuelve pronto!
        </p>
      </div>

      <Button
        asChild
        variant="link"
        className="mt-10 gap-2 uppercase tracking-wider text-sm font-semibold"
      >
        <Link href="/">
          <Icon icon="ph:arrow-left" width={16} height={16} aria-hidden="true" />
          Volver al inicio
        </Link>
      </Button>
    </main>
  );
}
