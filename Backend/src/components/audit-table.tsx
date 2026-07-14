import { useState, useMemo } from "react"
import { Eye, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AuditCompany } from "@/types/audit"

interface AuditTableProps {
  audits: AuditCompany[]
  onView: (auditId: string) => void
}

export function AuditTable({ audits, onView }: AuditTableProps) {
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedAudits = useMemo(() => {
    if (!sortColumn) return audits

    return [...audits].sort((a, b) => {
      const aValue = a[sortColumn as keyof AuditCompany]
      const bValue = b[sortColumn as keyof AuditCompany]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [audits, sortColumn, sortDirection])

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d12433] hover:to-[#e67e00]">
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("companyName")}>
                <div className="flex items-center gap-1">
                  Company Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("industryType")}>
                <div className="flex items-center gap-1">
                  Industry Type
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-white cursor-pointer"
                onClick={() => handleSort("branchLocation")}
              >
                <div className="flex items-center gap-1">
                  Branch Location
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-white cursor-pointer"
                onClick={() => handleSort("headOfficeLocation")}
              >
                <div className="flex items-center gap-1">
                  Head Office
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("state")}>
                <div className="flex items-center gap-1">
                  State
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("city")}>
                <div className="flex items-center gap-1">
                  City
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAudits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No audits found
                </TableCell>
              </TableRow>
            ) : (
              sortedAudits.map((audit) => (
                <TableRow key={audit.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{audit.companyName}</TableCell>
                  <TableCell>{audit.industryType}</TableCell>
                  <TableCell>{audit.branchLocation}</TableCell>
                  <TableCell>{audit.headOfficeLocation}</TableCell>
                  <TableCell>{audit.state}</TableCell>
                  <TableCell>{audit.city}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(audit.id)}
                      className="text-[#E63946] hover:text-[#E63946] hover:bg-[#E63946]/10"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
