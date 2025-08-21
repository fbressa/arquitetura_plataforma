"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    month: "Jan",
    receita: 18000,
  },
  {
    month: "Fev",
    receita: 22000,
  },
  {
    month: "Mar",
    receita: 32000,
  },
  {
    month: "Abr",
    receita: 28000,
  },
  {
    month: "Mai",
    receita: 35000,
  },
  {
    month: "Jun",
    receita: 45000,
  },
]

export function RevenueChart() {
  return (
    <ChartContainer
      config={{
        receita: {
          label: "Receita",
          color: "hsl(25, 100%, 50%)",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value / 1000}k`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatValue={(value) => `R$ ${value.toLocaleString()}`} />}
          />
          <Bar dataKey="receita" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
