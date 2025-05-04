import { NextResponse } from "next/server"
import {
  fetchSheetData,
  transformShipmentData,
  transformPurchaseOrderData,
  transformDeliveryData,
} from "@/lib/google-sheets"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get("type") || "shipments"

    let data
    let transformedData

    switch (dataType) {
      case "shipments":
        data = await fetchSheetData("shipments")
        transformedData = transformShipmentData(data)
        break
      case "purchaseOrders":
        data = await fetchSheetData("purchaseOrders")
        transformedData = transformPurchaseOrderData(data)
        break
      case "deliveries":
        data = await fetchSheetData("deliveries")
        transformedData = transformDeliveryData(data)
        break
      case "inventory":
        data = await fetchSheetData("inventory")
        transformedData = data // No specific transformation needed
        break
      default:
        return NextResponse.json({ error: "Invalid data type" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
    })
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch data from Google Sheets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
