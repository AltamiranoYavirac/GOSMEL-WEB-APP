import type { IAboutValuesProps } from "./AboutValues.types";

export default function AboutValues({ values }: IAboutValuesProps) {
  return (
    <section className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10">

      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-ginger text-xs font-semibold uppercase tracking-widest">
          Valores Fundamentales
        </span>
        <h2 className="text-3xl font-bold text-cocoa dark:text-white">
          La Esencia de <span className="text-ginger">GOSMEL</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {values.map((value) => (
          <div
            key={value.title}
            className="flex flex-col gap-4"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group">
              <img
                src={value.imageUrl}
                alt={value.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-ginger font-bold text-lg uppercase tracking-widest">
                {value.title}
              </h3>
              <p className="text-cocoa/70 dark:text-neutral-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}