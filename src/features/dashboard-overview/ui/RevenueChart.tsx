"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import type { IRevenueChartProps } from "./RevenueChart.types";

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-semibold capitalize text-foreground">{label}</p>
      <p className="mt-0.5 font-heading text-sm font-semibold text-primary dark:text-primary-300">
        ${payload[0].value.toLocaleString("es", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default function RevenueChart({ data }: IRevenueChartProps) {
  const hasRevenue = data.some((point) => point.total > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ingresos — últimos 6 meses</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-6)" stopOpacity={0.32} />
                  <stop offset="55%" stopColor="var(--color-chart-1)" stopOpacity={0.14} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
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
              <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "var(--color-border)", strokeDasharray: "3 3" }} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--color-chart-1)"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={{ r: 3, fill: "var(--color-popover)", stroke: "var(--color-chart-1)", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "var(--color-chart-6)", stroke: "var(--color-popover)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Aún no hay pagos registrados en este período.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
