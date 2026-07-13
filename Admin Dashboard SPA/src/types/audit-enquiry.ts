export interface AuditEnquiry {
  id: string
  customerName: string
  industryType: string
  branchLocation: string
  headOfficeLocation: string
  state: string
  city: string
  salesPerson?: string
}

export interface AuditEnquiryDetail extends AuditEnquiry {
  companyName: string
  approvalsPending?: number
}

export interface EnquirySurveyItem {
  id: string
  companyId: string
  auditorName: string
  auditorPhone: string
  auditorEmail: string
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
  status: "Assigned to Vendor" | "Enquiry Viewed" | "Service Date Marked" | "Service Done"
  serviceExpectedDate?: string
  serviceDoneDate?: string
  customerName: string
  remarks: string
  enquiryDate: string
  enquiryTime: string
}

export interface TrainingEnquirySurveyItem {
  id: string
  companyId: string
  auditorName: string
  auditorPhone: string
  auditorEmail: string
  trainingTitle: string
  trainingDueDate: string
  trainingGivenBy: string
  status: "Assigned to Vendor" | "Enquiry Viewed" | "Service Date Marked" | "Service Done"
  serviceExpectedDate?: string
  serviceDoneDate?: string
  customerName: string
  remarks: string
  enquiryDate: string
  enquiryTime: string
}

export interface VendorAction {
  action: string
  date: string
  time: string
  remarks?: string
}

export interface EnquiryDetails extends EnquirySurveyItem {
  vendorActions: VendorAction[]
}
