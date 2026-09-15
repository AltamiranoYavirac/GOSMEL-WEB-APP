import Link from "next/link";

import { getPublicSiteConfig } from "@/entities/site-config/server";
import { BrandLogo } from "@/shared/ui";
import { getCurrentYear } from "@/shared/lib";

import { ACADEMIA_LINKS, COURSE_LINKS, FOOTER_CONTACT_FALLBACK } from "./Footer.constants";

export default async function Footer() {
  const { data: config } = await getPublicSiteConfig();

  const direccion = config?.direccion ?? FOOTER_CONTACT_FALLBACK.direccion;
  const ciudad = config?.ciudad ?? FOOTER_CONTACT_FALLBACK.ciudad;
  const telefono = config?.telefono ?? FOOTER_CONTACT_FALLBACK.telefono;
  const email = config?.emailGeneral ?? FOOTER_CONTACT_FALLBACK.email;

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-[22px] pb-9 pt-11 md:px-14 md:pb-11 md:pt-16">
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-11">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo />
            <p className="mt-5 max-w-[300px] text-sm leading-[1.65] text-muted-foreground">
              Lo bello de la teoría en la práctica.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Academia
            </h2>
            <ul className="space-y-2.5 text-sm text-foreground/80">
              {ACADEMIA_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Cursos
            </h2>
            <ul className="space-y-2.5 text-sm text-foreground/80">
              {COURSE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Contacto
            </h2>
            <address className="flex flex-col gap-2.5 text-sm not-italic leading-normal text-foreground/80">
              <span>
                {direccion}
                <br />
                {ciudad}
              </span>
              <a href={`tel:${telefono.replace(/\s/g, "")}`} className="transition-colors hover:text-primary">
                {telefono}
              </a>
              <a href={`mailto:${email}`} className="transition-colors hover:text-primary">
                {email}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground md:mt-12 md:flex-row md:items-center md:justify-between md:border-0 md:pt-0">
          <p>© {getCurrentYear()} GOSMEL Music Academy. Todos los derechos reservados.</p>
          <div className="flex gap-2">
            <Link href="/privacy" className="transition-colors hover:text-primary">
              Privacidad
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="transition-colors hover:text-primary">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
