import { NextResponse } from "next/server"

// Mock data for demonstration
const shipments = [
  {
    id: "SHP-2025-001",
    client: "ABC Electronics",
    clientEmail: "contact@abcelectronics.com",
    origin: "Shanghai",
    destination: "Karachi (KICT)",
    status: "In Transit",
    eta: "May 8, 2025",
    type: "FCL",
    vessel: "MSC Bellissima",
    container: "MSCU1234567",
    purchaseOrder: "PO-2025-001",
    deliveryOrder: null,
    webocGD: null,
    history: [
      { date: "April 10, 2025", status: "Purchase Order", notes: "Purchase order created" },
      { date: "April 20, 2025", status: "Origin Port", notes: "Cargo arrived at origin port" },
      { date: "April 25, 2025", status: "In Transit", notes: "Vessel departed from Shanghai" },
    ],
  },
  {
    id: "SHP-2025-002",
    client: "Global Traders",
    clientEmail: "operations@globaltraders.com",
    origin: "Dubai",
    destination: "Karachi (SAPT)",
    status: "Origin Port",
    eta: "May 12, 2025",
    type: "FCL",
    vessel: "CMA CGM Marco Polo",
    container: "CMAU7654321",
    purchaseOrder: "PO-2025-002",
    deliveryOrder: null,
    webocGD: null,
    history: [
      { date: "April 15, 2025", status: "Purchase Order", notes: "Purchase order created" },
      { date: "April 28, 2025", status: "Origin Port", notes: "Cargo arrived at origin port" },
    ],
  },
  {
    id: "SHP-2025-003",
    client: "Tech Solutions",
    clientEmail: "logistics@techsolutions.com",
    origin: "Singapore",
    destination: "Port Qasim (QICT)",
    status: "Customs Clearance",
    eta: "May 5, 2025",
    type: "LCL",
    vessel: "Maersk Seletar",
    container: "MRKU9876543",
    purchaseOrder: "PO-2025-003",
    deliveryOrder: "DO-2025-003",
    webocGD: "GD-2025-003",
    history: [
      { date: "April 5, 2025", status: "Purchase Order", notes: "Purchase order created" },
      { date: "April 12, 2025", status: "Origin Port", notes: "Cargo arrived at origin port" },
      { date: "April 15, 2025", status: "In Transit", notes: "Vessel departed from Singapore" },
      { date: "May 2, 2025", status: "Destination Port", notes: "Vessel arrived at Port Qasim" },
      { date: "May 3, 2025", status: "Customs Clearance", notes: "Customs processing initiated" },
    ],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const shipment = shipments.find((s) => s.id === id)
    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }
    return NextResponse.json(shipment)
  }

  return NextResponse.json({ shipments })
}

export async function POST(request: Request) {
  try {
    const shipmentData = await request.json()

    // In a real implementation, this would save to a database
    // This is a placeholder for demonstration purposes

    const newShipment = {
      id: `SHP-2025-${(shipments.length + 1).toString().padStart(3, "0")}`,
      ...shipmentData,
      history: [
        {
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          status: "Purchase Order",
          notes: "Purchase order created",
        },
      ],
    }

    // Mock successful creation
    return NextResponse.json({
      success: true,
      message: "Shipment created successfully",
      shipment: newShipment,
    })
  } catch (error) {
    console.error("Error creating shipment:", error)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}
