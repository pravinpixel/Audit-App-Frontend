import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MasterTable } from "@/components/master-table"
import type { City } from "@/types/master"

export default function CitiesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [items, setItems] = useState<City[]>([])
  const [filteredItems, setFilteredItems] = useState<City[]>([])

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    const mockData: City[] = [
      { id: "1", name: "Mumbai", stateId: "1", stateName: "Maharashtra", status: "Active" },
      { id: "2", name: "Pune", stateId: "1", stateName: "Maharashtra", status: "Active" },
      { id: "3", name: "Bangalore", stateId: "2", stateName: "Karnataka", status: "Active" },
      { id: "4", name: "Delhi", stateId: "3", stateName: "Delhi NCR", status: "Active" },
    ]
    setItems(mockData)
    setFilteredItems(mockData)
  }, [navigate])

  useEffect(() => {
    let filtered = [...items]

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.stateName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredItems(filtered)
  }, [searchQuery, statusFilter, items])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this city?")) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cities</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard → Cities</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Total Records: <span className="text-[#E63946] font-semibold">{filteredItems.length}</span>
              </span>
            </div>

            <Select defaultValue="10">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="InActive">InActive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => navigate("/master/cities/add")}
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#D32F3F] hover:to-[#F57C00] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add City
            </Button>
          </div>

          <MasterTable
            items={filteredItems}
            columns={["S.NO", "CITY NAME", "STATE", "STATUS", "ACTIONS"]}
            renderRow={(item, index) => [index + 1, item.name, item.stateName, item.status]}
            onEdit={(item) => navigate(`/master/cities/edit/${item.id}`)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
