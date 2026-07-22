import { useState, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MoreVertical, ChevronUp, ChevronDown, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Customer } from "@/types/customer"

interface ContactDataTableProps {
  customers: Customer[]
  searchQuery: string
  industryTypeFilter: string[]
  branchLocationFilter: string[]
  headOfficeLocationFilter: string[]
  stateFilter: string[]
  cityFilter: string[]
}

type SortField = "customerName" | "industryType" | "branchLocation" | "headOfficeLocation" | "state" | "city"
type SortOrder = "asc" | "desc" | null

export function ContactDataTable({
  customers,
  searchQuery,
  industryTypeFilter,
  branchLocationFilter,
  headOfficeLocationFilter,
  stateFilter,
  cityFilter,
}: ContactDataTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc")
      if (sortOrder === "desc") {
        setSortField(null)
      }
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const matchesSearch =
        searchQuery === "" ||
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.industryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.branchLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesIndustryType = industryTypeFilter.length === 0 || industryTypeFilter.includes(customer.industryType)
      const matchesBranchLocation =
        branchLocationFilter.length === 0 || branchLocationFilter.includes(customer.branchLocation)
      const matchesHeadOfficeLocation =
        headOfficeLocationFilter.length === 0 || headOfficeLocationFilter.includes(customer.headOfficeLocation)
      const matchesState = stateFilter.length === 0 || stateFilter.includes(customer.state)
      const matchesCity = cityFilter.length === 0 || cityFilter.includes(customer.city)

      return (
        matchesSearch &&
        matchesIndustryType &&
        matchesBranchLocation &&
        matchesHeadOfficeLocation &&
        matchesState &&
        matchesCity
      )
    })

    if (sortField && sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]
        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    }

    return filtered
  }, [
    customers,
    searchQuery,
    industryTypeFilter,
    branchLocationFilter,
    headOfficeLocationFilter,
    stateFilter,
    cityFilter,
    sortField,
    sortOrder,
  ])

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1 inline" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1 inline" />
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Contact List ({filteredCustomers.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] text-white">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-90"
                onClick={() => handleSort("customerName")}
              >
                Company Name <SortIcon field="customerName" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-90"
                onClick={() => handleSort("industryType")}
              >
                Industry Type <SortIcon field="industryType" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-90"
                onClick={() => handleSort("branchLocation")}
              >
                Branch Location <SortIcon field="branchLocation" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-90"
                onClick={() => handleSort("headOfficeLocation")}
              >
                Head Office Location <SortIcon field="headOfficeLocation" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-90"
                onClick={() => handleSort("state")}
              >
                State <SortIcon field="state" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:opacity-90"
                onClick={() => handleSort("city")}
              >
                City <SortIcon field="city" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.customerName}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.industryType}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.branchLocation}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.headOfficeLocation}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.state}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{customer.city}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === "Verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`${location.pathname}/${customer.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
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
  )
}
