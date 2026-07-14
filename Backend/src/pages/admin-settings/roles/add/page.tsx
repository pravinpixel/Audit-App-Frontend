import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { PermissionSet } from "@/types/user"

export default function AddRolePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    roleName: "",
    status: "Active",
    permissions: {
      dashboard: { all: false, view: false, create: false, edit: false, delete: false },
      employeeManagement: { all: false, view: false, create: false, edit: false, delete: false },
      thirdPartyRegistration: { all: false, view: false, create: false, edit: false, delete: false },
      customerManagement: { all: false, view: false, create: false, edit: false, delete: false },
      auditSummary: { all: false, view: false, create: false, edit: false, delete: false },
      auditAssignments: { all: false, view: false, create: false, edit: false, delete: false },
      auditsData: { all: false, view: false, create: false, edit: false, delete: false },
      auditEnquiry: { all: false, view: false, create: false, edit: false, delete: false },
      users: { all: false, view: false, create: false, edit: false, delete: false },
      roles: { all: false, view: false, create: false, edit: false, delete: false },
    },
  })

  const handlePermissionChange = (module: string, permission: string, checked: boolean) => {
    const updatedPermissions = { ...formData.permissions }
    const modulePerms = updatedPermissions[module as keyof typeof updatedPermissions] as PermissionSet

    if (permission === "all") {
      modulePerms.all = checked
      modulePerms.view = checked
      modulePerms.create = checked
      modulePerms.edit = checked
      modulePerms.delete = checked
    } else {
      modulePerms[permission as keyof PermissionSet] = checked
      if (!checked) {
        modulePerms.all = false
      } else if (modulePerms.view && modulePerms.create && modulePerms.edit && modulePerms.delete) {
        modulePerms.all = true
      }
    }

    setFormData({ ...formData, permissions: updatedPermissions })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save role logic here
    console.log("[v0] Saving role:", formData)
    navigate("/admin-settings/roles")
  }

  const permissionModules = [
    { key: "dashboard", label: "Dashboard:" },
    { key: "employeeManagement", label: "Employee Management:" },
    { key: "thirdPartyRegistration", label: "Third Party Registration:" },
    { key: "customerManagement", label: "Customer Management:" },
    { key: "auditSummary", label: "Audit Summary:" },
    { key: "auditAssignments", label: "Audit Assignments:" },
    { key: "auditsData", label: "Audits Data:" },
    { key: "auditEnquiry", label: "Audit Enquiry:" },
    { key: "users", label: "Users:" },
    { key: "roles", label: "Roles:" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Role</h1>
            <p className="text-sm text-gray-600 mt-1">Dashboard → Roles</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <hr className="border-gray-200" />

              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="roleName">
                    Role Name: <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="roleName"
                    placeholder="Enter Role Name"
                    value={formData.roleName}
                    onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <Switch
                    checked={formData.status === "Active"}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "Active" : "Inactive" })}
                    className="data-[state=checked]:bg-[#8B1538]"
                  />
                  <Label>{formData.status}</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Admin Dashboard Permissions</h3>
              <hr className="border-gray-200" />

              <div className="space-y-3">
                {permissionModules.map((module) => {
                  const perms = formData.permissions?.[module.key as keyof typeof formData.permissions] as PermissionSet
                  const isDashboard = module.key === "dashboard"

                  return (
                    <div key={module.key} className="flex items-center gap-6">
                      <div className="w-48 text-sm text-gray-700">{module.label}</div>
                      <div className="flex items-center gap-6">
                        {!isDashboard && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={perms?.all || false}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(module.key, "all", checked as boolean)
                              }
                            />
                            <span className="text-sm text-gray-600">All</span>
                          </label>
                        )}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={perms?.view || false}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(module.key, "view", checked as boolean)
                            }
                          />
                          <span className="text-sm text-gray-600">View</span>
                        </label>
                        {!isDashboard && (
                          <>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={perms?.create || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(module.key, "create", checked as boolean)
                                }
                              />
                              <span className="text-sm text-gray-600">Create</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={perms?.edit || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(module.key, "edit", checked as boolean)
                                }
                              />
                              <span className="text-sm text-gray-600">Edit</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={perms?.delete || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(module.key, "delete", checked as boolean)
                                }
                              />
                              <span className="text-sm text-gray-600">Delete</span>
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#8B1538] to-[#A8153F] hover:from-[#7A1230] hover:to-[#8B1538] text-white px-8"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
