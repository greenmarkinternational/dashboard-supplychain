export interface NotificationTemplate {
  subject: string
  body: string
}

export interface NotificationData {
  shipmentId: string
  clientEmail: string
  clientName: string
  notificationType: "eta" | "arrival" | "delivery" | "delivered"
  additionalData?: Record<string, string>
}

export async function sendNotification(data: NotificationData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to send notification")
    }

    const result = await response.json()
    return { success: true, message: result.message }
  } catch (error) {
    console.error("Error sending notification:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export function getNotificationTemplates(type: string, data: Record<string, string> = {}): NotificationTemplate {
  const templates: Record<string, NotificationTemplate> = {
    eta: {
      subject: "Expected Time of Arrival Update",
      body: `Dear ${data.clientName || "Client"},

Your shipment ${data.shipmentId} is expected to arrive on ${data.etaDate || "[ETA_DATE]"}.

Please let us know if you have any questions.

Regards,
ShipTrack Pro Team`,
    },
    arrival: {
      subject: "Vessel Arrival Notification",
      body: `Dear ${data.clientName || "Client"},

Your shipment ${data.shipmentId} has arrived at ${data.port || "the port"} on ${data.arrivalDate || "[ARRIVAL_DATE]"}.

We will keep you updated on the customs clearance process.

Regards,
ShipTrack Pro Team`,
    },
    delivery: {
      subject: "Delivery Plan Notification",
      body: `Dear ${data.clientName || "Client"},

Your shipment ${data.shipmentId} is ready for delivery. 

Delivery Details:
- Date: ${data.deliveryDate || "[DELIVERY_DATE]"}
- Time: ${data.deliveryTime || "[DELIVERY_TIME]"}
- Location: ${data.deliveryLocation || "[DELIVERY_LOCATION]"}

Please ensure someone is available to receive the shipment.

Regards,
ShipTrack Pro Team`,
    },
    delivered: {
      subject: "Delivery Confirmation",
      body: `Dear ${data.clientName || "Client"},

Your shipment ${data.shipmentId} has been successfully delivered on ${data.deliveredDate || "[DELIVERED_DATE]"}.

Thank you for your business.

Regards,
ShipTrack Pro Team`,
    },
  }

  return (
    templates[type] || {
      subject: "Shipment Update",
      body: `Dear Client,

This is an update regarding your shipment ${data.shipmentId}.

Regards,
ShipTrack Pro Team`,
    }
  )
}
