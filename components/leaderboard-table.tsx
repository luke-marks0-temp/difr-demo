import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type LeaderboardData = {
  provider: string
  avgScore: number
  modelCount: number
  dataPoints: number
}

export function LeaderboardTable({ data }: { data: LeaderboardData[] }) {
  const getScoreColor = (score: number) => {
    if (score >= 0.95) return "text-chart-1"
    if (score >= 0.9) return "text-chart-2"
    if (score >= 0.85) return "text-chart-4"
    return "text-muted-foreground"
  }

  const rows = data.filter((item) => item.dataPoints > 0)

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead className="text-right">Avg Exact Match Rate</TableHead>
            <TableHead className="text-right">Models</TableHead>
            <TableHead className="text-right">Data Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((item, index) => (
            <TableRow key={item.provider} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                <span>#{index + 1}</span>
              </TableCell>
              <TableCell className="font-mono text-sm">{item.provider}</TableCell>
              <TableCell className="text-right">
                <span className={`text-lg font-bold ${getScoreColor(item.avgScore)}`}>
                  {(item.avgScore * 100).toFixed(2)}%
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{item.modelCount}</Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{item.dataPoints}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
