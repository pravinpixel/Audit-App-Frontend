export interface PrimaryContact {
  name: string
  designation: string
  mobile: string
  email: string
}

export interface AuditCompany {
  id: string
  companyName: string
  industryType: string
  branchLocation: string
  headOfficeLocation: string
  state: string
  city: string
  approvalsPending: number
  primaryContact?: PrimaryContact
  assignmentStatus?: "Self Assigned" | "Not Assigned"
  assignedTo?: string
}

export interface ExtinguisherSurvey {
  id: string
  companyId: string
  auditorName: string
  auditorPhone: string
  auditorEmail: string
  enquiryDateTime: string
  customerLocationNo: string
  floorDetails: string
  locationDetails: string
  extinguisherType: string
  capacity: string
  brand: string
  refillDueDate: string
  hptDueDate: string
  shelfLifeExpiry: string
  productImage: string
  status: "Pending" | "Verified" | "Rejected"
}

export interface TrainingSurvey {
  id: string
  companyId: string
  auditorName: string
  auditorPhone: string
  auditorEmail: string
  trainingDateTime: string
  trainingTitle: string
  trainingDueDate: string
  trainingGivenBy: string
  status: "Pending" | "Verified" | "Rejected"
}
