import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MasterTable } from "@/components/master-table"
import type { SafetyEquipment } from "@/types/master"

export default function SafetyEquipmentsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [items, setItems] = useState<SafetyEquipment[]>([])
  const [filteredItems, setFilteredItems] = useState<SafetyEquipment[]>([])

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    const mockData: SafetyEquipment[] = [
      { id: "1", name: "Fire Extinguisher", status: "Active" },
      { id: "2", name: "Smoke Detector", status: "Active" },
      { id: "3", name: "Fire Alarm", status: "Active" },
      { id: "4", name: "Emergency Light", status: "InActive" },
      { id: "5", name: "Fire Blanket", status: "Active" },
    ]
    setItems(mockData)
    setFilteredItems(mockData)
  }, [navigate])

  useEffect(() => {
    let filtered = [...items]

    if (searchQuery) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    setFilteredItems(filtered)
  }, [searchQuery, statusFilter, items])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Safety Equipments</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard → Safety Equipments</p>
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
              onClick={() => navigate("/master/safety-equipments/add")}
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#D32F3F] hover:to-[#F57C00] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Safety Equipment
            </Button>
          </div>

          <MasterTable
            items={filteredItems}
            columns={["S.NO", "EQUIPMENT NAME", "STATUS", "ACTIONS"]}
            renderRow={(item, index) => [index + 1, item.name, item.status]}
            onEdit={(item) => navigate(`/master/safety-equipments/edit/${item.id}`)}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
