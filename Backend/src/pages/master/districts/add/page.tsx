import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddDistrictPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [status, setStatus] = useState("Active")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate("/master/districts")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add District</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard → Districts</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              District
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="name">
                District Name: <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="District Name"
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
                <SelectTrigger>
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
              Submit
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
