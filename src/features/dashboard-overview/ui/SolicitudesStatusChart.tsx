"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import type { ISolicitudesStatusChartProps } from "./SolicitudesStatusChart.types";

const COLORS = ["var(--color-chart-6)", "var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-7)"];

export default function SolicitudesStatusChart({ data }: ISolicitudesStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Solicitudes por estado</CardTitle>
      </CardHeader>
      <CardContent>
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
                    paddingAngle={3}
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
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-heading text-2xl font-semibold text-foreground">{total}</p>
                <p className="text-[11px] text-muted-foreground">Solicitudes</p>
              </div>
            </div>

            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {data.map((item, index) => (
                <li key={item.estado} className="flex items-center gap-2 text-xs">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">{item.label}</span>
                  <span className="font-semibold text-foreground">{item.total}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center py-12 text-center text-sm text-muted-foreground">
            Aún no hay solicitudes registradas.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
