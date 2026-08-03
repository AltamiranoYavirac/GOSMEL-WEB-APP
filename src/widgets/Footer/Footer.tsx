import Link from "next/link";
import { Icon } from "@iconify/react";
import SocialLink from "./SocialLink";
import { ACADEMIA_LINKS, COURSE_LINKS, SOCIAL_LINKS } from "./Footer.constants";
import { getCurrentYear } from "@/shared/lib";

export default function Footer() {
  return (
    <footer className="bg-cocoa border-t border-neutral-700/30 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <span className="font-heading font-bold text-xl tracking-wider text-cream block mb-8">
              GOSMEL
            </span>
            <p className="text-neutral-300/70 text-sm leading-relaxed mb-8 font-light">
              En Gosmel Academia de Música creemos que la formación musical nace del equilibrio entre el conocimiento y la experiencia.Inspirados por nuestro lema, “Lo bello de la teoría en la práctica”
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
            <h3 className="font-bold text-cream mb-6 uppercase tracking-wider text-sm">
              Academia
            </h3>
            <ul className="space-y-4 text-sm text-neutral-300/70 font-light">
              {ACADEMIA_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-ginger transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-cream mb-6 uppercase tracking-wider text-sm">
              Cursos
            </h3>
            <ul className="space-y-4 text-sm text-neutral-300/70 font-light">
              {COURSE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-ginger transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-cream mb-6 uppercase tracking-wider text-sm">
              Contacto
            </h3>
            <ul className="space-y-4 text-sm text-neutral-300/70 font-light">
              <li className="flex items-start gap-3">
                <Icon icon="mdi:map-marker" className="w-[18px] h-[18px] text-ginger shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Humberto albornoz e
                  <br />
                  Ignacio de Quezada
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon icon="mdi:phone" className="w-[18px] h-[18px] text-ginger shrink-0" aria-hidden="true" />
                <span>+593 98 602 3191</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon icon="mdi:email-outline" className="w-[18px] h-[18px] text-ginger shrink-0" aria-hidden="true" />
                <span>andymelabur@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-300/40 uppercase tracking-wide">
          <p>© {getCurrentYear()} GOSMEL Music Academy. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-ginger transition-colors">
              Privacidad
            </Link>
            <Link href="/about" className="hover:text-ginger transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
