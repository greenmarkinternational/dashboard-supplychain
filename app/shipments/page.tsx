"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Download, Filter, Plus, Search, Ship } from "lucide-react"
import { useSheetData } from "@/hooks/use-sheet-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

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

  // Filter shipments based on search query
  const filteredShipments = shipments
    ? shipments.filter(
        (shipment) =>
          shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.status.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shipments</h1>
          <p className="text-muted-foreground">Manage and track all shipments</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>
      </div>

      <div className="my-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search shipments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Shipments</CardTitle>
          <CardDescription>{filteredShipments.length} shipments found</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full space-y-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
            </div>
          ) : error ? (
            <div className="flex justify-center p-6 text-red-500">
              <p>Error loading shipments: {error.message}</p>
            </div>
          ) : filteredShipments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Ship className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No shipments found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "Create your first shipment to get started"}
              </p>
              {!searchQuery && (
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  New Shipment
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                        ID
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                        Client
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Origin</TableHead>
                    <TableHead className="hidden md:table-cell">Destination</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="flex items-center gap-1 p-0 font-medium">
                        Status
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">ETA</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
