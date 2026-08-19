import { Card, IconTile } from "@/shared/ui";

const HIGHLIGHTS = [
  {
    icon: "mdi:music-note",
    title: "Clase de prueba",
    description: "Gratuita y sin compromiso",
  },
  {
    icon: "ph:clock",
    title: "Respuesta rápida",
    description: "En menos de 24 horas",
  },
  {
    icon: "mdi:map-marker",
    title: "Ubicación",
    description: "Quito - Ecuador",
  },
];

export default function ContactHighlights() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {HIGHLIGHTS.map(({ icon, title, description }) => (
        <Card key={title} className="rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <IconTile icon={icon} size="md" iconSize={24} />
            <div>
              <p className="text-foreground font-semibold">{title}</p>
              <p className="text-muted-foreground text-sm mt-0.5">{description}</p>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
