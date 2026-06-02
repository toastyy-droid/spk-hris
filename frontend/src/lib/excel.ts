import Excel from "exceljs"

export interface ExcelColumn<T> {
  header: string
  value: (row: T) => unknown
  format?: string
  width?: number
}

const primaryArgb = "FF0D9488"
const headerFontArgb = "FFFFFFFF"
const borderStyle = { style: "thin" as const, color: { argb: "FFB0BEC5" } }

function fmtDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export async function generateExcel<T>(
  rows: T[],
  columns: ExcelColumn<T>[],
  sheetName: string,
): Promise<Blob> {
  const wb = new Excel.Workbook()
  wb.creator = "HRIS AMM"
  wb.created = new Date()

  const ws = wb.addWorksheet(sheetName)

  const headerRow = ws.addRow(columns.map((c) => c.header))
  headerRow.height = 24

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: headerFontArgb }, size: 11, name: "Calibri" }
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: primaryArgb } }
    cell.alignment = { vertical: "middle", horizontal: "center" }
    cell.border = {
      top: borderStyle, bottom: borderStyle,
      left: borderStyle, right: borderStyle,
    }
  })

  for (const row of rows) {
    const dataRow = ws.addRow(columns.map((c) => c.value(row)))
    dataRow.height = 20

    dataRow.eachCell((cell, colIdx) => {
      const col = columns[colIdx - 1]
      cell.border = {
        top: borderStyle, bottom: borderStyle,
        left: borderStyle, right: borderStyle,
      }
      cell.alignment = { vertical: "middle", horizontal: "left" }

      if (col?.format && typeof cell.value === "number") {
        cell.numFmt = col.format
      }
      if (typeof cell.value === "number") {
        cell.alignment = { vertical: "middle", horizontal: "right" }
      }
    })

    const rowNum = dataRow.number
    if (rowNum % 2 === 0) {
      dataRow.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F7FA" } }
      })
    }
  }

  ws.addRow([])
  const metaRow = ws.addRow([`Dicetak: ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`])
  metaRow.eachCell((cell) => {
    cell.font = { italic: true, color: { argb: "FF78909C" }, size: 9, name: "Calibri" }
  })

  columns.forEach((col, i) => {
    const idx = i + 1
    const w = col.width ?? Math.min(Math.max(col.header.length * 2 + 4, 14), 30)
    ws.getColumn(idx).width = w
  })

  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: rows.length, column: columns.length },
  }

  ws.views = [{ state: "frozen", ySplit: 1 }]

  const buffer = await wb.xlsx.writeBuffer()
  return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
}

export function downloadExcel(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function excelFilename(prefix: string): string {
  return `${prefix}_${fmtDate(new Date())}.xlsx`
}
