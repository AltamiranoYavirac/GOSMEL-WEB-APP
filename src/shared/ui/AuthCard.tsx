import { cn } from "@/shared/lib/utils";

import IconTile from "./IconTile";
import { authCardVariants } from "./AuthCard.variants";
import type { IAuthCardProps } from "./AuthCard.types";

export default function AuthCard({
  icon,
  title,
  subtitle,
  children,
  footer,
  className,
}: IAuthCardProps) {
  const { root, card, mobileBrand, header } = authCardVariants();

  return (
    <div className={cn(root(), className)}>
      <div className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-10 size-80 rounded-full bg-accent-muted/40 blur-[110px]" />

      <div className={card()}>
        <div className={mobileBrand()}>
          <IconTile icon={icon} className="bg-primary text-primary-foreground shadow-lg shadow-primary/25" />
          <p className="font-heading text-3xl font-black tracking-tight text-foreground uppercase">
            GOSMEL
          </p>
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Academia de Música
          </p>
        </div>

        <header className={header()}>
          <IconTile icon={icon} size="sm" className="bg-primary/10 text-primary ring-1 ring-primary/20" />
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </header>

        {children}

        <div className="mt-8">{footer}</div>
      </div>
    </div>
  );
}
