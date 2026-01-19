"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
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
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
        <XAxis
          dataKey="time"
          stroke="var(--muted-foreground)"
          tick={{ fill: "var(--muted-foreground)" }}
          tickLine={{ stroke: "var(--border)" }}
        />
        <YAxis
          domain={[0.5, 1]}
          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          stroke="var(--muted-foreground)"
          tick={{ fill: "var(--muted-foreground)" }}
          tickLine={{ stroke: "var(--border)" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
          formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
        />
        <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
        <Brush
          dataKey="time"
          height={30}
          stroke="var(--primary)"
          travellerWidth={12}
          tickFormatter={() => ""}
        />
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
