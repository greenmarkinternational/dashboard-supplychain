"use client"

import { AlertCircle, Bell, Clock, FileText, Ship, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const notifications = [
  {
    id: "not-001",
    title: "Vessel Arrival Alert",
    description: "Vessel 'MSC Bellissima' has arrived at Karachi Port (KICT)",
    time: "10 minutes ago",
    type: "arrival",
    read: false,
  },
  {
    id: "not-002",
    title: "Customs Clearance Delay",
    description: "Shipment SHP-2025-003 is facing customs clearance delays",
    time: "1 hour ago",
    type: "alert",
    read: false,
  },
  {
    id: "not-003",
    title: "Delivery Order Issued",
    description: "Delivery Order for shipment SHP-2025-005 has been issued",
    time: "3 hours ago",
    type: "document",
    read: false,
  },
  {
    id: "not-004",
    title: "Delivery Scheduled",
    description: "Delivery for shipment SHP-2025-005 scheduled for May 7, 9:00 AM",
    time: "5 hours ago",
    type: "delivery",
    read: true,
  },
  {
    id: "not-005",
    title: "Shipment Delay",
    description: "Shipment SHP-2025-001 will be delayed by 2 days due to port congestion",
    time: "Yesterday",
    type: "alert",
    read: true,
  },
]

export function NotificationCenter() {
  const getIcon = (type: string) => {
    switch (type) {
      case "arrival":
        return <Ship className="h-4 w-4 text-blue-500" />
      case "alert":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "document":
        return <FileText className="h-4 w-4 text-green-500" />
      case "delivery":
        return <Truck className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <div key={notification.id}>
          <Card className={notification.read ? "bg-muted/50" : "bg-background"}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium leading-none">{notification.title}</p>
                    {!notification.read && (
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                  <div className="flex items-center pt-2">
                    <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {index < notifications.length - 1 && <Separator className="my-1" />}
        </div>
      ))}
    </div>
  )
}
