"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LeaderboardTable } from "@/components/leaderboard-table"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { ProviderComparison } from "@/components/provider-comparison"
import { sampleAuditResults } from "@/lib/mock-data"
import type { AuditResult } from "@/lib/types"

export default function Page() {
  const [auditResults, setAuditResults] = useState<AuditResult[]>(sampleAuditResults)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://api.github.com/repos/luke-marks0-temp/difr-demo/contents/data")
        const files = await response.json()

        // Filter for JSON files
        const jsonFiles = files.filter((file: any) => file.name.endsWith(".json"))

        if (jsonFiles.length === 0) {
          throw new Error("No JSON files found")
        }

        // Fetch all JSON files
        const results: AuditResult[] = []
        for (const file of jsonFiles) {
          const fileResponse = await fetch(file.download_url)
          const fileData = await fileResponse.json()

          // Parse filename to extract model and timestamp
          // Format: ModelName_audit_results_YYYYMMDD_HHMMSS.json
          const match = file.name.match(/(.+)_audit_results_(\d{8}_\d{6})\.json/)
          if (match) {
            const [, modelName, timestamp] = match
            // Convert timestamp to ISO format
            const formattedTimestamp = `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}T${timestamp.slice(9, 11)}:${timestamp.slice(11, 13)}:${timestamp.slice(13, 15)}`
            
            results.push({
              model: fileData.model ?? modelName.replace(/_/g, "/"),
              timestamp: formattedTimestamp,
              providers: fileData.providers ?? {},
            })
          }
        }

        if (results.length > 0) {
          setAuditResults(results)
          setSelectedModel(results[0].model)
        } else {
          throw new Error("No valid audit results found")
        }
      } catch (error) {
        console.error("Error fetching audit results:", error)
        // Fallback to mock data on error
        setAuditResults(sampleAuditResults)
        setSelectedModel(sampleAuditResults[0]?.model || "")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get unique models
  const models = Array.from(new Set(auditResults.map((r) => r.model)))

  // Get unique providers
  const allProviders = Array.from(new Set(auditResults.flatMap((r) => Object.keys(r.providers))))

  // Calculate aggregate leaderboard data
  const leaderboardData = allProviders.map((provider) => {
    const providerResults = auditResults.filter((r) => r.providers[provider])
  
    // Extract scores and drop NaN / non-numeric values
    const rawScores = providerResults.map((r) => r.providers[provider]?.exact_match_rate)
    const scores = rawScores.filter((v): v is number => typeof v === "number" && Number.isFinite(v))
  
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const modelCount = new Set(providerResults.map((r) => r.model)).size
  
    return {
      provider,
      avgScore,
      modelCount,
      dataPoints: scores.length,
    }
  })
  
  // Sort by average score
  leaderboardData.sort((a, b) => b.avgScore - a.avgScore)

  // Get time series data for selected model
  const timeSeriesData = selectedModel
    ? auditResults
        .filter((r) => r.model === selectedModel)
        .map((r) => ({
          timestamp: r.timestamp,
          ...Object.fromEntries(Object.entries(r.providers).map(([name, data]) => [name, data.exact_match_rate])),
        }))
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading audit results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold tracking-tight">DiFR Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Inference reliability metrics</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Overall Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Provider Rankings</CardTitle>
            <CardDescription>Average exact match rate across all models and timestamps</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaderboardTable data={leaderboardData} />
          </CardContent>
        </Card>

        {/* Model-Specific Timeline */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Provider Performance Over Time</CardTitle>
                <CardDescription>Exact match rate timeline for selected model</CardDescription>
              </div>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full sm:w-[320px]">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {timeSeriesData.length > 0 ? (
              <TimeSeriesChart data={timeSeriesData} providers={allProviders} />
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                Select a model to view timeline
              </div>
            )}
          </CardContent>
        </Card>

        {/* Provider Comparison */}
        {selectedModel && (
          <ProviderComparison
            model={selectedModel}
            auditResults={auditResults.filter((r) => r.model === selectedModel)}
          />
        )}
      </div>
    </div>
  )
}
