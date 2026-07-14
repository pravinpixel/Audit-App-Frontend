import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RolesTable } from "@/components/roles-table"
import type { Role } from "@/types/user"

export default function RolesPage() {
  const navigate = useNavigate()
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchRoles()
  }, [navigate])

  const fetchRoles = async () => {
    const mockRoles: Role[] = [
      {
        id: "1",
        roleName: "Role Test",
        status: "Active",
        permissions: {
          task: { all: false, view: true, create: false, edit: false, delete: false },
          employee: { all: true, view: true, create: true, edit: true, delete: true },
          organization: { all: false, view: true, create: true, edit: false, delete: false },
          masters: { all: false, view: true, create: true, edit: true, delete: false },
          users: { all: false, view: true, create: true, edit: true, delete: true },
          roles: { all: false, view: true, create: true, edit: true, delete: true },
          setting: { all: false, view: true, create: false, edit: false, delete: false },
          bulkUpload: { all: false, view: true, create: false, edit: false, delete: false },
        },
      },
      {
        id: "2",
        roleName: "MR-Management Representative",
        status: "Active",
        permissions: {
          task: { all: false, view: true, create: false, edit: false, delete: false },
          employee: { all: false, view: true, create: false, edit: false, delete: false },
          organization: { all: false, view: true, create: false, edit: false, delete: false },
          masters: { all: false, view: true, create: false, edit: false, delete: false },
          users: { all: false, view: true, create: false, edit: false, delete: false },
          roles: { all: false, view: true, create: false, edit: false, delete: false },
          setting: { all: false, view: true, create: false, edit: false, delete: false },
          bulkUpload: { all: false, view: true, create: false, edit: false, delete: false },
        },
      },
      {
        id: "3",
        roleName: "All Branch Data",
        status: "Active",
        permissions: {
          task: { all: true, view: true, create: true, edit: true, delete: true },
          employee: { all: true, view: true, create: true, edit: true, delete: true },
          organization: { all: true, view: true, create: true, edit: true, delete: true },
          masters: { all: true, view: true, create: true, edit: true, delete: true },
          users: { all: true, view: true, create: true, edit: true, delete: true },
          roles: { all: true, view: true, create: true, edit: true, delete: true },
          setting: { all: false, view: true, create: false, edit: false, delete: false },
          bulkUpload: { all: false, view: true, create: false, edit: false, delete: false },
        },
      },
      {
        id: "4",
        roleName: "Attachment User",
        status: "Active",
        permissions: {
          task: { all: false, view: true, create: false, edit: false, delete: false },
          employee: { all: false, view: true, create: false, edit: false, delete: false },
          organization: { all: false, view: true, create: false, edit: false, delete: false },
          masters: { all: false, view: true, create: false, edit: false, delete: false },
          users: { all: false, view: true, create: false, edit: false, delete: false },
          roles: { all: false, view: true, create: false, edit: false, delete: false },
          setting: { all: false, view: true, create: false, edit: false, delete: false },
          bulkUpload: { all: false, view: true, create: false, edit: false, delete: false },
        },
      },
    ]
    setRoles(mockRoles)
    setFilteredRoles(mockRoles)
  }

  useEffect(() => {
    let filtered = [...roles]

    if (searchQuery) {
      filtered = filtered.filter((role) => role.roleName.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((role) => role.status === statusFilter)
    }

    setFilteredRoles(filtered)
  }, [searchQuery, statusFilter, roles])

  const handleAddRole = () => {
    navigate("/admin-settings/roles/add")
  }

  const handleEdit = (role: Role) => {
    // TODO: Navigate to edit page with role ID
    console.log("[v0] Edit role:", role)
  }

  const handleDelete = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((role) => role.id !== roleId))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roles</h1>
            <p className="text-sm text-gray-600 mt-1">Dashboard → Roles</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Total Records: <span className="font-semibold text-gray-900">{roles.length}</span>
              </span>
              <Select value="10" onValueChange={() => {}}>
                <SelectTrigger className="w-16">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-gradient-to-r from-[#8B1538] to-[#A8153F] hover:from-[#7A1230] hover:to-[#8B1538] text-white"
                onClick={handleAddRole}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </div>
          </div>

          <RolesTable roles={filteredRoles} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </DashboardLayout>
  )
}
