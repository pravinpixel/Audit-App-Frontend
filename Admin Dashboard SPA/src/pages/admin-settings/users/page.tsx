import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { UsersTable } from "@/components/users-table"
import type { User } from "@/types/user"

export default function UsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        userName: "Santhosh",
        mobileNumber: "+91 98765 43210",
        emailId: "santhosh@safetymatters.com",
        role: "Super Admin",
        status: "Active",
      },
      {
        id: "2",
        userName: "Priya Sharma",
        mobileNumber: "+91 87654 32109",
        emailId: "priya.sharma@safetymatters.com",
        role: "Admin",
        status: "Active",
      },
      {
        id: "3",
        userName: "Raj Kumar",
        mobileNumber: "+91 76543 21098",
        emailId: "raj.kumar@safetymatters.com",
        role: "Auditor",
        status: "Inactive",
      },
    ]
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }

  useEffect(() => {
    let filtered = [...users]

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleAddUser = () => {
    navigate("/admin-settings/users/add")
  }

  const handleEdit = (user: User) => {
    // TODO: Navigate to edit page with user ID
    console.log("[v0] Edit user:", user)
  }

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-600 mt-1">Dashboard → Users</p>
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
                Total Records: <span className="font-semibold text-gray-900">{users.length}</span>
              </span>
              <Button
                variant="outline"
                className="border-[#8B1538] text-[#8B1538] hover:bg-[#8B1538]/10 bg-transparent"
                onClick={() => {}}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                className="bg-gradient-to-r from-[#8B1538] to-[#A8153F] hover:from-[#7A1230] hover:to-[#8B1538] text-white"
                onClick={handleAddUser}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>

          <UsersTable users={filteredUsers} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>
    </DashboardLayout>
  )
}
