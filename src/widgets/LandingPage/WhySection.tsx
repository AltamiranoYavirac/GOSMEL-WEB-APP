import { Icon } from "@iconify/react";

const WHY_FEATURES = [
  {
    icon: "ph:graduation-cap",
    title: "Maestros Profesionales",
    description:
      "Instructores graduados de conservatorios de prestigio con años de experiencia pedagógica y artística.",
  },
  {
    icon: "ph:clock",
    title: "Horarios Flexibles",
    description:
      "Clases disponibles de lunes a sábado, adaptadas a tu ritmo de vida y compromisos.",
  },
  {
    icon: "ph:seal-check",
    title: "Vive la Experiencia del Escenario",
    description:
      "Cerramos cada etapa con una presentación en público. Es la oportunidad perfecta para consolidar lo aprendido, ganar confianza y celebrar tu evolución musical.",
  },
];

export default function WhySection() {
  return (
    <section className="py-24 bg-cream dark:bg-background border-t border-peach/30 dark:border-neutral-700/30" id="ventajas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1nqrahYmmMGKIDgAW_403eHVGAm7PHWUwhCEPJvmcRLoWvfxXSw3mqYbcePc4Gc1R7QkCAuSC9SWpDymLR0l1SyLjUjfhsZwY4YeH5dAAfgQoal22_sHBz90XrxrHLv_-wvmyQYApqlmLS9C0A8P-dG9kZU5Mo-c-OZD8uvdxsLf-ssMNr2zRqtMOcJDnVtgK5KfbW4F4IrJ3hpOVUdWexkqVeVQbwakfFzJiiIodWTvnZFs-sS4KmZO0GaI87cou11RNRctWH6yB"
                alt="Profesor explicando acordes de guitarra"
                className="rounded-2xl shadow-lg mt-10 border border-peach/30 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-500"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4mv-UY21Q1fK1WCjV_rq4qbvNc7eZryStU_JSyF_eYJJ4CLfdWiPSeMsBr7BY3wZbpAiaPQJs8DnW4uX7mW35J7TazB3CerWJpRwgrphXZG9Ga7MHxXT05AAcH382YRoehiXFETrqT95rVBUwjTkfYHI7NlkS4fsVx0fLjvxSKQFyF15HQX3Khg7rwO0pBM34n2hZDBdupZP6NDPqpAhjAw02cx-Ht1PVBdv3MWwoT3zxji8YmNVzYNzxzhqSHMphY-GojjIGCrAV"
                alt="Manos tocando teclas de piano"
                className="rounded-2xl shadow-lg mb-10 border border-peach/30 dark:border-neutral-700/30 hover:shadow-xl transition-all duration-500"
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-ginger rounded-full mix-blend-multiply blur-[80px] opacity-15 pointer-events-none" />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-bold text-cocoa dark:text-cream mb-8">
              ¿Por qué elegir{" "}
              <span className="text-ginger">GOSMEL?</span>
            </h2>
            <p className="text-cocoa/60 dark:text-cream/60 mb-12 text-lg font-light leading-relaxed">
              Nos dedicamos a crear un ambiente donde la música florece.
              Nuestra metodología combina lo tradicional con un
              enfoque moderno y humano.
            </p>

            <div className="space-y-10">
              {WHY_FEATURES.map(({ icon, title, description }) => (
                <div key={title} className="flex gap-6 group">
                  <div className="shrink-0 w-14 h-14 bg-peach/30 dark:bg-neutral-800 flex items-center justify-center text-ginger shadow-sm border border-peach/50 dark:border-neutral-700/40 group-hover:border-ginger group-hover:bg-ginger/10 transition-colors rounded-xl">
                    <Icon
                      icon={icon}
                      width={22}
                      height={22}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-cocoa dark:text-cream mb-2 group-hover:text-ginger transition-colors">
                      {title}
                    </h4>
                    <p className="text-cocoa/55 dark:text-cream/55 font-light">{description}</p>
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
