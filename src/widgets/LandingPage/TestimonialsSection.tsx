import Image from "next/image";
import { Icon } from "@iconify/react";

import { getPublicTestimonios } from "@/features/testimonios/server";
import { buildCloudinaryImageUrl } from "@/shared/lib";
import { Reveal } from "@/shared/ui";

export default async function TestimonialsSection() {
  const { data: testimonios, error } = await getPublicTestimonios();
  if (error) throw new Error(error);
  if (!testimonios.length) return null;

  return (
    <section className="bg-background px-[22px] pb-[70px] md:px-14 md:pb-0 md:pt-[110px]">
      <div className="mx-auto max-w-[1600px]">
        <Reveal
          as="h2"
          className="mb-6 text-[31px] font-semibold tracking-[-0.035em] md:mb-10 md:text-[44px]"
        >
          Estudiantes
        </Reveal>
        <div className="grid gap-0.5 md:grid-cols-3">
          {testimonios.map(({ id, cita, autor, rol, fotoPublicId, puntuacion }, index) => {
            const photo = buildCloudinaryImageUrl(fotoPublicId, "ar_1:1,c_fill,g_auto,w_160,q_auto,f_auto");

            return (
              <Reveal
                key={id}
                as="article"
                delay={index * 0.08}
                className="flex flex-col bg-card px-6 py-7 md:px-[34px] md:py-[38px]"
              >
                {puntuacion ? (
                  <div className="mb-4 flex gap-1 text-primary" aria-label={`${puntuacion} de 5 estrellas`}>
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Icon
                        key={star}
                        icon={star < puntuacion ? "ph:star-fill" : "ph:star"}
                        className="size-4"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                ) : null}
                <p className="text-lg leading-[1.5] md:text-[21px]">{cita}</p>
                <div className="mt-[22px] flex items-center gap-3 md:mt-7">
                  {photo ? (
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border">
                      <Image src={photo} alt={`Foto de ${autor}`} fill sizes="44px" className="object-cover" />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-foreground md:text-[11px] md:tracking-[0.14em]">
                      {autor}
                    </p>
                    {rol ? (
                      <p className="text-xs text-muted-foreground">{rol}</p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
