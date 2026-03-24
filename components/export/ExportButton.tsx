'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportToExcel, exportToPDF } from '@/lib/utils/exportHelpers'

interface ExportButtonProps {
  data: any[]
  filename: string
  title: string
  columns: string[]
  pdfDataMapper: (item: any) => string[]
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ExportButton({ 
  data, 
  filename, 
  title, 
  columns, 
  pdfDataMapper,
  variant = 'outline',
  size = 'sm'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportExcel = () => {
    setIsExporting(true)
    try {
      exportToExcel(data, filename)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = () => {
    setIsExporting(true)
    try {
      exportToPDF(title, data, filename, columns, pdfDataMapper)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className={cn(buttonVariants({ variant: variant, size: size }), "gap-2", {"opacity-50 pointer-events-none": isExporting || data.length === 0})}
        disabled={isExporting || data.length === 0}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline-block">Export Logs</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
          <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" />
          <span>Export to Excel (.xlsx)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          <span>Export to PDF (.pdf)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
