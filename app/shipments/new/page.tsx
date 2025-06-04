import type { Metadata } from "next"
import { NewShipmentForm } from "@/components/new-shipment-form"

export const metadata: Metadata = {
  title: "New Shipment | ShipTrack Pro",
  description: "Create a new shipment in the system",
}

export default function NewShipmentPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-2xl font-bold">New Shipment</h1>
      <NewShipmentForm />
    </div>
  )
}
