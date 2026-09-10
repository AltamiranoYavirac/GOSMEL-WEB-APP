import Image from "next/image";
import Link from "next/link";

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
  };
});

export default function ProgramsSection() {
  return (
    <section id="programas" className="bg-warm-50 py-[72px] md:py-[112px]">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] md:px-14">
        <Reveal className="flex items-end justify-between border-b border-warm-300 pb-6 md:pb-8">
          <h2 className="text-[34px] font-semibold tracking-[-0.035em] md:text-[48px]">
            Programas
          </h2>
          <Link
            href="/courses"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-primary-700 transition-colors hover:text-primary-900 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-base"
          >
            Ver todos →
          </Link>
        </Reveal>

        <div>
          {LANDING_PROGRAMS.map(
            (
              {
                slug,
                title,
                category,
                description,
                image,
                imageAlt,
              },
              index,
            ) => {
              const imageFirst = index % 2 === 1;

              return (
                <article
                  key={title}
                  className="grid items-center gap-8 border-b border-warm-300 py-12 md:gap-12 md:py-16 lg:grid-cols-2 lg:gap-16 xl:gap-24"
                >
                  <Reveal
                    className={
                      imageFirst
                        ? "lg:order-2 lg:pl-6 xl:pl-12"
                        : "lg:order-1 lg:pr-6 xl:pr-12"
                    }
                  >
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-primary-700 md:text-xs">
                      {category}
                    </p>
                    <h3 className="mt-4 text-[40px] font-semibold leading-[1.02] tracking-[-0.04em] text-foreground md:text-[52px] xl:text-[60px]">
                      {title}
                    </h3>
                    <p className="mt-5 max-w-[560px] text-[17px] leading-[1.65] text-warm-700 md:text-lg">
                      {description}
                    </p>
                    <Link
                      href={`/courses/${slug}`}
                      className="mt-7 inline-flex min-h-12 items-center border-b-2 border-primary-700 text-[17px] font-bold text-primary-800 transition-colors hover:border-primary-950 hover:text-primary-950 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Conocer el programa →
                    </Link>
                  </Reveal>

                  <Reveal
                    delay={0.1}
                    className={imageFirst ? "lg:order-1" : "lg:order-2"}
                  >
                    <Link
                      href={`/courses/${slug}`}
                      aria-label={`Ver programa de ${title}`}
                      className="group relative block aspect-[4/3] overflow-hidden rounded-[18px] border border-warm-300 bg-warm-100 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-warm-50 md:rounded-[20px]"
                    >
                      <Image
                        src={image}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 1023px) 100vw, min(50vw, 740px)"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </Link>
                  </Reveal>
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
