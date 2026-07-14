import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EditSafetyEquipmentPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [name, setName] = useState("")
  const [status, setStatus] = useState("Active")

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    // Mock data - fetch the item by ID
    const mockItems = [
      { id: "1", name: "Fire Extinguisher", status: "Active" },
      { id: "2", name: "Smoke Detector", status: "Active" },
      { id: "3", name: "Fire Alarm", status: "Active" },
      { id: "4", name: "Emergency Light", status: "InActive" },
      { id: "5", name: "Fire Blanket", status: "Active" },
    ]

    const item = mockItems.find((i) => i.id === params.id)
    if (item) {
      setName(item.name)
      setStatus(item.status)
    }
  }, [navigate, params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert("Safety Equipment updated successfully!")
    navigate("/master/safety-equipments")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Safety Equipment</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard → Safety Equipments</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-semibold">Safety Equipment</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Equipment Name: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter Equipment Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status: <span className="text-red-500">*</span>
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="InActive">InActive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#D32F3F] hover:to-[#F57C00] text-white px-8"
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
