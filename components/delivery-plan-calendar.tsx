"use client"

import { Calendar, Clock, MapPin } from "lucide-react"
import { useSheetData } from "@/hooks/use-sheet-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Delivery {
  id: string
  shipmentId: string
  client: string
  date: string
  time: string
  location: string
  status: string
}

export function DeliveryPlanCalendar() {
  const {
    data: deliveries,
    isLoading,
    error,
  } = useSheetData<Delivery>({
    dataType: "deliveries",
    refreshInterval: 300000, // Refresh every 5 minutes
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center p-4 text-red-500">
        <p>Error loading deliveries: {error.message}</p>
      </div>
    )
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="flex justify-center p-4 text-muted-foreground">
        <p>No upcoming deliveries</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex border-l-4 border-primary p-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{delivery.client}</div>
                  <Badge variant={delivery.status === "Scheduled" ? "default" : "outline"}>{delivery.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Shipment: {delivery.shipmentId}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{delivery.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{delivery.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{delivery.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
