"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Package, Ship, Truck, User } from "lucide-react"
import { useShipment } from "@/hooks/use-shipment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShipmentDocuments } from "@/components/shipment-documents"
import { ShipmentTimeline } from "@/components/shipment-timeline"
import { UpdateShipmentStatus } from "@/components/update-shipment-status"
import { SendNotification } from "@/components/send-notification"

export default function ShipmentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { shipment, isLoading, error, updateStatus } = useShipment(id)

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-xl font-semibold text-red-800">Error Loading Shipment</h2>
          <p className="mt-2 text-red-600">{error?.message || "Shipment not found"}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/shipments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shipments
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/shipments">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{shipment.id}</h1>
            <p className="text-muted-foreground">
              {shipment.type} Shipment • {shipment.origin} to {shipment.destination}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/shipments/${id}/edit`}>Edit</Link>
          </Button>
          <Button>Send Notification</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2 py-1">
              <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{shipment.client}</p>
                <p className="text-sm text-muted-foreground">{shipment.clientEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shipment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Ship className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Vessel</p>
                  <p className="font-medium">{shipment.vessel || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Container</p>
                  <p className="font-medium">{shipment.container || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dates & Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">ETA</p>
                  <p className="font-medium">{shipment.eta || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                  <p className="font-medium">
                    {shipment.status === "In Transit"
                      ? "En route to destination"
                      : shipment.status === "Origin Port"
                        ? shipment.origin
                        : shipment.status === "Destination Port" || shipment.status === "Customs Clearance"
                          ? shipment.destination
                          : shipment.status === "Delivery"
                            ? "Delivered to client"
                            : "Processing"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="space-y-6 pt-6">
          <ShipmentTimeline history={shipment.history || []} currentStatus={shipment.status} />
          <div className="grid gap-6 md:grid-cols-2">
            <UpdateShipmentStatus currentStatus={shipment.status} onUpdate={updateStatus} />
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
                <CardDescription>Details about the final delivery</CardDescription>
              </CardHeader>
              <CardContent>
                {shipment.status === "Delivery" ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-green-500" />
                        <p className="font-medium text-green-700">Delivery Completed</p>
                      </div>
                      <p className="mt-1 text-sm text-green-600">
                        This shipment has been successfully delivered to the client.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Delivery Date</span>
                        <span className="font-medium">May 7, 2025</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Received By</span>
                        <span className="font-medium">John Smith</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Delivery Location</span>
                        <span className="font-medium">Client Warehouse</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-yellow-50 p-4">
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-yellow-500" />
                        <p className="font-medium text-yellow-700">Delivery Pending</p>
                      </div>
                      <p className="mt-1 text-sm text-yellow-600">
                        This shipment is not yet ready for delivery. Current status: {shipment.status}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Delivery</span>
                        <span className="font-medium">{shipment.eta || "To be determined"}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Delivery Order</span>
                        <span className="font-medium">{shipment.deliveryOrder || "Not issued"}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">WeBOC GD</span>
                        <span className="font-medium">{shipment.webocGD || "Not issued"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="documents" className="pt-6">
          <ShipmentDocuments
            shipmentId={shipment.id}
            purchaseOrder={shipment.purchaseOrder}
            deliveryOrder={shipment.deliveryOrder}
            webocGD={shipment.webocGD}
          />
        </TabsContent>
        <TabsContent value="notifications" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SendNotification />
            <Card>
              <CardHeader>
                <CardTitle>Notification History</CardTitle>
                <CardDescription>Previous notifications sent for this shipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">ETA Update</p>
                      <p className="text-sm text-muted-foreground">May 1, 2025</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Notification sent to {shipment.clientEmail} about updated ETA.
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Status Change</p>
                      <p className="text-sm text-muted-foreground">April 25, 2025</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Notification sent to {shipment.clientEmail} about status change to "In Transit".
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Purchase Order Confirmation</p>
                      <p className="text-sm text-muted-foreground">April 10, 2025</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Notification sent to {shipment.clientEmail} confirming purchase order.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
