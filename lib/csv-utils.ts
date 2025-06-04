// Server-side CSV utility - only runs on the server
export async function fetchCSVData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()

    // Simple CSV parser that works in both environments
    const lines = csvText.split("\n").filter((line) => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(",").map((header) => header.trim().replace(/"/g, ""))
    const data = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((value) => value.trim().replace(/"/g, ""))
      const row: Record<string, string> = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })

      data.push(row)
    }

    return data
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    throw error
  }
}
