import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Trash2, ArrowUpDown, MoreVertical, Edit } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Vendor } from "@/types/vendor"

interface VendorTableProps {
  vendors: Vendor[]
  setVendors: (vendors: Vendor[]) => void
  searchQuery: string
  profileStatusFilter: string[]
}

export function VendorTable({ vendors, setVendors, searchQuery, profileStatusFilter }: VendorTableProps) {
  const navigate = useNavigate()
  const [sortColumn, setSortColumn] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const storedVendors = localStorage.getItem("vendors")
    if (storedVendors) {
      const parsedVendors = JSON.parse(storedVendors)
      setVendors(parsedVendors)
    } else {
      localStorage.setItem("vendors", JSON.stringify(vendors))
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

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        searchQuery === "" ||
        vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.contactPersonEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.contactPersonMobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = profileStatusFilter.length === 0 || profileStatusFilter.includes(vendor.profileStatus)

      return matchesSearch && matchesStatus
    })
  }, [vendors, searchQuery, profileStatusFilter])

  const sortedVendors = useMemo(() => {
    if (!sortColumn) return filteredVendors

    return [...filteredVendors].sort((a, b) => {
      const aValue = a[sortColumn as keyof Vendor]
      const bValue = b[sortColumn as keyof Vendor]

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredVendors, sortColumn, sortDirection])

  const paginatedVendors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedVendors.slice(startIndex, startIndex + pageSize)
  }, [sortedVendors, currentPage, pageSize])

  const totalPages = Math.ceil(sortedVendors.length / pageSize)

  const handleToggleStatus = (id: string) => {
    setVendors(
      vendors.map((vendor) =>
        vendor.id === id ? { ...vendor, appStatus: vendor.appStatus === "Active" ? "Inactive" : "Active" } : vendor,
      ),
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((vendor) => vendor.id !== id))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d12433] hover:to-[#e67e00]">
              <TableHead className="text-white font-semibold cursor-pointer" onClick={() => handleSort("companyName")}>
                <div className="flex items-center gap-1">
                  Company Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="text-white font-semibold cursor-pointer"
                onClick={() => handleSort("contactPersonMobile")}
              >
                <div className="flex items-center gap-1">
                  Contact Info
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-white font-semibold cursor-pointer" onClick={() => handleSort("city")}>
                <div className="flex items-center gap-1">
                  Location
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="text-white font-semibold cursor-pointer"
                onClick={() => handleSort("typeOfCompany")}
              >
                <div className="flex items-center gap-1">
                  Type
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
            {paginatedVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.companyName}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="text-sm">{vendor.contactPersonMobile}</div>
                    <div className="text-sm text-gray-500">{vendor.contactPersonEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="text-sm">
                      {vendor.city}, {vendor.state}
                    </div>
                    <div className="text-sm text-gray-500">{vendor.pinCode}</div>
                  </div>
                </TableCell>
                <TableCell>{vendor.typeOfCompany}</TableCell>
                <TableCell>
                  <Badge
                    variant={vendor.profileStatus === "Verified" ? "default" : "secondary"}
                    className={
                      vendor.profileStatus === "Verified"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : vendor.profileStatus === "Rejected"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                  >
                    {vendor.profileStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={vendor.appStatus === "Active"}
                    onCheckedChange={() => handleToggleStatus(vendor.id)}
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
                          onClick={() => navigate(`/vendor-registration/${vendor.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(vendor.id)}
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
