import type { Metadata } from "next"
import { CSVDataTable } from "@/components/csv-data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "CSV Data | ShipTrack Pro",
  description: "View and manage CSV data",
}

export default function CSVDataPage() {
  // Replace this with your actual CSV URL
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRI1eiibKLPGr6duFMZhC3Lv-5hNCfXigaigv-qoh4M9WXZqYCMh4XKSfIKKkLy9bBxVbd_0-ffD09y/pub?gid=2021817116&single=true&output=csv"

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">CSV Data</h1>

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
  )
}
