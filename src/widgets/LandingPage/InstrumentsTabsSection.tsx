"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button, SectionHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { INSTRUMENT_FAMILIES } from "./InstrumentsTabsSection.constants";

export default function InstrumentsTabsSection() {
  return (
    <section className="relative py-28 bg-background border-t border-border/80" id="instrumentos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Formación Especializada"
          title="Familias de Instrumentos"
          description="Sumérgete en la disciplina que resuene con tu estilo. Cada programa cuenta con metodología propia y maestros dedicados."
          size="md"
          lineAccent
          className="mb-16 text-center"
        />

        <Tabs defaultValue={INSTRUMENT_FAMILIES[0].id} className="w-full">
          <div className="flex justify-center mb-12 overflow-x-auto pb-2">
            <TabsList className="h-auto p-2 rounded-2xl bg-background border border-white/60 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex flex-wrap gap-2 justify-center">
              {INSTRUMENT_FAMILIES.map(({ id, name, icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="gap-2.5 px-5 py-3 rounded-xl text-xs uppercase tracking-wider font-bold text-muted-foreground data-active:bg-background data-active:text-primary data-active:shadow-[-4px_-4px_10px_rgba(255,255,255,0.95),4px_4px_10px_rgba(169,146,125,0.25)] dark:data-active:shadow-[-4px_-4px_10px_rgba(255,255,255,0.05),4px_4px_10px_rgba(0,0,0,0.7)] data-active:border data-active:border-white/60 dark:data-active:border-white/5 transition-all"
                >
                  <Icon icon={icon} className="size-4 shrink-0" aria-hidden="true" />
                  <span>{name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {INSTRUMENT_FAMILIES.map((family) => (
            <TabsContent key={family.id} value={family.id} className="outline-none focus:outline-none">
              <div className="p-8 sm:p-12 rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] overflow-hidden">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-background border border-white/60 dark:border-white/5 shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)] text-primary text-xs font-bold uppercase tracking-wider">
                      <Icon icon={family.icon} className="size-3.5" aria-hidden="true" />
                      <span>{family.name}</span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                        {family.title}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {family.tagline}
                      </p>
                      <p className="text-base text-muted-foreground leading-relaxed font-light">
                        {family.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-foreground">
                        Lo que desarrollarás:
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground font-light">
                        {family.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Icon icon="ph:check-circle-fill" className="size-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      <Button asChild size="lg" className="uppercase tracking-widest text-xs font-bold gap-2">
                        <Link href={family.courseHref}>
                          Ver Cursos de {family.name}
                          <Icon icon="ph:arrow-right" className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-white/40 dark:border-white/5 shadow-lg group">
                    <Image
                      src={family.image}
                      alt={family.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/60 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
