export const metadata = {
  title: "Términos y Condiciones | GOSMEL Music Academy",
  description:
    "Términos y condiciones de uso del sitio y los servicios de GOSMEL Music Academy.",
};

export default function TermsPage() {
  return (
    <div className="px-4 pb-20 pt-32 sm:px-6 md:pt-40 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Legal · GOSMEL
          </span>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Última actualización: agosto de 2026
          </p>
        </div>

        <div className="flex flex-col gap-8 text-muted-foreground">
          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              1. Aceptación de los términos
            </h2>
            <p className="leading-relaxed">
              Al acceder a este sitio web y crear una cuenta en GOSMEL Music Academy, aceptas los
              presentes términos y condiciones en su totalidad. Si no estás de acuerdo con ellos,
              te pedimos que no utilices nuestros servicios.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              2. Registro y cuenta
            </h2>
            <p className="leading-relaxed">
              Para acceder a ciertos servicios debes crear una cuenta proporcionando información
              veraz y actualizada. Eres responsable de mantener la confidencialidad de tus
              credenciales y de todas las actividades realizadas desde tu cuenta. Notifica
              cualquier uso no autorizado a{" "}
              <span className="text-primary">andymelabur@gmail.com</span>.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              3. Uso del servicio
            </h2>
            <p className="leading-relaxed">
              Te comprometes a usar el sitio y sus contenidos exclusivamente con fines legales y de
              acuerdo con estos términos. Queda prohibido el uso de los servicios para fines
              fraudulentos, la suplantación de identidad o cualquier actividad que afecte el
              funcionamiento de la plataforma o los derechos de terceros.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              4. Matrícula y pagos
            </h2>
            <p className="leading-relaxed">
              Las condiciones de matrícula, cuotas y pagos se comunican directamente a los
              estudiantes y sus representantes. El impago puede conllevar la suspensión de la
              cuenta o del acceso a los servicios hasta regularizar la situación.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              5. Propiedad intelectual
            </h2>
            <p className="leading-relaxed">
              Los contenidos del sitio, incluidos textos, imágenes, logotipos y materiales
              didácticos, son propiedad de GOSMEL Music Academy o de sus licenciantes. No está
              permitida su reproducción, distribución o uso comercial sin autorización previa por
              escrito.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              6. Limitación de responsabilidad
            </h2>
            <p className="leading-relaxed">
              El sitio se proporciona &quot;tal cual&quot;. GOSMEL Music Academy no garantiza la
              disponibilidad ininterrumpida del servicio ni será responsable de daños directos o
              indirectos derivados del uso o la imposibilidad de uso de la plataforma, salvo en los
              casos en que la ley lo exija.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              7. Ley aplicable
            </h2>
            <p className="leading-relaxed">
              Estos términos se rigen por las leyes de la República del Ecuador. Cualquier
              controversia derivada de su interpretación o cumplimiento se someterá a la
              jurisdicción de los tribunales competentes de Quito, Ecuador.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}