import type { IDashboardWelcomeProps } from "./DashboardWelcome.types";

const TODAY = new Intl.DateTimeFormat("es", { weekday: "long", day: "numeric", month: "long" });

export default function DashboardWelcome({ adminName }: IDashboardWelcomeProps) {
  const fecha = TODAY.format(new Date());

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-faint" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-[25px]">
            Hola, {adminName}
          </h2>
          <p className="mt-1.5 text-sm font-medium text-muted-foreground">
            Bienvenido de nuevo a tu panel de control.
          </p>
        </div>
        <span className="shrink-0 self-start rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-semibold capitalize text-muted-foreground">
          {fecha}
        </span>
      </div>
    </section>
  );
}
