"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { ISolicitudesStatusChartProps } from "./SolicitudesStatusChart.types";

const COLORS = ["var(--color-primary-500)", "var(--color-secondary-500)", "var(--color-accent-500)", "var(--color-muted-foreground)"];

export default function SolicitudesStatusChart({ data }: ISolicitudesStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="h-full rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-6 sm:p-8 flex flex-col justify-between gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Solicitudes por estado
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
          Resumen
        </span>
      </div>

      <div>
        {total > 0 ? (
          <div>
            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="label"
                    innerRadius={54}
                    outerRadius={74}
                    paddingAngle={4}
                    cornerRadius={6}
                    strokeWidth={0}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.estado} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-popover)",
                      borderColor: "var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-heading text-3xl font-bold text-foreground">{total}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Total</p>
              </div>
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {data.map((item, index) => (
                <li key={item.estado} className="flex items-center gap-2 text-xs">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate text-muted-foreground">{item.label}</span>
                  <span className="ml-auto font-mono text-xs font-bold text-foreground">{item.total}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground font-light">
            No hay solicitudes registradas aún.
          </p>
        )}
      </div>
    </div>
  );
}
