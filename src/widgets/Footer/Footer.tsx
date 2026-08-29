import Link from "next/link";
import { Icon } from "@iconify/react";

import SocialLink from "./SocialLink";
import { ACADEMIA_LINKS, COURSE_LINKS } from "./Footer.constants";
import { SOCIAL_LINKS } from "@/shared/config/social";
import { getCurrentYear } from "@/shared/lib";

export default function Footer() {
  return (
    <footer className="bg-surface-dark border-t border-surface-dark-border/30 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link href="/" className="font-heading font-bold text-xl tracking-wider text-surface-dark-foreground block mb-8">
              GOSMEL
            </Link>
            <p className="text-surface-dark-muted/70 text-sm leading-relaxed mb-8 font-light">
              En Gosmel Academia de Música creemos que la formación musical nace del equilibrio entre el conocimiento y la experiencia.Inspirados por nuestro lema, &ldquo;Lo bello de la teoría en la práctica&rdquo;
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map(({ href, icon, label }) => (
                <SocialLink key={label} href={href} aria-label={label}>
                  <Icon icon={icon} className="w-5 h-5" aria-hidden="true" />
                </SocialLink>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-surface-dark-foreground mb-6 uppercase tracking-wider text-sm">
              Academia
            </h3>
            <ul className="space-y-4 text-sm text-surface-dark-muted/70 font-light">
              {ACADEMIA_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-surface-dark-foreground mb-6 uppercase tracking-wider text-sm">
              Cursos
            </h3>
            <ul className="space-y-4 text-sm text-surface-dark-muted/70 font-light">
              {COURSE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-surface-dark-foreground mb-6 uppercase tracking-wider text-sm">
              Contacto
            </h3>
            <ul className="space-y-4 text-sm text-surface-dark-muted/70 font-light">
              <li className="flex items-start gap-3">
                <Icon icon="mdi:map-marker" className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Av. América E5-30 e
                  <br />
                  Av. Pérez Guerrero
                  <br />
                  Quito - Ecuador
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon icon="mdi:phone" className="w-[18px] h-[18px] text-primary shrink-0" aria-hidden="true" />
                <span>+593 98 602 3191</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon icon="mdi:email-outline" className="w-[18px] h-[18px] text-primary shrink-0" aria-hidden="true" />
                <span>andymelabur@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-dark-border/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-surface-dark-muted/40 uppercase tracking-wide">
          <p>© {getCurrentYear()} GOSMEL Music Academy. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
