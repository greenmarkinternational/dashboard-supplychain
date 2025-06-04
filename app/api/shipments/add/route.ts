import { NextResponse } from "next/server"
import { getGoogleSheetsClient } from "@/lib/google-sheets"

export async function POST(request: Request) {
  try {
    const shipmentData = await request.json()

    // Validate required fields
    const requiredFields = ["client", "clientEmail", "origin", "destination", "type", "purchaseOrder"]
    const missingFields = requiredFields.filter((field) => !shipmentData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Generate a new shipment ID
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")

    const shipmentId = `SHP-${year}${month}${day}-${randomSuffix}`

    // Prepare data for Google Sheets
    const newShipment = {
      ShipmentID: shipmentId,
      Client: shipmentData.client,
      ClientEmail: shipmentData.clientEmail,
      Origin: shipmentData.origin,
      Destination: shipmentData.destination,
      Status: "Purchase Order", // Default initial status
      ETA: shipmentData.eta || "",
      Type: shipmentData.type,
      Vessel: shipmentData.vessel || "",
      Container: shipmentData.container || "",
      PurchaseOrder: shipmentData.purchaseOrder,
      DeliveryOrder: "",
      WebocGD: "",
      CreatedAt: `${year}-${month}-${day}`,
    }

    // Add to Google Sheets
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.SHIPMENT_SPREADSHEET_ID

    if (!spreadsheetId) {
      throw new Error("Shipment spreadsheet ID not configured")
    }

    // Get the headers first to ensure we're adding data in the correct order
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Shipments!A1:Z1",
    })

    const headers = headerResponse.data.values?.[0] || []

    // Create a row with values in the same order as headers
    const rowValues = headers.map((header) => {
      const key = header as keyof typeof newShipment
      return newShipment[key] || ""
    })

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Shipments!A2:Z2", // Start appending after the header row
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [rowValues],
      },
    })

    // Add to shipment history sheet if it exists
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "ShipmentHistory!A2:C2",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              shipmentId, // ShipmentID
              `${year}-${month}-${day}`, // Date
              "Purchase Order", // Status
              "Shipment created", // Notes
            ],
          ],
        },
      })
    } catch (historyError) {
      console.error("Error adding shipment history (non-critical):", historyError)
      // Continue even if history update fails
    }

    return NextResponse.json({
      success: true,
      message: "Shipment created successfully",
      shipment: {
        id: shipmentId,
        ...shipmentData,
        status: "Purchase Order",
      },
    })
  } catch (error) {
    console.error("Error creating shipment:", error)
    return NextResponse.json(
      {
        error: "Failed to create shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
