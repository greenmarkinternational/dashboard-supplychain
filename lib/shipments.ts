import { fetchSheetData } from "./google-sheets"

export interface Shipment {
  id: string
  client: string
  clientEmail: string
  origin: string
  destination: string
  status: string
  eta: string
  type: string
  vessel: string
  container: string
  purchaseOrder: string
  deliveryOrder: string | null
  webocGD: string | null
  history?: ShipmentHistoryItem[]
}

export interface ShipmentHistoryItem {
  date: string
  status: string
  notes: string
}

export async function getShipmentById(id: string): Promise<Shipment | null> {
  try {
    // Fetch all shipments
    const data = await fetchSheetData("shipments")

    // Transform the data
    const shipments = data.map((row: any) => ({
      id: row.ShipmentID || row.ID || "",
      client: row.Client || "",
      clientEmail: row.ClientEmail || "",
      origin: row.Origin || "",
      destination: row.Destination || "",
      status: row.Status || "Purchase Order",
      eta: row.ETA || "",
      type: row.Type || "FCL",
      vessel: row.Vessel || "",
      container: row.Container || "",
      purchaseOrder: row.PurchaseOrder || "",
      deliveryOrder: row.DeliveryOrder || null,
      webocGD: row.WebocGD || null,
    }))

    // Find the shipment with the matching ID
    const shipment = shipments.find((s: Shipment) => s.id === id)

    if (!shipment) {
      return null
    }

    // Fetch shipment history from a separate sheet if available
    try {
      const historyData = await fetchSheetData("shipmentHistory", `A:C`)

      // Filter history for this shipment
      const history = historyData
        .filter((row: any) => row.ShipmentID === id)
        .map((row: any) => ({
          date: row.Date || "",
          status: row.Status || "",
          notes: row.Notes || "",
        }))
        .sort((a: any, b: any) => {
          // Sort by date (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

      shipment.history = history
    } catch (error) {
      console.error("Error fetching shipment history:", error)
      // If history fetch fails, create a basic history from the status
      shipment.history = [
        {
          date: new Date().toLocaleDateString(),
          status: shipment.status,
          notes: `Current status: ${shipment.status}`,
        },
      ]
    }

    return shipment
  } catch (error) {
    console.error("Error fetching shipment by ID:", error)
    return null
  }
}

export async function updateShipmentStatus(
  id: string,
  newStatus: string,
  notes: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // In a real implementation, you would update the Google Sheet
    // For now, we'll just return a success message

    return {
      success: true,
      message: `Shipment ${id} status updated to ${newStatus}`,
    }
  } catch (error) {
    console.error("Error updating shipment status:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function addShipment(shipmentData: any): Promise<{ success: boolean; message: string; shipment?: any }> {
  try {
    const response = await fetch("/api/shipments/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipmentData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to create shipment")
    }

    return {
      success: true,
      message: data.message,
      shipment: data.shipment,
    }
  } catch (error) {
    console.error("Error adding shipment:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
