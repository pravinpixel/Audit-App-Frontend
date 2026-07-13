import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import type { Role, PermissionSet } from "@/types/user"

interface AddRoleModalProps {
  role: Role | null
  isOpen: boolean
  onClose: () => void
  onSave: (role: Role) => void
}

export function AddRoleModal({ role, isOpen, onClose, onSave }: AddRoleModalProps) {
  const [formData, setFormData] = useState<Partial<Role>>({
    roleName: "",
    status: "Active",
    permissions: {
      task: { all: false, view: false, create: false, edit: false, delete: false },
      employee: { all: false, view: false, create: false, edit: false, delete: false },
      organization: { all: false, view: false, create: false, edit: false, delete: false },
      masters: { all: false, view: false, create: false, edit: false, delete: false },
      users: { all: false, view: false, create: false, edit: false, delete: false },
      roles: { all: false, view: false, create: false, edit: false, delete: false },
      setting: { all: false, view: false, create: false, edit: false, delete: false },
      bulkUpload: { all: false, view: false, create: false, edit: false, delete: false },
    },
  })

  useEffect(() => {
    if (role) {
      setFormData(role)
    } else {
      setFormData({
        roleName: "",
        status: "Active",
        permissions: {
          task: { all: false, view: false, create: false, edit: false, delete: false },
          employee: { all: false, view: false, create: false, edit: false, delete: false },
          organization: { all: false, view: false, create: false, edit: false, delete: false },
          masters: { all: false, view: false, create: false, edit: false, delete: false },
          users: { all: false, view: false, create: false, edit: false, delete: false },
          roles: { all: false, view: false, create: false, edit: false, delete: false },
          setting: { all: false, view: false, create: false, edit: false, delete: false },
          bulkUpload: { all: false, view: false, create: false, edit: false, delete: false },
        },
      })
    }
  }, [role, isOpen])

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
    onSave(formData as Role)
  }

  const permissionModules = [
    { key: "task", label: "Task:" },
    { key: "employee", label: "Employee:" },
    { key: "organization", label: "organization:" },
    { key: "masters", label: "Masters:" },
    { key: "users", label: "Users:" },
    { key: "roles", label: "Roles:" },
    { key: "setting", label: "Setting:" },
    { key: "bulkUpload", label: "Bulk Upload:" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ArrowLeft className="h-5 w-5 cursor-pointer" onClick={onClose} />
            {role ? "Edit Role" : "Add Role"}
          </DialogTitle>
          <p className="text-sm text-gray-600">Dashboard → Roles</p>
        </DialogHeader>

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

                return (
                  <div key={module.key} className="flex items-center gap-6">
                    <div className="w-32 text-sm text-gray-700">{module.label}</div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={perms?.all || false}
                          onCheckedChange={(checked) => handlePermissionChange(module.key, "all", checked as boolean)}
                        />
                        <span className="text-sm text-gray-600">All</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={perms?.view || false}
                          onCheckedChange={(checked) => handlePermissionChange(module.key, "view", checked as boolean)}
                        />
                        <span className="text-sm text-gray-600">View</span>
                      </label>
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
                          onCheckedChange={(checked) => handlePermissionChange(module.key, "edit", checked as boolean)}
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
      </DialogContent>
    </Dialog>
  )
}
