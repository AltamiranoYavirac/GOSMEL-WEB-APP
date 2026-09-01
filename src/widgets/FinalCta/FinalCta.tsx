import Link from "next/link";

import { Button, Reveal, RevealImage } from "@/shared/ui";

import type { IFinalCtaProps } from "./FinalCta.types";

export default function FinalCta({
  image,
  imageAlt,
  titleId,
  title,
  description,
  primary,
  secondary,
}: IFinalCtaProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="relative mt-[70px] h-[460px] overflow-hidden md:mt-[110px] md:h-[520px]"
    >
      <RevealImage
        src={image}
        alt={imageAlt}
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/92 via-surface-dark/55 to-surface-dark/20" />
      <div className="absolute inset-0 mx-auto flex w-full max-w-[1600px] flex-col justify-center px-[22px] text-surface-dark-foreground md:px-14">
        <Reveal
          as="h2"
          className="max-w-[560px] text-[34px] font-semibold leading-[1.06] tracking-[-0.03em] md:text-[48px]"
        >
          <span id={titleId}>{title}</span>
        </Reveal>
        {description ? (
          <Reveal
            as="p"
            delay={0.1}
            className="mt-4 max-w-[460px] text-[15px] leading-[1.55] text-surface-dark-muted md:text-base"
          >
            {description}
          </Reveal>
        ) : null}
        <Reveal
          delay={0.12}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-7"
        >
          <Button
            asChild
            className="h-[52px] w-full rounded-full bg-surface-dark-foreground px-[30px] text-[15px] font-semibold text-surface-dark hover:bg-surface-dark-foreground/85 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/85 sm:w-auto"
          >
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-[52px] w-full rounded-full border-surface-dark-foreground/30 bg-transparent text-[15px] font-semibold text-surface-dark-foreground hover:bg-surface-dark-foreground/10 hover:text-surface-dark-foreground sm:h-auto sm:w-auto sm:border-0 sm:p-0 sm:font-medium sm:underline sm:decoration-surface-dark-foreground/40 sm:underline-offset-[6px] sm:hover:bg-transparent sm:hover:text-surface-dark-foreground/80"
          >
            <Link href={secondary.href}>{secondary.label}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
