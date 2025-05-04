"use client"

import { FileText, Download, Eye, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Document {
  id: string
  name: string
  type: string
  date: string
  status: "available" | "pending" | "missing"
}

interface ShipmentDocumentsProps {
  shipmentId: string
  purchaseOrder: string
  deliveryOrder: string | null
  webocGD: string | null
}

export function ShipmentDocuments({ shipmentId, purchaseOrder, deliveryOrder, webocGD }: ShipmentDocumentsProps) {
  // Create a list of documents based on the shipment data
  const documents: Document[] = [
    {
      id: "1",
      name: "Purchase Order",
      type: "PDF",
      date: new Date().toLocaleDateString(),
      status: purchaseOrder ? "available" : "missing",
    },
    {
      id: "2",
      name: "Bill of Lading",
      type: "PDF",
      date: new Date().toLocaleDateString(),
      status: "available",
    },
    {
      id: "3",
      name: "Commercial Invoice",
      type: "PDF",
      date: new Date().toLocaleDateString(),
      status: "available",
    },
    {
      id: "4",
      name: "Packing List",
      type: "PDF",
      date: new Date().toLocaleDateString(),
      status: "available",
    },
    {
      id: "5",
      name: "Delivery Order",
      type: "PDF",
      date: deliveryOrder ? new Date().toLocaleDateString() : "",
      status: deliveryOrder ? "available" : "pending",
    },
    {
      id: "6",
      name: "WeBOC GD",
      type: "PDF",
      date: webocGD ? new Date().toLocaleDateString() : "",
      status: webocGD ? "available" : "pending",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Shipment related documents</CardDescription>
        </div>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {doc.name}
                </TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      doc.status === "available"
                        ? "bg-green-100 text-green-700"
                        : doc.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {doc.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {doc.status === "available" ? (
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {doc.status === "pending" ? "Awaiting document" : "Not available"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
