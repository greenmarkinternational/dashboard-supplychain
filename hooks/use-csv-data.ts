"use client"

import { useState, useEffect } from "react"

interface UseCSVDataOptions {
  url: string
  refreshInterval?: number | null
}

export function useCSVData<T>({ url, refreshInterval = null }: UseCSVDataOptions) {
  const [data, setData] = useState<T[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  async function fetchData() {
    try {
      setIsLoading(true)
      const encodedUrl = encodeURIComponent(url)
      const response = await fetch(`/api/csv-data?url=${encodedUrl}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch CSV data: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setData(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      console.error(`Error fetching CSV data:`, err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up polling if refreshInterval is provided
    if (refreshInterval) {
      const intervalId = setInterval(fetchData, refreshInterval)
      return () => clearInterval(intervalId)
    }
  }, [url, refreshInterval])

  return { data, isLoading, error, refetch: fetchData }
}
