import { useState, useMemo } from "react"
import { Eye, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AuditCompany } from "@/types/audit"

const DEFAULT_ASSIGNEE_OPTIONS = [
  "Rahul Sharma",
  "Priya Menon",
  "Arjun Reddy",
  "Sneha Iyer",
  "Vikram Nair",
  "Anita Desai",
]

interface AuditTableProps {
  audits: AuditCompany[]
  onView: (auditId: string) => void
  showAssignmentStatus?: boolean
  onSelfAssign?: (auditId: string, assignedTo: string) => void
  assigneeOptions?: string[]
}

export function AuditTable({
  audits,
  onView,
  showAssignmentStatus = false,
  onSelfAssign,
  assigneeOptions = DEFAULT_ASSIGNEE_OPTIONS,
}: AuditTableProps) {
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selfAssignAuditId, setSelfAssignAuditId] = useState<string | null>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")

  const handleViewClick = (audit: AuditCompany) => {
    if (showAssignmentStatus && audit.assignmentStatus !== "Self Assigned") {
      setSelectedAssignee("")
      setSelfAssignAuditId(audit.id)
    } else {
      onView(audit.id)
    }
  }

  const handleConfirmSelfAssign = () => {
    if (selfAssignAuditId && selectedAssignee) {
      onSelfAssign?.(selfAssignAuditId, selectedAssignee)
      onView(selfAssignAuditId)
      setSelfAssignAuditId(null)
    }
  }

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
              {showAssignmentStatus && (
                <>
                  <TableHead className="font-semibold text-white">Assign Status</TableHead>
                  <TableHead className="font-semibold text-white">Assigned Person</TableHead>
                </>
              )}
              <TableHead className="font-semibold text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAudits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showAssignmentStatus ? 9 : 7} className="text-center py-8 text-gray-500">
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
                  {showAssignmentStatus && (
                    <>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                            audit.assignmentStatus === "Self Assigned"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {audit.assignmentStatus === "Self Assigned" ? "Self Assigned" : "Not Assigned"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {audit.assignmentStatus === "Self Assigned" && audit.assignedTo ? (
                          <span className="text-sm text-gray-700">{audit.assignedTo}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </TableCell>
                    </>
                  )}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewClick(audit)}
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

      <AlertDialog open={selfAssignAuditId !== null} onOpenChange={(open) => !open && setSelfAssignAuditId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Self Assign Company</AlertDialogTitle>
            <AlertDialogDescription>
              This company is not yet assigned. Choose who this should be mapped to in order to continue reviewing
              its survey data.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-1.5 py-2">
            <Label htmlFor="assignee">Assign To</Label>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Select a name" />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSelfAssign}
              disabled={!selectedAssignee}
              className="bg-[#E63946] hover:bg-[#c62e3a] disabled:opacity-50 disabled:pointer-events-none"
            >
              {selectedAssignee ? "Assign Company" : "Self Assign"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
