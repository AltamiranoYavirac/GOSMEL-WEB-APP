import { CTAForm } from "@/features/contact";

export default function CTASection() {
  return (
    <section className="py-24 bg-sand dark:bg-neutral-900 relative overflow-hidden" id="contacto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-cream dark:bg-neutral-800 overflow-hidden p-8 md:p-20 text-center border border-peach/50 dark:border-neutral-700/40 shadow-lg rounded-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ginger/8 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <span className="text-ginger uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
              Tu escenario te espera
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-cocoa dark:text-cream mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-cocoa/60 dark:text-cream/60 text-lg mb-12 max-w-2xl mx-auto font-light">
              Asegura tu lugar en nuestra academia. Solicita tu matrícula hoy mismo e inicia tu formación en nuestro programa ¡Tu viaje musical empieza aquí!.
            </p>
            <CTAForm />
            <p className="mt-6 text-xs text-cocoa/40 dark:text-cream/40 uppercase tracking-wide">
              Contáctanos sin ningun compromiso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
