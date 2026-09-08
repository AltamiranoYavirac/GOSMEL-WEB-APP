"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { IInstrumentDemandChartProps } from "./InstrumentDemandChart.types";

export default function InstrumentDemandChart({ data }: IInstrumentDemandChartProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-[15.5px] font-bold tracking-tight text-foreground">
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
                    fill="var(--color-foreground)"
                    fillOpacity={1 - index * 0.14}
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
