import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ThirdPartyFilters } from "@/components/third-party-filters"
import { ThirdPartyTable } from "@/components/third-party-table"
import { Button } from "@/components/ui/button"
import { Download, Users, CheckCircle2, Clock, UserCheck } from "lucide-react"
import { SummaryCards } from "@/components/summary-cards"
import type { ThirdPartyAuditor } from "@/types/third-party"

const dummyAuditors: ThirdPartyAuditor[] = [
  {
    id: "TPR001",
    fullName: "Rajesh Kumar",
    mobile: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    residentialAddress: "123, MG Road, Bangalore",
    city: "Bangalore",
    pincode: "560001",
    highestQualification: "B.Tech in Fire Safety Engineering",
    specialization: "Industrial Fire Safety",
    yearsOfExperience: 8,
    certifications: [
      { id: "1", name: "Fire Safety Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "ISO Certification.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    accountHolderName: "Rajesh Kumar",
    accountNumber: "1234567890",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    panNumber: "ABCDE1234F",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "123456789012",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Active",
  },
  {
    id: "TPR002",
    fullName: "Priya Sharma",
    mobile: "+91 98765 43211",
    email: "priya.sharma@example.com",
    residentialAddress: "456, Park Street, Mumbai",
    city: "Mumbai",
    pincode: "400001",
    highestQualification: "M.Sc in Safety Management",
    specialization: "Commercial Fire Safety",
    yearsOfExperience: 5,
    certifications: [{ id: "1", name: "Safety Management Certificate.pdf", url: "/placeholder.pdf", type: "pdf" }],
    accountHolderName: "Priya Sharma",
    accountNumber: "9876543210",
    bankName: "HDFC Bank",
    ifscCode: "HDFC0004567",
    panNumber: "FGHIJ5678K",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "987654321098",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Active",
  },
  {
    id: "TPR003",
    fullName: "Amit Patel",
    mobile: "+91 98765 43212",
    email: "amit.patel@example.com",
    residentialAddress: "789, Ring Road, Ahmedabad",
    city: "Ahmedabad",
    pincode: "380001",
    highestQualification: "Diploma in Fire Technology",
    specialization: "Residential Fire Safety",
    yearsOfExperience: 10,
    certifications: [
      { id: "1", name: "Fire Technology Diploma.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "Advanced Training Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    accountHolderName: "Amit Patel",
    accountNumber: "1122334455",
    bankName: "ICICI Bank",
    ifscCode: "ICIC0001122",
    panNumber: "KLMNO9012P",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "456789012345",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Inactive",
  },
  {
    id: "TPR004",
    fullName: "Sneha Reddy",
    mobile: "+91 98765 43213",
    email: "sneha.reddy@example.com",
    residentialAddress: "321, Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    pincode: "500033",
    highestQualification: "B.Sc in Industrial Safety",
    specialization: "Chemical Fire Safety",
    yearsOfExperience: 6,
    certifications: [{ id: "1", name: "Industrial Safety Certificate.pdf", url: "/placeholder.pdf", type: "pdf" }],
    accountHolderName: "Sneha Reddy",
    accountNumber: "5544332211",
    bankName: "Axis Bank",
    ifscCode: "UTIB0005544",
    panNumber: "PQRST3456U",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "654321098765",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Active",
  },
  {
    id: "TPR005",
    fullName: "Vikram Singh",
    mobile: "+91 98765 43214",
    email: "vikram.singh@example.com",
    residentialAddress: "654, Civil Lines, Delhi",
    city: "Delhi",
    pincode: "110001",
    highestQualification: "M.Tech in Safety Engineering",
    specialization: "High-Rise Fire Safety",
    yearsOfExperience: 12,
    certifications: [
      { id: "1", name: "Safety Engineering Degree.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "High-Rise Safety Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    accountHolderName: "Vikram Singh",
    accountNumber: "7788990011",
    bankName: "Punjab National Bank",
    ifscCode: "PUNB0077889",
    panNumber: "UVWXY6789Z",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "789012345678",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Active",
  },
]

export default function ThirdPartyPage() {
  const [auditors, setAuditors] = useState<ThirdPartyAuditor[]>(dummyAuditors)
  const [searchQuery, setSearchQuery] = useState("")
  const [profileStatusFilter, setProfileStatusFilter] = useState<string[]>([])

  useEffect(() => {
    const storedAuditors = localStorage.getItem("thirdPartyAuditors")
    if (storedAuditors) {
      setAuditors(JSON.parse(storedAuditors))
    } else {
      localStorage.setItem("thirdPartyAuditors", JSON.stringify(dummyAuditors))
    }
  }, [])

  const handleExport = () => {
    console.log("Exporting auditors...")
  }

  const summaryCards = [
    {
      title: "Total Auditors",
      value: auditors.length,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Verified Profiles",
      value: auditors.filter((a) => a.profileStatus === "Verified").length,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Pending Verification",
      value: auditors.filter((a) => a.profileStatus === "Pending").length,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      title: "Active Auditors",
      value: auditors.filter((a) => a.appStatus === "Active").length,
      icon: UserCheck,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Third Party Registration</h1>
            <p className="text-sm text-gray-600 mt-1">Manage third-party auditor profiles and registrations</p>
          </div>
          <Button className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Auditors
          </Button>
        </div>

        <SummaryCards cards={summaryCards} />

        <ThirdPartyFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          profileStatusFilter={profileStatusFilter}
          onProfileStatusChange={setProfileStatusFilter}
        />

        <ThirdPartyTable
          auditors={auditors}
          setAuditors={setAuditors}
          searchQuery={searchQuery}
          profileStatusFilter={profileStatusFilter}
        />
      </div>
    </DashboardLayout>
  )
}
