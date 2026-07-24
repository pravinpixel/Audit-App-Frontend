import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Users, Clock, CheckCircle2, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmployeeFilters } from "@/components/employee-filters"
import { EmployeeTable } from "@/components/employee-table"
import { EditEmployeeModal } from "@/components/edit-employee-modal"
import { SummaryCards } from "@/components/summary-cards"
import type { Employee } from "@/types/employee"
import { dummyEmployees } from "@/lib/employees-data"

export default function DashboardPage() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [profileStatusFilter, setProfileStatusFilter] = useState<string[]>([])
  const [appStatusFilter, setAppStatusFilter] = useState<string[]>([])
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([])
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchEmployees()
  }, [navigate])

  const fetchEmployees = () => {
    const storedEmployees = localStorage.getItem("employees")
    if (storedEmployees) {
      const parsed = JSON.parse(storedEmployees)
      setEmployees(parsed)
      setFilteredEmployees(parsed)
    } else {
      localStorage.setItem("employees", JSON.stringify(dummyEmployees))
      setEmployees(dummyEmployees)
      setFilteredEmployees(dummyEmployees)
    }
  }

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem("employees", JSON.stringify(employees))
    }
  }, [employees])

  useEffect(() => {
    let filtered = [...employees]

    if (searchQuery) {
      filtered = filtered.filter(
        (emp) =>
          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.mobile.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.profileStatus.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (profileStatusFilter.length > 0) {
      filtered = filtered.filter((emp) => profileStatusFilter.includes(emp.profileStatus))
    }

    if (appStatusFilter.length > 0) {
      filtered = filtered.filter((emp) => {
        const status = emp.appStatus ? "Active" : "Inactive"
        return appStatusFilter.includes(status)
      })
    }

    if (departmentFilter.length > 0) {
      filtered = filtered.filter((emp) => departmentFilter.includes(emp.department))
    }

    setFilteredEmployees(filtered)
  }, [searchQuery, profileStatusFilter, appStatusFilter, departmentFilter, employees])

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsModalOpen(true)
  }

  const handleDelete = (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== employeeId))
    }
  }

  const handleToggleStatus = (employeeId: string) => {
    setEmployees(employees.map((emp) => (emp.id === employeeId ? { ...emp, appStatus: !emp.appStatus } : emp)))
  }

  const handleSaveEmployee = (updatedEmployee: Employee) => {
    const isVerified = updatedEmployee.profileStatus === "Verified"
    setEmployees(
      employees.map((emp) =>
        emp.id === updatedEmployee.id
          ? { ...updatedEmployee, appStatus: isVerified ? true : updatedEmployee.appStatus }
          : emp,
      ),
    )
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const verifyEmployee = (employee: Employee) => {
    setEmployees(employees.map((emp) => (emp.id === employee.id ? { ...emp, profileStatus: "Verified", appStatus: true } : emp)))
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const summaryCards = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Profile Verification Pending",
      value: employees.filter((emp) => emp.profileStatus === "Pending").length,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      title: "Employee Profiles Approved",
      value: employees.filter((emp) => emp.profileStatus === "Verified").length,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Active Employees",
      value: employees.filter((emp) => emp.appStatus === true).length,
      icon: UserCheck,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage employee profiles and access permissions</p>
          </div>
          <Button
            onClick={() => navigate("/employee/add")}
            className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#D32F3F] hover:to-[#F57C00] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>

        <SummaryCards cards={summaryCards} />

        <EmployeeFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          profileStatusFilter={profileStatusFilter}
          onProfileStatusChange={setProfileStatusFilter}
          appStatusFilter={appStatusFilter}
          onAppStatusChange={setAppStatusFilter}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
        />

        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onVerify={verifyEmployee}
        />

        <EditEmployeeModal
          employee={editingEmployee}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingEmployee(null)
          }}
          onSave={handleSaveEmployee}
        />
      </div>
    </DashboardLayout>
  )
}
