import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatCurrency, formatDate } from './formatters'

export const exportToExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export const exportToPDF = (title: string, data: any[], filename: string, columns: string[], dataMapper: (item: any) => string[]) => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text(title, 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 30)
  
  const tableData = data.map(dataMapper)

  ;(doc as any).autoTable({
    startY: 35,
    head: [columns],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] }, // Blue-500
    styles: { cellPadding: 3, fontSize: 10 },
  })

  doc.save(`${filename}.pdf`)
}
