import { Icon } from "@iconify/react";

import { CONTACT_HIGHLIGHTS } from "./ContactHighlights.constants";

export default function ContactHighlights() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {CONTACT_HIGHLIGHTS.map(({ number, icon, title, tag, description }) => (
        <div
          key={title}
          className="group relative overflow-hidden rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-8 flex flex-col justify-between gap-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[-4px_-4px_12px_rgba(255,255,255,0.95),4px_4px_14px_rgba(169,146,125,0.28)] dark:hover:shadow-[-4px_-4px_14px_rgba(255,255,255,0.06),4px_4px_16px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute -right-2 -top-4 font-mono text-7xl font-bold text-muted-foreground/10 select-none pointer-events-none group-hover:text-primary/15 transition-colors">
            {number}
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="size-13 rounded-2xl bg-background border border-white/40 dark:border-white/5 shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.9),inset_3px_3px_7px_rgba(169,146,125,0.22)] dark:shadow-[inset_-3px_-3px_7px_rgba(255,255,255,0.04),inset_3px_3px_7px_rgba(0,0,0,0.6)] flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-105">
              <Icon icon={icon} className="size-6" aria-hidden="true" />
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-background border border-white/60 dark:border-white/5 shadow-[-2px_-2px_5px_rgba(255,255,255,0.8),2px_2px_5px_rgba(169,146,125,0.18)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.5)] text-muted-foreground">
              {tag}
            </span>
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
