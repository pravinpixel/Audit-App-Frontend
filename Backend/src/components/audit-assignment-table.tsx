import { useNavigate, useLocation } from "react-router-dom"
import { Building2, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AuditAssignment } from "@/types/audit-assignment"

interface AuditAssignmentTableProps {
  assignments: AuditAssignment[]
  onUpdate: () => void
}

export function AuditAssignmentTable({ assignments }: AuditAssignmentTableProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d12433] hover:to-[#e67e00]">
              <TableHead className="font-semibold text-white">Company ID</TableHead>
              <TableHead className="font-semibold text-white">Company Details</TableHead>
              <TableHead className="font-semibold text-white">Contact Information</TableHead>
              <TableHead className="font-semibold text-white">Building Information</TableHead>
              <TableHead className="font-semibold text-white">Assignment Status</TableHead>
              <TableHead className="font-semibold text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No audit assignments found
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="font-semibold text-gray-900">{assignment.requestId}</div>
                    <div className="text-xs text-gray-500">{assignment.requestDate}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900">{assignment.companyName}</div>
                        <div className="text-sm text-gray-600">{assignment.companyLocation}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm">
                        <User className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-900">{assignment.contactName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-600">{assignment.contactPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-gray-600">{assignment.contactEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="text-gray-900 font-medium">{assignment.buildingType}</div>
                      <div className="text-gray-600">{assignment.floors} floors</div>
                      <div className="text-gray-600">~{assignment.extinguisherCount} fire extinguishers</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge
                        className={
                          assignment.assignmentStatus === "Assigned"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                        }
                      >
                        {assignment.assignmentStatus}
                      </Badge>
                      {assignment.salesPerson && (
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Assigned to:</span>
                          <div className="mt-0.5">{assignment.salesPerson}</div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`${location.pathname}/${assignment.id}`)}
                      className="text-[#E63946] border-[#E63946] hover:bg-[#E63946]/10"
                    >
                      {assignment.assignmentStatus === "Assigned" ? "Reassign" : "Assign"}
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
