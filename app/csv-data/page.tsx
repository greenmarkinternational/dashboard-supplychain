import type { Metadata } from "next"
import { CSVDataTable } from "@/components/csv-data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "CSV Data | ShipTrack Pro",
  description: "View and manage CSV data",
}

export default function CSVDataPage() {
  // Example CSV URL - replace with your actual CSV URL
  // Make sure your Google Sheets is published to the web as CSV
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI1eiibKLPGr6duFMZhC3Lv-5hNCfXigaigv-qoh4M9WXZqYCMh4XKSfIKKkLy9bBxVbd_0-ffD09y/pub?gid=2021817116&single=true&output=csv"

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">CSV Data</h1>

      <div className="space-y-6">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>CSV Data Source</AlertTitle>
          <AlertDescription>
            To use your own CSV data, make sure your Google Sheets is published to the web:
            <br />
            1. Open your Google Sheet
            <br />
            2. Go to File → Share → Publish to the web
            <br />
            3. Select "Comma-separated values (.csv)" format
            <br />
            4. Click "Publish" and copy the URL
            <br />
            5. Replace the csvUrl in this page with your URL
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>External CSV Data</CardTitle>
            <CardDescription>Data imported from Google Sheets CSV</CardDescription>
          </CardHeader>
          <CardContent>
            <CSVDataTable url={csvUrl} title="Shipment Data" description="External shipment data from CSV" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
