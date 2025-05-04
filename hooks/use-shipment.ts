"use client"

import { useState, useEffect } from "react"
import type { Shipment } from "@/lib/shipments"
import { useToast } from "@/components/ui/use-toast"

export function useShipment(id: string) {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  async function fetchShipment() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/shipments/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch shipment: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setShipment(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      console.error(`Error fetching shipment:`, err)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateStatus(status: string, notes: string) {
    try {
      const response = await fetch(`/api/shipments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update shipment: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      toast({
        title: "Status updated",
        description: data.message,
      })

      // Refresh the shipment data
      fetchShipment()

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })

      console.error(`Error updating shipment status:`, err)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchShipment()
  }, [id])

  return {
    shipment,
    isLoading,
    error,
    refetch: fetchShipment,
    updateStatus,
  }
}
