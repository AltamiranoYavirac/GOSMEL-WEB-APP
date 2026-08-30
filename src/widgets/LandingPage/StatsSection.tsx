import { Icon } from "@iconify/react";

import { STATS } from "./StatsSection.constants";

export default function StatsSection() {
  return (
    <section className="relative -mt-10 mb-10 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {STATS.map(({ value, label, icon }) => (
          <div
            key={label}
            className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)] gap-3"
          >
            <div className="size-13 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-105">
              <Icon icon={icon} className="size-6" aria-hidden="true" />
            </div>

            <div className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {value}
            </div>

            <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
