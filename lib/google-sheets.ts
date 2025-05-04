import { google } from "googleapis"

// Spreadsheet IDs for different data sources
const SPREADSHEET_IDS = {
  shipments: process.env.SHIPMENT_SPREADSHEET_ID,
  purchaseOrders: process.env.PURCHASE_ORDERS_SPREADSHEET_ID || process.env.SHIPMENT_SPREADSHEET_ID,
  deliveries: process.env.DELIVERIES_SPREADSHEET_ID || process.env.SHIPMENT_SPREADSHEET_ID,
  inventory: process.env.INVENTORY_SPREADSHEET_ID || process.env.SHIPMENT_SPREADSHEET_ID,
}

// Sheet names within spreadsheets
const SHEET_NAMES = {
  shipments: "Shipments",
  purchaseOrders: "PurchaseOrders",
  deliveries: "Deliveries",
  inventory: "Inventory",
  clients: "Clients",
  ports: "Ports",
}

// Initialize Google Sheets client
export async function getGoogleSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    })

    const client = await auth.getClient()
    const sheets = google.sheets({ version: "v4", auth: client })

    return sheets
  } catch (error) {
    console.error("Error initializing Google Sheets client:", error)
    throw new Error("Failed to initialize Google Sheets client")
  }
}

// Fetch data from a specific spreadsheet and sheet
export async function fetchSheetData(dataType: keyof typeof SPREADSHEET_IDS, range?: string) {
  try {
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = SPREADSHEET_IDS[dataType]

    if (!spreadsheetId) {
      throw new Error(`Spreadsheet ID for ${dataType} not configured`)
    }

    const sheetName = SHEET_NAMES[dataType as keyof typeof SHEET_NAMES] || dataType
    const fullRange = range ? `${sheetName}!${range}` : `${sheetName}!A1:Z`

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: fullRange,
    })

    const rows = response.data.values || []

    // If we have header row and data rows
    if (rows.length > 1) {
      const headers = rows[0]
      const dataRows = rows.slice(1)

      // Convert to array of objects with headers as keys
      return dataRows.map((row) => {
        const item: Record<string, any> = {}
        headers.forEach((header, index) => {
          item[header.toString()] = row[index] || null
        })
        return item
      })
    }

    return rows
  } catch (error) {
    console.error(`Error fetching ${dataType} data from Google Sheets:`, error)
    throw new Error(`Failed to fetch ${dataType} data from Google Sheets`)
  }
}

// Helper function to transform raw data into application-specific format
export function transformShipmentData(rawData: any[]) {
  return rawData.map((row) => ({
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
}

export function transformPurchaseOrderData(rawData: any[]) {
  return rawData.map((row) => ({
    id: row.POID || row.ID || "",
    client: row.Client || "",
    supplier: row.Supplier || "",
    orderDate: row.OrderDate || "",
    expectedDelivery: row.ExpectedDelivery || "",
    status: row.Status || "Created",
    items: row.Items || "",
    value: row.Value || "",
    currency: row.Currency || "USD",
  }))
}

export function transformDeliveryData(rawData: any[]) {
  return rawData.map((row) => ({
    id: row.DeliveryID || row.ID || "",
    shipmentId: row.ShipmentID || "",
    client: row.Client || "",
    date: row.Date || "",
    time: row.Time || "",
    location: row.Location || "",
    status: row.Status || "Pending",
    contactPerson: row.ContactPerson || "",
    contactPhone: row.ContactPhone || "",
  }))
}
