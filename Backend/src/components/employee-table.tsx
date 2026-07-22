import { useState, useMemo } from "react"
import { ArrowUpDown, MoreVertical, Edit, Trash2, ShieldCheck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Employee } from "@/types/employee"

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employeeId: string) => void
  onToggleStatus: (employeeId: string) => void
  onVerify?: (employee: Employee) => void
}

export function EmployeeTable({ employees, onEdit, onDelete, onToggleStatus, onVerify }: EmployeeTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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

  const sortedEmployees = useMemo(() => {
    if (!sortColumn) return employees

    return [...employees].sort((a, b) => {
      const aValue = a[sortColumn as keyof Employee]
      const bValue = b[sortColumn as keyof Employee]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [employees, sortColumn, sortDirection])

  const totalPages = Math.ceil(sortedEmployees.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentEmployees = sortedEmployees.slice(startIndex, endIndex)

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value))
    setCurrentPage(1)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Employee List ({employees.length})</h2>
        <p className="text-sm text-gray-600 mt-0.5">View and manage employee profiles and access</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946] hover:to-[#FF8C00]">
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("id")}>
                <div className="flex items-center gap-1">
                  Employee ID
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("fullName")}>
                <div className="flex items-center gap-1">
                  Full Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("mobile")}>
                <div className="flex items-center gap-1">
                  Mobile Number
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("email")}>
                <div className="flex items-center gap-1">
                  Email Address
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white cursor-pointer" onClick={() => handleSort("department")}>
                <div className="flex items-center gap-1">
                  Department
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-white cursor-pointer"
                onClick={() => handleSort("profileStatus")}
              >
                <div className="flex items-center gap-1">
                  Profile Status
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-white">App Status</TableHead>
              <TableHead className="font-semibold text-white text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-12">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              currentEmployees.map((employee) => (
                <TableRow key={employee.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900">{employee.id}</TableCell>
                  <TableCell className="text-gray-900">{employee.fullName}</TableCell>
                  <TableCell className="text-gray-600">{employee.mobile}</TableCell>
                  <TableCell className="text-gray-600">{employee.email}</TableCell>
                  <TableCell className="text-gray-900">{employee.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.profileStatus === "Verified" ? "default" : "secondary"}
                      className={
                        employee.profileStatus === "Verified"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      }
                    >
                      <span className="flex items-center gap-1.5">
                        {employee.profileStatus === "Verified" && (
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                        )}
                        {employee.profileStatus}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={employee.appStatus}
                        onCheckedChange={() => onToggleStatus(employee.id)}
                        className="data-[state=checked]:bg-[#E63946]"
                      />
                      <span className="text-sm text-gray-600">{employee.appStatus ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onVerify && employee.profileStatus === "Pending" && (
                            <DropdownMenuItem
                              onClick={() => onVerify(employee)}
                              className="cursor-pointer text-green-600 focus:text-green-600"
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Verify
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onEdit(employee)} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(employee.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20 h-9">
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

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="h-9"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
