import Image from "next/image";

import { AppImages } from "@/shared/config";
import { IconTile, SectionHeader } from "@/shared/ui";

import { WHY_FEATURES } from "./WhySection.constants";

export default function WhySection() {
  return (
    <section className="py-24 bg-background border-t border-border" id="ventajas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="flex flex-col gap-6">
              <div className="aspect-[16/9] w-full">
                <Image
                  src={AppImages.WHY_GUITAR}
                  alt="Profesor explicando acordes de guitarra"
                  width={1024}
                  height={576}
                  className="w-full h-full object-cover rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-500"
                />
              </div>
              <div className="aspect-[16/9] w-full">
                <Image
                  src={AppImages.WHY_PIANO}
                  alt="Manos tocando teclas de piano"
                  width={1024}
                  height={576}
                  className="w-full h-full object-cover rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-500"
                />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary rounded-full mix-blend-multiply blur-[80px] opacity-15 pointer-events-none" />
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeader
              align="left"
              size="md"
              className="mb-12"
              title={
                <>
                  ¿Por qué elegir{" "}
                  <span className="text-primary">GOSMEL?</span>
                </>
              }
              description="Nos dedicamos a crear un ambiente donde la música florece. Nuestra metodología combina lo tradicional con un enfoque moderno y humano."
            />

            <div className="space-y-10">
              {WHY_FEATURES.map(({ icon, title, description }) => (
                <div key={title} className="flex gap-6 group">
                  <IconTile
                    icon={icon}
                    size="md"
                    iconSize={22}
                    className="bg-accent/30 dark:bg-neutral-800 border border-accent/50 dark:border-neutral-700/40 group-hover:border-primary group-hover:bg-primary/10 transition-colors shadow-sm"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h4>
                    <p className="text-muted-foreground font-light">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
