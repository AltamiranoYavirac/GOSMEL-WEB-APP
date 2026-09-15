import { Icon } from "@iconify/react";

import { getPublicMetricas } from "@/features/metricas/server";
import { Reveal } from "@/shared/ui";

export default async function MetricsSection() {
  const { data: metricas, error } = await getPublicMetricas();
  if (error) throw new Error(error);
  if (!metricas.length) return null;

  return (
    <section aria-label="La academia en cifras" className="border-y border-warm-200 bg-warm-50">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-y-8 px-[22px] py-12 md:grid-cols-4 md:px-14 md:py-16">
        {metricas.map(({ id, etiqueta, valor, sufijo, icono }, index) => (
          <Reveal key={id} delay={index * 0.06} className="text-center">
            {icono ? (
              <Icon icon={icono} className="mx-auto mb-3 size-7 text-primary" aria-hidden="true" />
            ) : null}
            <p className="text-[38px] font-semibold leading-none tracking-[-0.05em] text-foreground md:text-[54px]">
              {valor}
              {sufijo ? <span className="text-[0.6em] text-primary">{sufijo}</span> : null}
            </p>
            <p className="mt-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground md:mt-3.5 md:text-[11px] md:tracking-[0.16em]">
              {etiqueta}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
