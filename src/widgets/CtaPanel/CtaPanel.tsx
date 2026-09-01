import Link from "next/link";

import { Button, Reveal } from "@/shared/ui";

import type { ICtaPanelProps } from "./CtaPanel.types";

export default function CtaPanel({
  titleId,
  title,
  description,
  primary,
  secondary,
}: ICtaPanelProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="bg-background px-[22px] pb-[70px] pt-[70px] md:px-14 md:pb-[110px] md:pt-[110px]"
    >
      <Reveal className="mx-auto max-w-[1600px]">
        <div className="rounded-[28px] border border-border bg-card px-6 py-14 text-center md:rounded-[32px] md:px-14 md:py-16">
          <h2
            id={titleId}
            className="mx-auto max-w-[640px] text-[32px] font-semibold leading-[1.15] tracking-[-0.03em] md:text-[42px]"
          >
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-[480px] text-[15px] leading-[1.6] text-muted-foreground md:text-base">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-[52px] w-full rounded-full px-[30px] text-[15px] font-semibold sm:w-auto"
            >
              <Link href={primary.href}>{primary.label}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-[52px] w-full rounded-full border-border bg-transparent px-[30px] text-[15px] font-semibold sm:w-auto"
            >
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
