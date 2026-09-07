"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import type { IStudentPracticeChartProps } from "./StudentPracticeChart.types";

function formatoMinutos(minutos: number): string {
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const restante = minutos % 60;
    return restante > 0 ? `${horas}h ${restante}m` : `${horas}h`;
  }
  return `${minutos} min`;
}

export default function StudentPracticeChart({ data }: IStudentPracticeChartProps) {
  const hasData = data.some((point) => point.minutos > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Práctica de los últimos 7 días</CardTitle>
      </CardHeader>
      <CardContent className="h-56">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} vertical={false} />
              <XAxis
                dataKey="dia"
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={6}
                tickFormatter={(value: string) => {
                  const [, , dia] = value.split("-");
                  return dia;
                }}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={44}
                tickFormatter={(value: number) => `${value}m`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-popover)",
                  borderColor: "var(--color-border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                cursor={{ fill: "var(--color-accent-muted)" }}
                labelFormatter={(label) => new Date(String(label)).toLocaleDateString("es")}
                formatter={(value) => [formatoMinutos(Number(value)), "Minutos"]}
              />
              <Bar dataKey="minutos" fill="var(--color-primary-500)" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Aún no has practicado esta semana. ¡Registra tu primera sesión!
          </div>
        )}
      </CardContent>
    </Card>
  );
}