import { NextResponse } from "next/server"
import { getShipmentById, updateShipmentStatus } from "@/lib/shipments"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const shipment = await getShipmentById(id)

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    return NextResponse.json(shipment)
  } catch (error) {
    console.error("Error fetching shipment:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status, notes } = await request.json()

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const result = await updateShipmentStatus(id, status, notes || "")

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("Error updating shipment:", error)
    return NextResponse.json(
      {
        error: "Failed to update shipment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
