"use client"

import Link from "next/link"
import { useSheetData } from "@/hooks/use-sheet-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Shipment {
  id: string
  client: string
  origin: string
  destination: string
  status: string
  eta: string
  type: string
}

export function ShipmentTable() {
  const {
    data: shipments,
    isLoading,
    error,
  } = useSheetData<Shipment>({
    dataType: "shipments",
    refreshInterval: 60000, // Refresh every minute
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Purchase Order":
        return "bg-lime-500"
      case "Origin Port":
        return "bg-purple-500"
      case "In Transit":
        return "bg-cyan-500"
      case "Destination Port":
        return "bg-orange-500"
      case "Customs Clearance":
        return "bg-yellow-500"
      case "Delivery":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center p-6 text-red-500">
        <p>Error loading shipments: {error.message}</p>
      </div>
    )
  }

  if (!shipments || shipments.length === 0) {
    return (
      <div className="flex justify-center p-6 text-muted-foreground">
        <p>No shipments found</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shipment ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead className="hidden md:table-cell">Origin</TableHead>
          <TableHead className="hidden md:table-cell">Destination</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">ETA</TableHead>
          <TableHead className="hidden md:table-cell">Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.slice(0, 10).map((shipment) => (
          <TableRow key={shipment.id}>
            <TableCell className="font-medium">{shipment.id}</TableCell>
            <TableCell>{shipment.client}</TableCell>
            <TableCell className="hidden md:table-cell">{shipment.origin}</TableCell>
            <TableCell className="hidden md:table-cell">{shipment.destination}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(shipment.status)}>{shipment.status}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{shipment.eta}</TableCell>
            <TableCell className="hidden md:table-cell">{shipment.type}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/shipments/${shipment.id}`}>View</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
