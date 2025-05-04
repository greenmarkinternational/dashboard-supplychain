"use client"

import { useState, useEffect } from "react"

interface UseSheetDataOptions {
  dataType: string
  refreshInterval?: number | null
}

export function useSheetData<T>({ dataType, refreshInterval = null }: UseSheetDataOptions) {
  const [data, setData] = useState<T[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  async function fetchData() {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/google-sheets?type=${dataType}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch ${dataType}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setData(result.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      console.error(`Error fetching ${dataType}:`, err)
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
  }, [dataType, refreshInterval])

  return { data, isLoading, error, refetch: fetchData }
}
