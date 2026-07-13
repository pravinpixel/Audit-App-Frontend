import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmployeeTable } from "@/components/employee-table"
import { EditEmployeeModal } from "@/components/edit-employee-modal"
import { SummaryCards } from "@/components/summary-cards"
import type { Employee } from "@/types/employee"

const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    fullName: "John Smith",
    mobile: "+91 98765 43210",
    email: "john.smith@safetymatters.com",
    department: "Fire Safety",
    profileStatus: "Verified",
    appStatus: true,
  },
  {
    id: "EMP002",
    fullName: "Sarah Johnson",
    mobile: "+91 87654 32109",
    email: "sarah.johnson@safetymatters.com",
    department: "Emergency Response",
    profileStatus: "Pending",
    appStatus: true,
  },
  {
    id: "EMP003",
    fullName: "Michael Chen",
    mobile: "+91 76543 21098",
    email: "michael.chen@safetymatters.com",
    department: "Fire Safety",
    profileStatus: "Verified",
    appStatus: true,
  },
  {
    id: "EMP004",
    fullName: "Emily Davis",
    mobile: "+91 65432 10987",
    email: "emily.davis@safetymatters.com",
    department: "Training & Development",
    profileStatus: "Verified",
    appStatus: false,
  },
  {
    id: "EMP005",
    fullName: "David Martinez",
    mobile: "+91 54321 09876",
    email: "david.martinez@safetymatters.com",
    department: "Compliance",
    profileStatus: "Pending",
    appStatus: true,
  },
  {
    id: "EMP008",
    fullName: "Maria Garcia",
    mobile: "+91 21098 76543",
    email: "maria.garcia@safetymatters.com",
    department: "Training & Development",
    profileStatus: "Pending",
    appStatus: false,
  },
]

export default function DataReviewEmployeesPage() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }
    setEmployees(mockEmployees.filter((emp) => emp.profileStatus === "Pending"))
  }, [navigate])

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
    // Remove from pending list if verified
    if (updatedEmployee.profileStatus === "Verified") {
      setEmployees(employees.filter((emp) => emp.id !== updatedEmployee.id))
    } else {
      setEmployees(employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp)))
    }
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const handleVerifyProfile = () => {
    if (editingEmployee) {
      handleSaveEmployee({ ...editingEmployee, profileStatus: "Verified" as const })
    }
  }

  const summaryCards = [
    {
      title: "Pending Employee Reviews",
      value: employees.length,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Review - Employee</h1>
          <p className="text-sm text-gray-600 mt-1">Review employee profiles pending verification</p>
        </div>

        <SummaryCards cards={summaryCards} />

        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />

        <EditEmployeeModal
          employee={editingEmployee}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingEmployee(null)
          }}
          onSave={handleSaveEmployee}
          onVerifyProfile={handleVerifyProfile}
        />
      </div>
    </DashboardLayout>
  )
}
