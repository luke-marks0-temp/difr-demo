"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const CHART_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
]

type TimeSeriesData = {
  timestamp: string
  [key: string]: string | number
}

export function TimeSeriesChart({
  data,
  providers,
}: {
  data: TimeSeriesData[]
  providers: string[]
}) {
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      time: new Date(
        item.timestamp.toString().replace(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/, "$1-$2-$3T$4:$5:$6"),
      ).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickLine={{ stroke: "hsl(var(--border))" }}
        />
        <YAxis
          domain={[0.5, 1]}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickLine={{ stroke: "hsl(var(--border))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
        {providers.map((provider, index) => (
          <Line
            key={provider}
            type="monotone"
            dataKey={provider}
            stroke={CHART_COLORS[index % CHART_COLORS.length]}
            strokeWidth={3}
            dot={{
              r: 6,
              fill: CHART_COLORS[index % CHART_COLORS.length],
              stroke: CHART_COLORS[index % CHART_COLORS.length],
              strokeWidth: 2,
            }}
            activeDot={{ r: 8 }}
            name={provider}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
