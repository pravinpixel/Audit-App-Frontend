import { useState } from "react"
import { Eye, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AuditEnquiry } from "@/types/audit-enquiry"

interface AuditEnquiryTableProps {
  enquiries: AuditEnquiry[]
  onView: (id: string) => void
}

export function AuditEnquiryTable({ enquiries, onView }: AuditEnquiryTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortColumn, setSortColumn] = useState<keyof AuditEnquiry | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: keyof AuditEnquiry) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedEnquiries = [...enquiries].sort((a, b) => {
    if (!sortColumn) return 0
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedEnquiries.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentEnquiries = sortedEnquiries.slice(startIndex, endIndex)

  const SortIcon = ({ column }: { column: keyof AuditEnquiry }) => {
    if (sortColumn !== column) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946] hover:to-[#FF8C00]">
                <TableHead
                  className="text-white cursor-pointer font-semibold"
                  onClick={() => handleSort("customerName")}
                >
                  Customer Name <SortIcon column="customerName" />
                </TableHead>
                <TableHead
                  className="text-white cursor-pointer font-semibold"
                  onClick={() => handleSort("industryType")}
                >
                  Industry Type <SortIcon column="industryType" />
                </TableHead>
                <TableHead
                  className="text-white cursor-pointer font-semibold"
                  onClick={() => handleSort("branchLocation")}
                >
                  Branch Location <SortIcon column="branchLocation" />
                </TableHead>
                <TableHead
                  className="text-white cursor-pointer font-semibold"
                  onClick={() => handleSort("headOfficeLocation")}
                >
                  Head Office Location <SortIcon column="headOfficeLocation" />
                </TableHead>
                <TableHead className="text-white cursor-pointer font-semibold" onClick={() => handleSort("state")}>
                  State <SortIcon column="state" />
                </TableHead>
                <TableHead className="text-white cursor-pointer font-semibold" onClick={() => handleSort("city")}>
                  City <SortIcon column="city" />
                </TableHead>
                <TableHead
                  className="text-white cursor-pointer font-semibold"
                  onClick={() => handleSort("salesPerson")}
                >
                  Sales Person <SortIcon column="salesPerson" />
                </TableHead>
                <TableHead className="text-white text-center font-semibold">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEnquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No enquiries found
                  </TableCell>
                </TableRow>
              ) : (
                currentEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{enquiry.customerName}</TableCell>
                    <TableCell>{enquiry.industryType}</TableCell>
                    <TableCell>{enquiry.branchLocation}</TableCell>
                    <TableCell>{enquiry.headOfficeLocation}</TableCell>
                    <TableCell>{enquiry.state}</TableCell>
                    <TableCell>{enquiry.city}</TableCell>
                    <TableCell>{enquiry.salesPerson || "-"}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(enquiry.id)}
                        className="h-8 w-8 text-[#E63946] hover:text-[#E63946] hover:bg-[#E63946]/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
