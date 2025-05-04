"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useSheetData } from "@/hooks/use-sheet-data"
import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface Shipment {
  id: string
  status: string
}

export function ShipmentStatusChart() {
  const {
    data: shipments,
    isLoading,
    error,
  } = useSheetData<Shipment>({
    dataType: "shipments",
  })

  const chartData = useMemo(() => {
    if (!shipments) return []

    const statusCounts: Record<string, number> = {}

    shipments.forEach((shipment) => {
      const status = shipment.status || "Unknown"
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    const statusColors: Record<string, string> = {
      "Purchase Order": "#adfa1d",
      "Origin Port": "#a855f7",
      "In Transit": "#06b6d4",
      "Destination Port": "#f97316",
      "Customs Clearance": "#eab308",
      Delivery: "#22c55e",
      Unknown: "#94a3b8",
    }

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      fill: statusColors[name] || "#94a3b8",
    }))
  }, [shipments])

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (error) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-red-500">
        <p>Error loading chart data: {error.message}</p>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <ChartContainer className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltip>
                      <ChartTooltipContent
                        content={
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold">{payload[0].payload.name}</span>
                            <span className="text-xs">{payload[0].value} Shipments</span>
                          </div>
                        }
                      />
                    </ChartTooltip>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Card>
  )
}
