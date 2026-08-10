const STATS = [
  { value: "5+", label: "Años de Experiencia" },
  { value: "10+", label: "Programas Instrumentales" },
  { value: "100%", label: "Clases Personalizadas" },
  { value: "100%", label: "Pasión por la Música" },
];

export default function StatsSection() {
  return (
    <div className="bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-foreground/20">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="text-5xl font-bold text-primary-foreground mb-2">{value}</div>
              <div className="text-primary-foreground/70 text-xs uppercase tracking-widest">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
