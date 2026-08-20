"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import type { IInstrumentDemandChartProps } from "./InstrumentDemandChart.types";

export default function InstrumentDemandChart({ data }: IInstrumentDemandChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Instrumentos más demandados</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 28, left: 0, bottom: 0 }} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
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
                  borderRadius: 8,
                  fontSize: 12,
                }}
                cursor={{ fill: "var(--color-accent-muted)" }}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={16}>
                {data.map((entry, index) => (
                  <Cell
                    key={entry.instrumento}
                    fill={index === 0 ? "var(--color-chart-6)" : "var(--color-chart-2)"}
                    fillOpacity={index === 0 ? 1 : 1 - index * 0.1}
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
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Aún no hay estudiantes con instrumento asignado.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
