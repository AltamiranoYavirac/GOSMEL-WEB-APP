"use client";

import Lottie from "lottie-react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import animationData from "./construccion.json";

export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-cream dark:bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-lg">
        <Lottie
          animationData={animationData}
          loop
          className="w-full h-auto"
        />
      </div>

      <div className="mt-4 space-y-4 max-w-md">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-cocoa dark:text-cream">
          Próximamente
        </h1>
        <p className="text-cocoa/60 dark:text-cream/60 text-lg font-light">
          Estamos trabajando en algo especial para ti. ¡Vuelve pronto!
        </p>
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ginger hover:text-burnt transition-colors uppercase tracking-wider"
      >
        <Icon
          icon="ph:arrow-left"
          width={16}
          height={16}
          aria-hidden="true"
        />
        Volver al inicio
      </Link>
    </main>
  );
}
