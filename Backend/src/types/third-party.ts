export interface ThirdPartyAuditor {
  id: string
  fullName: string
  mobile: string
  email: string
  residentialAddress: string
  city: string
  pincode: string
  highestQualification: string
  specialization: string
  yearsOfExperience: number
  certifications: Attachment[]
  accountHolderName: string
  accountNumber: string
  bankName: string
  ifscCode: string
  panNumber: string
  panImage: string
  aadhaarNumber: string
  aadhaarImage: string
  profileImage: string
  videoUpload: string
  profileStatus: "Pending" | "Verified" | "Rejected"
  appStatus: "Active" | "Inactive"
  rejectionRemarks?: string
  rejectionHistory?: RejectionHistory[]
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
