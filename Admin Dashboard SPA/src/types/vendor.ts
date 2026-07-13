export interface Vendor {
  id: string
  // Company Information
  companyName: string
  legalBusinessName: string
  typeOfCompany: "Proprietorship" | "Partnership" | "Private Limited" | "LLP"
  yearOfEstablishment: number
  companyRegistrationNumber: string
  contactPersonName: string
  contactPersonMobile: string
  contactPersonEmail: string

  // Location Information
  headOfficeAddress: string
  state: string
  city: string
  district: string
  pinCode: string
  gstNumber: string
  addressProof: Attachment
  branchOffices: BranchOffice[]

  // Technical Capabilities
  fireSafetyServices: string[]
  experienceInServicing: number
  trainedTechniciansCount: number
  certifications: string
  toolsEquipment: string
  supportingDocuments: Attachment[]

  // KYC Documents
  panCard: Attachment
  gstCertificate: Attachment
  companyRegistrationCertificate: Attachment
  idProof: Attachment
  bankPassbook: Attachment
  shopActLicense: Attachment
  additionalDocuments: Attachment[]

  // Status
  profileStatus: "Pending" | "Verified" | "Rejected"
  appStatus: "Active" | "Inactive"
  rejectionRemarks?: string
  rejectionHistory?: RejectionHistory[]
}

export interface BranchOffice {
  id: string
  address: string
  city: string
  state: string
  pinCode: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
}

export interface RejectionHistory {
  date: string
  remarks: string
  rejectedBy: string
}
