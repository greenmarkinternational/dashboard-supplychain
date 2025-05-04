import type { Metadata } from "next"
import { SendNotification } from "@/components/send-notification"

export const metadata: Metadata = {
  title: "Notifications | ShipTrack Pro",
  description: "Send notifications to clients about their shipments",
}

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">Client Notifications</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <SendNotification />
        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Notification Types</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">ETA Update</h3>
                <p className="text-sm text-muted-foreground">
                  Notify clients about the expected time of arrival for their shipment.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Vessel Arrival</h3>
                <p className="text-sm text-muted-foreground">
                  Inform clients when their shipment has arrived at the port.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Delivery Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Share delivery details including date, time, and location.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Delivery Confirmation</h3>
                <p className="text-sm text-muted-foreground">Confirm successful delivery of the shipment.</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Notification History</h2>
            <p className="text-muted-foreground">
              Notification history will be available in a future update. This will allow you to track all communications
              sent to clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
