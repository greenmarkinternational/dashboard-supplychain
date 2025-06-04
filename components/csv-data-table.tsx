"use client"

import { useState } from "react"
import { useCSVData } from "@/hooks/use-csv-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, RefreshCw } from "lucide-react"

interface CSVDataTableProps {
  url: string
  title: string
  description?: string
}

export function CSVDataTable({ url, title, description }: CSVDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, error, refetch } = useCSVData<Record<string, string>>({
    url,
    refreshInterval: 300000, // Refresh every 5 minutes
  })

  // Filter data based on search query
  const filteredData = data
    ? data.filter((row) => {
        const searchLower = searchQuery.toLowerCase()
        return Object.values(row).some((value) => value && value.toString().toLowerCase().includes(searchLower))
      })
    : []

  // Get column headers from the first row
  const columns = data && data.length > 0 ? Object.keys(data[0]) : []

  if (isLoading) {
    return (
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-20" />
        </div>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-red-800">Error Loading Data</h2>
        <p className="mt-2 text-red-600">{error.message}</p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">No data found</p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search data..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="font-medium">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                  {searchQuery ? "No results found for your search" : "No data available"}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column}`}>{row[column] || "-"}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} entries
        {searchQuery && ` (filtered by "${searchQuery}")`}
      </div>
    </div>
  )
}
