"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { IRevenueChartProps } from "./RevenueChart.types";

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md px-3.5 py-2 text-xs shadow-xl">
      <p className="font-bold capitalize text-foreground">{label}</p>
      <p className="mt-0.5 font-heading text-sm font-bold text-primary">
        ${payload[0].value.toLocaleString("es", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: IRevenueChartProps) {
  const hasRevenue = data.some((point) => point.total > 0);

  return (
    <div className="h-full rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-6 sm:p-8 flex flex-col justify-between gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Ingresos — últimos 6 meses
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary bg-background border border-white/60 dark:border-white/5 shadow-[-1px_-1px_3px_rgba(255,255,255,0.8),1px_1px_3px_rgba(169,146,125,0.15)] dark:shadow-[-1px_-1px_3px_rgba(255,255,255,0.02),1px_1px_3px_rgba(0,0,0,0.4)] px-2.5 py-1 rounded-full">
          USD ($)
        </span>
      </div>

      <div className="h-64 w-full">
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity={0.35} />
                  <stop offset="55%" stopColor="var(--color-primary-500)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity={0} />
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
              <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "var(--color-primary-500)", strokeDasharray: "3 3" }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-primary-500)"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={{ r: 3.5, fill: "var(--color-background)", stroke: "var(--color-primary-500)", strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: "var(--color-primary-500)", stroke: "var(--color-background)", strokeWidth: 2 }}
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
