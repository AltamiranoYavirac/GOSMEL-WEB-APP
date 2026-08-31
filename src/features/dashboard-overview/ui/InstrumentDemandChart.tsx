"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { IInstrumentDemandChartProps } from "./InstrumentDemandChart.types";

export default function InstrumentDemandChart({ data }: IInstrumentDemandChartProps) {
  return (
    <div className="h-full rounded-3xl bg-background border border-white/60 dark:border-white/5 shadow-[-8px_-8px_20px_rgba(255,255,255,0.9),8px_8px_20px_rgba(169,146,125,0.22)] dark:shadow-[-8px_-8px_20px_rgba(255,255,255,0.04),8px_8px_22px_rgba(0,0,0,0.65)] p-6 sm:p-7 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Instrumentos más demandados
        </h3>
      </div>

      <div className="h-64 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 28, left: 0, bottom: 0 }} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} horizontal={false} />
              <XAxis
                type="number"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                domain={[0, (dataMax: number) => Math.ceil((dataMax + 4) / 9) * 9]}
              />
              <YAxis
                type="category"
                dataKey="instrumento"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={72}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-popover)",
                  borderColor: "var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                cursor={{ fill: "var(--color-accent-muted)" }}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={16}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.instrumento}
                    fill={index === 0 ? "var(--color-primary-500)" : "var(--color-accent-soft)"}
                    fillOpacity={index === 0 ? 1 : 1 - index * 0.12}
                  />
                ))}
                <LabelList
                  dataKey="total"
                  position="right"
                  fill="var(--color-muted-foreground)"
                  fontSize={12}
                  formatter={(value: unknown) => new Intl.NumberFormat("es").format(Number(value))}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground font-light">
            Aún no hay datos de instrumentos demandados.
          </div>
        )}
      </div>
    </div>
  );
}
