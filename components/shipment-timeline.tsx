"use client"

import { CheckCircle2, Circle, Clock, HelpCircle } from "lucide-react"
import type { ShipmentHistoryItem } from "@/lib/shipments"

interface ShipmentTimelineProps {
  history: ShipmentHistoryItem[]
  currentStatus: string
}

export function ShipmentTimeline({ history, currentStatus }: ShipmentTimelineProps) {
  // Define the standard shipment statuses in order
  const standardStatuses = [
    "Purchase Order",
    "Origin Port",
    "In Transit",
    "Destination Port",
    "Customs Clearance",
    "Delivery",
  ]

  // Find the index of the current status
  const currentStatusIndex = standardStatuses.indexOf(currentStatus)

  return (
    <div className="space-y-4">
      <div className="flex justify-between px-2">
        {standardStatuses.map((status, index) => {
          // Determine if this status is completed, current, or upcoming
          const isCompleted = currentStatusIndex > index
          const isCurrent = currentStatusIndex === index
          const isUpcoming = currentStatusIndex < index

          return (
            <div key={status} className="flex flex-col items-center">
              <div className="relative">
                {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                {isCurrent && <Clock className="h-6 w-6 text-blue-500" />}
                {isUpcoming && <Circle className="h-6 w-6 text-gray-300" />}

                {/* Connector line */}
                {index < standardStatuses.length - 1 && (
                  <div
                    className={`absolute top-3 left-6 h-0.5 w-[calc(100%+1.5rem)] -translate-y-1/2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCurrent ? "text-blue-500" : isCompleted ? "text-green-500" : "text-gray-500"
                }`}
              >
                {status}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-medium">Status History</h3>
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="flex gap-4 rounded-lg border p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <HelpCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.status}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
