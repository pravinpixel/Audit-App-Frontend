import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  ArrowLeft, Building2, MapPin, Search, ChevronDown, CalendarClock, FileEdit, Flame, BookOpen, Save,
  UserPlus, Users, Edit, X, UserMinus,
} from "lucide-react"
import {
  AVAILABLE_COMPANIES,
  AVAILABLE_USERS,
  type CompanyOption,
  type CustomerAssignment,
  type AssignedUser,
  type UserAccess,
  type ModuleAccess,
  type ProductType,
} from "../page"

const STORAGE_KEY = "assignedCustomers"

function fullAccess(): UserAccess {
  return {
    dueDateFollowup: { enabled: true, productTypes: ["Extinguisher", "Training"] },
    changeRequest: { enabled: true, productTypes: ["Extinguisher", "Training"] },
  }
}

function withModuleToggled(access: UserAccess, moduleKey: "dueDateFollowup" | "changeRequest", enabled: boolean): UserAccess {
  return {
    ...access,
    [moduleKey]: { enabled, productTypes: enabled ? access[moduleKey].productTypes : [] },
  }
}

function withProductTypeToggled(access: UserAccess, moduleKey: "dueDateFollowup" | "changeRequest", type: ProductType): UserAccess {
  const module = access[moduleKey]
  return {
    ...access,
    [moduleKey]: {
      ...module,
      productTypes: module.productTypes.includes(type)
        ? module.productTypes.filter((t) => t !== type)
        : [...module.productTypes, type],
    },
  }
}

