import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Employee } from "@/types/employee"
import { dummyEmployees } from "@/lib/employees-data"

const DEPARTMENTS = ["Fire Safety", "Operations", "Technical Services", "Audit & Compliance", "Administration"]

export default function AddEmployeePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const storedEmployees = localStorage.getItem("employees")
    const employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : dummyEmployees

    const nextDbId = employees.reduce((max, emp) => Math.max(max, emp.dbId), 0) + 1
    const newEmployee: Employee = {
      dbId: nextDbId,
      id: `EMP${String(nextDbId).padStart(3, "0")}`,
      fullName,
      mobile,
      email,
      department,
      registrationType: "employee",
      profileStatus: "Pending",
      appStatus: false,
    }

    localStorage.setItem("employees", JSON.stringify([...employees, newEmployee]))

    toast({
      title: "Employee Added",
      description: `${newEmployee.fullName} has been added successfully.`,
    })

    navigate("/employee")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
          <p className="text-sm text-gray-600 mt-1">Employee Management → Add Employee</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate("/employee")} className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Employee
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">
                Mobile Number: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobile"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                Department: <span className="text-red-500">*</span>
              </Label>
              <Select value={department} onValueChange={setDepartment} required>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#D32F3F] hover:to-[#F57C00] text-white px-8"
            >
              Save Employee
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
