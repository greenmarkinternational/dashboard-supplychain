"use client"

import { useMemo } from "react"
import { Box, Ship, Truck } from "lucide-react"
import { useSheetData } from "@/hooks/use-sheet-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Shipment {
  id: string
  status: string
}

export function DashboardMetrics() {
  const {
    data: shipments,
    isLoading,
    error,
  } = useSheetData<Shipment>({
    dataType: "shipments",
  })

  const metrics = useMemo(() => {
    if (!shipments)
      return {
        total: 0,
        inTransit: 0,
        pendingDelivery: 0,
        delivered: 0,
      }

    const total = shipments.length
    const inTransit = shipments.filter((s) => s.status === "In Transit").length
    const pendingDelivery = shipments.filter(
      (s) => s.status === "Destination Port" || s.status === "Customs Clearance",
    ).length
    const delivered = shipments.filter((s) => s.status === "Delivery").length

    return {
      total,
      inTransit,
      pendingDelivery,
      delivered,
    }
  }, [shipments])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[104px] w-full" />
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center p-4 text-red-500">
        <p>Error loading metrics: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          <Ship className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.total}</div>
          <p className="text-xs text-muted-foreground">All shipments in the system</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          <Ship className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.inTransit}</div>
          <p className="text-xs text-muted-foreground">
            {((metrics.inTransit / metrics.total) * 100).toFixed(0)}% of total shipments
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.pendingDelivery}</div>
          <p className="text-xs text-muted-foreground">Awaiting final delivery</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.delivered}</div>
          <p className="text-xs text-muted-foreground">Successfully completed</p>
        </CardContent>
      </Card>
    </div>
  )
}
