import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { COURSES } from "@/features/courses";
import { Reveal } from "@/shared/ui";

import {
  LANDING_PROGRAM_DESCRIPTIONS,
  LANDING_PROGRAM_IMAGE_ALTS,
  LANDING_PROGRAM_IMAGES,
  LANDING_PROGRAM_ORDER,
} from "./LandingPage.constants";

const LANDING_PROGRAMS = LANDING_PROGRAM_ORDER.map((title) => {
  const courseIndex = COURSES.findIndex((course) => course.title === title);

  return {
    ...COURSES[courseIndex],
    description: LANDING_PROGRAM_DESCRIPTIONS[title],
    image: LANDING_PROGRAM_IMAGES[title],
    imageAlt: LANDING_PROGRAM_IMAGE_ALTS[title],
    number: String(courseIndex + 1).padStart(2, "0"),
  };
});

export default function ProgramsSection() {
  return (
    <section id="programas" className="overflow-hidden bg-background pb-[70px] md:pb-[110px]">
      <Reveal className="mx-auto flex w-full max-w-[1600px] items-end justify-between px-[22px] pb-5 md:px-14 md:pb-[30px]">
        <h2 className="text-[31px] font-semibold tracking-[-0.035em] md:text-[44px]">
          Programas
        </h2>
        <Link
          href="/courses"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/75 md:text-[15px]"
        >
          Ver todos ›
        </Link>
      </Reveal>

      <div className="landing-scroll mx-auto flex w-full max-w-[1600px] snap-x snap-mandatory gap-3 overflow-x-auto px-[22px] pb-1 md:gap-3.5 md:px-14">
        {LANDING_PROGRAMS.map(({ slug, title, category, description, icon, image, imageAlt, number }, index) => (
          <Reveal
            key={title}
            delay={index * 0.08}
            className={`shrink-0 snap-start${image ? "" : " hidden md:block"}`}
          >
          <Link
            href={`/courses/${slug}`}
            className="group relative block h-[380px] w-[250px] overflow-hidden rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:h-[430px] md:w-[286px] md:rounded-[20px]"
          >
            {image ? (
              <>
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 767px) 250px, 286px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/95 via-surface-dark/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-surface-dark-foreground md:p-6">
                  <p className="mb-2 font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-stage-accent md:mb-2.5 md:text-[10px] md:tracking-[0.18em]">
                    {number} · {category}
                  </p>
                  <h3 className="text-[23px] font-semibold tracking-[-0.03em] md:text-[26px]">
                    {title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-[13px] leading-[1.5] text-surface-dark-muted md:mt-2 md:text-[13.5px]">
                    {description}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col justify-between border border-border bg-card p-6">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
                    {number} · {category}
                  </span>
                  <Icon icon={icon} className="size-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[23px] font-semibold tracking-[-0.03em] md:text-[26px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.5] text-muted-foreground md:text-[13.5px]">
                    {description}
                  </p>
                </div>
              </div>
            )}
          </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
