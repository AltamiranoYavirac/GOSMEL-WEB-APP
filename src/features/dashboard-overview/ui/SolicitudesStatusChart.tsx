"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { ISolicitudesStatusChartProps } from "./SolicitudesStatusChart.types";

const COLORS = ["var(--color-info)", "var(--color-warning)", "var(--color-success)", "var(--color-muted-foreground)"];

export default function SolicitudesStatusChart({ data }: ISolicitudesStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div>
        <h3 className="font-heading text-base font-bold tracking-tight text-foreground">
          Solicitudes por estado
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Este mes</p>
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
