export interface Customer {
  id: string
  auditorName: string
  auditorMobile: string
  auditorEmail: string
  customerName: string
  industryType: string
  branchLocation: string
  headOfficeLocation: string
  state: string
  city: string
  status: "Pending" | "Verified"
  portalAccess: "Shared" | "Not Shared"
  totalArea?: number
  totalEmployeeCount?: number
  safetyEquipments?: string
  groupOfCompanies?: string
  branchLocations?: string
  remarks?: string
  contactPerson1Name?: string
  contactPerson1Designation?: string
  contactPerson1Mobile?: string
  contactPerson1Email?: string
  contactPerson2Name?: string
  contactPerson2Designation?: string
  contactPerson2Mobile?: string
  contactPerson2Email?: string
  gpsLocation?: string
  address?: string
  area?: string
  district?: string
  pinCode?: string
  country?: string
  gst?: string
  gstCompanyName?: string
  primaryContactIndex?: number
}
