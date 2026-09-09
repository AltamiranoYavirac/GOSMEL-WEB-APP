"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { IRevenueChartProps } from "./RevenueChart.types";
import RevenueTooltip from "./RevenueTooltip";

export default function RevenueChart({ data }: IRevenueChartProps) {
  const hasRevenue = data.some((point) => point.total > 0);

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold tracking-tight text-foreground">Ingresos</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Últimos 6 meses</p>
        </div>
        <span className="rounded-full bg-foreground/10 px-2.5 py-1 text-[0.6875rem] font-bold text-foreground">
          6M
        </span>
      </div>

      <div className="h-64 w-full">
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} vertical={false} />
              <XAxis
                dataKey="month"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={6}
                tickFormatter={(value: string) => value.charAt(0).toUpperCase() + value.slice(1)}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={44}
                tickFormatter={(value: number) => `$${value.toLocaleString("es")}`}
              />
              <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "var(--color-foreground)", strokeDasharray: "3 3" }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-foreground)"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={{ r: 3.5, fill: "var(--color-background)", stroke: "var(--color-foreground)", strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: "var(--color-foreground)", stroke: "var(--color-background)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground font-light">
            Aún no hay pagos registrados en este período.
          </div>
        )}
      </div>
    </div>
  );
}
