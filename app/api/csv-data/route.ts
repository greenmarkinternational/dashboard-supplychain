import { NextResponse } from "next/server"
import { fetchCSVData } from "@/lib/csv-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "CSV URL is required" }, { status: 400 })
    }

    // For security, you might want to validate the URL or restrict to certain domains
    const csvData = await fetchCSVData(url)

    return NextResponse.json({
      success: true,
      data: csvData,
    })
  } catch (error) {
    console.error("Error fetching CSV data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch CSV data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
