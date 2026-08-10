import { Card } from "@/shared/ui";

import type { IAboutPillarsProps } from "./AboutPillars.types";

export default function AboutPillars({ pillars }: IAboutPillarsProps) {
  return (
    <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {pillars.map((pillar) => (
        <Card key={pillar.tag} className="rounded-2xl p-6 gap-3">
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">
            {pillar.tag}
          </span>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {pillar.description}
          </p>
        </Card>
      ))}
    </section>
  );
}