function ModuleAccessFields({
  access,
  onToggleModule,
  onToggleProductType,
}: {
  access: UserAccess
  onToggleModule: (moduleKey: "dueDateFollowup" | "changeRequest", enabled: boolean) => void
  onToggleProductType: (moduleKey: "dueDateFollowup" | "changeRequest", type: ProductType) => void
}) {
  return (
    <div className="space-y-3">
      {(["dueDateFollowup", "changeRequest"] as const).map((moduleKey) => {
        const module: ModuleAccess = access[moduleKey]
        const label = moduleKey === "dueDateFollowup" ? "Due Date Followup" : "Customer Change Request"
        const Icon = moduleKey === "dueDateFollowup" ? CalendarClock : FileEdit
        return (
          <div key={moduleKey} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={moduleKey === "dueDateFollowup" ? "h-4 w-4 text-blue-500" : "h-4 w-4 text-[#E63946]"} />
                <span className="text-sm font-semibold text-gray-800">{label}</span>
              </div>
              <Switch
                checked={module.enabled}
                onCheckedChange={(checked) => onToggleModule(moduleKey, checked)}
              />
            </div>
            {module.enabled && (
              <div className="mt-3 pl-6 flex items-center gap-5">
                {(["Extinguisher", "Training"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={module.productTypes.includes(type)}
                      onCheckedChange={() => onToggleProductType(moduleKey, type)}
                      className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                    />
                    <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                      {type === "Extinguisher" ? <Flame className="h-3.5 w-3.5 text-orange-500" /> : <BookOpen className="h-3.5 w-3.5 text-blue-500" />}
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AssignCustomerFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get("id")

  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null)
  const [companyPopoverOpen, setCompanyPopoverOpen] = useState(false)
  const [companySearch, setCompanySearch] = useState("")

  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([])
  const [userPopoverOpen, setUserPopoverOpen] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [pendingUserIds, setPendingUserIds] = useState<string[]>([])
  const [defaultAccess, setDefaultAccess] = useState<UserAccess>(fullAccess())

  const [editingUser, setEditingUser] = useState<AssignedUser | null>(null)
  const [editingAccess, setEditingAccess] = useState<UserAccess>(fullAccess())

  const [userToRemove, setUserToRemove] = useState<AssignedUser | null>(null)

  useEffect(() => {
    if (!editId) return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const assignments: CustomerAssignment[] = JSON.parse(stored)
    const found = assignments.find((a) => a.id === editId)
    if (found) {
      setSelectedCompany({
        companyName: found.companyName,
        industryType: found.industryType,
        branchLocation: found.branchLocation,
      })
      setAssignedUsers(found.assignedUsers ?? [])
    }
  }, [editId])

  const filteredCompanies = AVAILABLE_COMPANIES.filter((c) =>
    c.companyName.toLowerCase().includes(companySearch.toLowerCase())
  )

  const assignedUserIds = new Set(assignedUsers.map((u) => u.userId))
  const filteredUsers = AVAILABLE_USERS.filter(
    (u) => !assignedUserIds.has(u.id) && u.name.toLowerCase().includes(userSearch.toLowerCase())
  )

  const togglePendingUser = (id: string) => {
    setPendingUserIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleAddUsers = () => {
    if (pendingUserIds.length === 0) return
    const newUsers: AssignedUser[] = pendingUserIds.map((id) => {
      const user = AVAILABLE_USERS.find((u) => u.id === id)!
      return { userId: user.id, userName: user.name, access: defaultAccess }
    })
    setAssignedUsers((prev) => [...prev, ...newUsers])
    setPendingUserIds([])
    setUserSearch("")
    setUserPopoverOpen(false)
  }

  const openEditUser = (user: AssignedUser) => {
    setEditingUser(user)
    setEditingAccess(user.access)
  }

  const toggleEditingProductType = (moduleKey: "dueDateFollowup" | "changeRequest", type: ProductType) => {
    setEditingAccess((prev) => withProductTypeToggled(prev, moduleKey, type))
  }

  const toggleEditingModule = (moduleKey: "dueDateFollowup" | "changeRequest", enabled: boolean) => {
    setEditingAccess((prev) => withModuleToggled(prev, moduleKey, enabled))
  }

  const toggleDefaultProductType = (moduleKey: "dueDateFollowup" | "changeRequest", type: ProductType) => {
    setDefaultAccess((prev) => withProductTypeToggled(prev, moduleKey, type))
  }

  const toggleDefaultModule = (moduleKey: "dueDateFollowup" | "changeRequest", enabled: boolean) => {
    setDefaultAccess((prev) => withModuleToggled(prev, moduleKey, enabled))
  }

  const handleSaveUserAccess = () => {
    if (!editingUser) return
    setAssignedUsers((prev) =>
      prev.map((u) => (u.userId === editingUser.userId ? { ...u, access: editingAccess } : u))
    )
    setEditingUser(null)
  }

  const handleConfirmRemove = () => {
    if (!userToRemove) return
    setAssignedUsers((prev) => prev.filter((u) => u.userId !== userToRemove.userId))
    setUserToRemove(null)
  }

  const handleSave = () => {
    if (!selectedCompany) return

    const stored = localStorage.getItem(STORAGE_KEY)
    const assignments: CustomerAssignment[] = stored ? JSON.parse(stored) : []

    if (editId) {
      const updated = assignments.map((a) =>
        a.id === editId ? { ...a, ...selectedCompany, assignedUsers } : a,
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } else {
      const newAssignment: CustomerAssignment = {
        id: `asn${Date.now()}`,
        ...selectedCompany,
        assignedUsers,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...assignments, newAssignment]))
    }

    navigate("/assign-customer")
  }

  const canSave = !!selectedCompany

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/assign-customer")}
            className="mb-4 -ml-2 hover:bg-[#E63946] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assign Customer
          </Button>

          <h1 className="text-2xl font-bold text-gray-900">{editId ? "Edit Assignment" : "Assign Customer"}</h1>
          <p className="text-sm text-gray-600 mt-1">Select a company, assign users, and configure each user's module access.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Company selection */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-[#E63946]" />
                <label className="text-sm font-medium text-gray-700">Company</label>
              </div>
              {editId ? (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-gray-200 bg-gray-50 text-sm">
                  <span className="font-medium text-gray-900">{selectedCompany?.companyName}</span>
                  <span className="text-gray-400 text-xs">· {selectedCompany?.industryType}</span>
                </div>
              ) : (
                <Popover open={companyPopoverOpen} onOpenChange={setCompanyPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-md border border-gray-300 text-sm text-left hover:border-gray-400 transition-colors">
                      {selectedCompany ? (
                        <span className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-gray-900 truncate">{selectedCompany.companyName}</span>
                          <span className="text-gray-400 text-xs shrink-0">· {selectedCompany.industryType}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400">Select a company…</span>
                      )}
                      <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                          placeholder="Search companies…"
                          value={companySearch}
                          onChange={(e) => setCompanySearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {filteredCompanies.map((company) => (
                        <button
                          key={company.companyName}
                          onClick={() => {
                            setSelectedCompany(company)
                            setCompanyPopoverOpen(false)
                            setCompanySearch("")
                          }}
                          className="w-full flex items-start gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{company.companyName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400">{company.industryType}</span>
                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <MapPin className="h-2.5 w-2.5" />
                                {company.branchLocation}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                      {filteredCompanies.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">No companies found</p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Assign User */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="h-4 w-4 text-[#E63946]" />
                <label className="text-sm font-medium text-gray-700">Assign User</label>
              </div>
              <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-md border border-gray-300 text-sm text-left hover:border-gray-400 transition-colors">
                    {pendingUserIds.length > 0 ? (
                      <span className="text-gray-900">{pendingUserIds.length} user{pendingUserIds.length > 1 ? "s" : ""} selected</span>
                    ) : (
                      <span className="text-gray-400">Select users…</span>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                        placeholder="Search users…"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {filteredUsers.map((user) => (
                      <label key={user.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <Checkbox
                          checked={pendingUserIds.includes(user.id)}
                          onCheckedChange={() => togglePendingUser(user.id)}
                          className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                        />
                        <span className="text-sm text-gray-700">{user.name}</span>
                      </label>
                    ))}
                    {filteredUsers.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">No users found</p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {pendingUserIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {pendingUserIds.map((id) => {
                    const user = AVAILABLE_USERS.find((u) => u.id === id)!
                    return (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-xs font-medium text-[#E63946]">
                        {user.name}
                        <button onClick={() => togglePendingUser(id)} className="hover:text-red-700">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-700 mb-2.5">Default access for newly added users</p>
                <ModuleAccessFields
                  access={defaultAccess}
                  onToggleModule={toggleDefaultModule}
                  onToggleProductType={toggleDefaultProductType}
                />
                <Button
                  onClick={handleAddUsers}
                  disabled={pendingUserIds.length === 0}
                  className="w-full mt-4 bg-[#E63946] hover:bg-[#E63946]/90 text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign User
                </Button>
              </div>
            </div>
          </div>

          {/* Right column: Assigned Users list */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-[#E63946]" />
              <label className="text-sm font-medium text-gray-700">Assigned Users ({assignedUsers.length})</label>
            </div>

            {assignedUsers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No users assigned yet.</p>
            ) : (
              <div className="space-y-2.5">
                {assignedUsers.map((user) => (
                  <div key={user.userId} className="border border-gray-200 rounded-lg p-3.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{user.userName}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {user.access.dueDateFollowup.enabled && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-semibold">
                            <CalendarClock className="h-2.5 w-2.5" /> Due Date Followup
                          </span>
                        )}
                        {user.access.changeRequest.enabled && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E63946]/10 text-[#E63946] border border-[#E63946]/20 text-[10px] font-semibold">
                            <FileEdit className="h-2.5 w-2.5" /> Change Request
                          </span>
                        )}
                        {!user.access.dueDateFollowup.enabled && !user.access.changeRequest.enabled && (
                          <span className="text-xs text-gray-400">No modules enabled</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditUser(user)}
                        className="text-[#E63946] hover:text-[#E63946] hover:bg-[#E63946]/10"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUserToRemove(user)}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <UserMinus className="h-3.5 w-3.5 mr-1" />
                        Remove Access
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate("/assign-customer")}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave}
            className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {editId ? "Save Changes" : "Assign Customer"}
          </Button>
        </div>
      </div>

      {/* Edit user access dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => { if (!open) setEditingUser(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Access — {editingUser?.userName}</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <ModuleAccessFields
              access={editingAccess}
              onToggleModule={toggleEditingModule}
              onToggleProductType={toggleEditingProductType}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUserAccess} className="bg-[#E63946] hover:bg-[#E63946]/90 text-white">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove access confirmation dialog */}
      <Dialog open={!!userToRemove} onOpenChange={(open) => { if (!open) setUserToRemove(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {userToRemove?.userName}'s access to this customer? This will unassign them from all modules.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToRemove(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRemove} className="bg-red-600 hover:bg-red-700 text-white">
              <UserMinus className="h-4 w-4 mr-2" />
              Remove Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
