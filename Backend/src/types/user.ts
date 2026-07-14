export interface User {
  id: string
  userName: string
  mobileNumber: string
  emailId: string
  role: string
  status: "Active" | "Inactive"
  password?: string
}

export interface Role {
  id: string
  roleName: string
  status: "Active" | "Inactive"
  permissions: RolePermissions
}

export interface RolePermissions {
  task: PermissionSet
  employee: PermissionSet
  organization: PermissionSet
  masters: PermissionSet
  users: PermissionSet
  roles: PermissionSet
  setting: PermissionSet
  bulkUpload: PermissionSet
}

export interface PermissionSet {
  all: boolean
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}
