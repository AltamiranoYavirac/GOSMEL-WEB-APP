import { Card } from "@/shared/ui";

import type { IAboutPillarsProps } from "./AboutPillars.types";

export default function AboutPillars({ pillars }: IAboutPillarsProps) {
  return (
    <section className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {pillars.map((pillar) => (
        <Card key={pillar.tag} className="rounded-2xl p-8 gap-5">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            {pillar.tag}
          </span>
          <p className="text-muted-foreground text-base leading-relaxed">
            {pillar.description}
          </p>
        </Card>
      ))}
    </section>
  );
}
