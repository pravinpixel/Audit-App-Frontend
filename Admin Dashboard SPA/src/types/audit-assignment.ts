export interface AuditAssignment {
  id: string
  requestId: string
  requestDate: string
  companyName: string
  companyLocation: string
  contactName: string
  contactPhone: string
  contactEmail: string
  buildingType: string
  floors: number
  extinguisherCount: number
  assignmentStatus: "Assigned" | "Not Assigned"
  salesPerson?: string
}
