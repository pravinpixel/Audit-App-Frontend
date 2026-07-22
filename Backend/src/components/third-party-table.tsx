import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowUpDown, MoreVertical, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ThirdPartyAuditor } from "@/types/third-party"

interface ThirdPartyTableProps {
  auditors: ThirdPartyAuditor[]
  setAuditors: (auditors: ThirdPartyAuditor[]) => void
  searchQuery: string
  profileStatusFilter: string[]
}

export function ThirdPartyTable({ auditors, setAuditors, searchQuery, profileStatusFilter }: ThirdPartyTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const storedAuditors = localStorage.getItem("thirdPartyAuditors")
    if (storedAuditors) {
      const parsedAuditors = JSON.parse(storedAuditors)
      setAuditors(parsedAuditors)
    } else {
      localStorage.setItem("thirdPartyAuditors", JSON.stringify(auditors))
    }
  }, [])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const filteredAuditors = useMemo(() => {
    return auditors.filter((auditor) => {
      const matchesSearch =
        searchQuery === "" ||
        auditor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auditor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auditor.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auditor.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = profileStatusFilter.length === 0 || profileStatusFilter.includes(auditor.profileStatus)

      return matchesSearch && matchesStatus
    })
  }, [auditors, searchQuery, profileStatusFilter])

  const sortedAuditors = useMemo(() => {
    if (!sortColumn) return filteredAuditors

    return [...filteredAuditors].sort((a, b) => {
      const aValue = a[sortColumn as keyof ThirdPartyAuditor]
      const bValue = b[sortColumn as keyof ThirdPartyAuditor]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredAuditors, sortColumn, sortDirection])

  const paginatedAuditors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedAuditors.slice(startIndex, startIndex + pageSize)
  }, [sortedAuditors, currentPage, pageSize])

  const totalPages = Math.ceil(sortedAuditors.length / pageSize)

  const handleToggleStatus = (id: string) => {
    setAuditors(
      auditors.map((auditor) =>
        auditor.id === id ? { ...auditor, appStatus: auditor.appStatus === "Active" ? "Inactive" : "Active" } : auditor,
      ),
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this auditor?")) {
      setAuditors(auditors.filter((auditor) => auditor.id !== id))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d12433] hover:to-[#e67e00]">
              <TableHead className="text-white font-semibold cursor-pointer" onClick={() => handleSort("fullName")}>
                <div className="flex items-center gap-1">
                  Full Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white font-semibold cursor-pointer" onClick={() => handleSort("mobile")}>
                <div className="flex items-center gap-1">
                  Contact Info
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white font-semibold cursor-pointer" onClick={() => handleSort("city")}>
                <div className="flex items-center gap-1">
                  City
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white font-semibold cursor-pointer" onClick={() => handleSort("pincode")}>
                <div className="flex items-center gap-1">
                  Pincode
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="text-white font-semibold cursor-pointer"
                onClick={() => handleSort("profileStatus")}
              >
                <div className="flex items-center gap-1">
                  Profile Status
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white font-semibold">App Status</TableHead>
              <TableHead className="text-white font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAuditors.map((auditor) => (
              <TableRow key={auditor.id}>
                <TableCell className="font-medium">{auditor.fullName}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="text-sm">{auditor.mobile}</div>
                    <div className="text-sm text-gray-500">{auditor.email}</div>
                  </div>
                </TableCell>
                <TableCell>{auditor.city}</TableCell>
                <TableCell>{auditor.pincode}</TableCell>
                <TableCell>
                  <Badge
                    variant={auditor.profileStatus === "Verified" ? "default" : "secondary"}
                    className={
                      auditor.profileStatus === "Verified"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : auditor.profileStatus === "Rejected"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {auditor.profileStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={auditor.appStatus === "Active"}
                    onCheckedChange={() => handleToggleStatus(auditor.id)}
                    className="data-[state=checked]:bg-[#E63946]"
                  />
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
                        <DropdownMenuItem
                          onClick={() => navigate(`${location.pathname}/${auditor.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(auditor.id)}
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
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
