export interface Employee {
  id: string
  dbId: number
  fullName: string
  mobile: string
  email: string
  department: string
  registrationType: "employee" | "data_collector"
  profileStatus: "Pending" | "Verified" | "Rejected"
  appStatus: boolean
}
