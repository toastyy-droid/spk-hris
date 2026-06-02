function escapeCsv(val: unknown): string {
  if (typeof val === "number") {
    return String(val)
  }
  const s = val == null ? "" : String(val)
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export interface CsvColumn<T> {
  header: string
  value: (row: T) => unknown
}

export function generateCsv<T>(
  rows: T[],
  columns: CsvColumn<T>[],
): string {
  const parts: string[] = []
  parts.push(columns.map((c) => c.header).join(","))
  for (const row of rows) {
    parts.push(columns.map((c) => escapeCsv(c.value(row))).join(","))
  }
  return parts.join("\n")
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function csvFilename(prefix: string, ext = "csv"): string {
  return `${prefix}_${formatDate(new Date())}.${ext}`
}
