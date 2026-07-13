import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { VendorFilters } from "@/components/vendor-filters"
import { VendorTable } from "@/components/vendor-table"
import { Button } from "@/components/ui/button"
import { Download, Building2, CheckCircle2, Clock, Activity } from "lucide-react"
import { SummaryCards } from "@/components/summary-cards"
import type { Vendor } from "@/types/vendor"

const dummyVendors: Vendor[] = [
  {
    id: "VEN001",
    companyName: "FireGuard Solutions Pvt Ltd",
    legalBusinessName: "FireGuard Safety Solutions Private Limited",
    typeOfCompany: "Private Limited",
    yearOfEstablishment: 2015,
    companyRegistrationNumber: "U74999MH2015PTC123456",
    contactPersonName: "Rajesh Kumar",
    contactPersonMobile: "+91 98765 43210",
    contactPersonEmail: "rajesh@fireguard.com",
    headOfficeAddress: "123, Industrial Area, Andheri East",
    state: "Maharashtra",
    city: "Mumbai",
    district: "Mumbai Suburban",
    pinCode: "400059",
    gstNumber: "27AABCU9603R1ZM",
    addressProof: { id: "1", name: "Address Proof.pdf", url: "/placeholder.pdf", type: "pdf" },
    branchOffices: [{ id: "1", address: "456, Tech Park", city: "Pune", state: "Maharashtra", pinCode: "411014" }],
    fireSafetyServices: [
      "Fire Extinguisher Servicing",
      "Fire Alarm System Installation",
      "Sprinkler System Maintenance",
    ],
    experienceInServicing: 8,
    trainedTechniciansCount: 25,
    certifications: "ISO 9001:2015, NFPA Certified",
    toolsEquipment: "Hydraulic Testing Equipment, Refilling Units, Testing Gauges",
    supportingDocuments: [{ id: "1", name: "Certifications.pdf", url: "/placeholder.pdf", type: "pdf" }],
    panCard: {
      id: "1",
      name: "PAN Card.jpg",
      url: "/pan-card.jpg",
      type: "image",
    },
    gstCertificate: {
      id: "1",
      name: "GST Certificate.jpg",
      url: "/gst-certificate.jpg",
      type: "image",
    },
    companyRegistrationCertificate: {
      id: "1",
      name: "Registration Certificate.jpg",
      url: "/registration-certificate.jpg",
      type: "image",
    },
    idProof: {
      id: "1",
      name: "Director ID.jpg",
      url: "/aadhaar-card.jpg",
      type: "image",
    },
    bankPassbook: {
      id: "1",
      name: "Bank Passbook.jpg",
      url: "/bank-passbook.jpg",
      type: "image",
    },
    shopActLicense: {
      id: "1",
      name: "Shop Act.jpg",
      url: "/shop-act.jpg",
      type: "image",
    },
    additionalDocuments: [],
    profileStatus: "Verified",
    appStatus: "Active",
  },
  {
    id: "VEN002",
    companyName: "SafetyFirst Services",
    legalBusinessName: "SafetyFirst Fire Safety Services",
    typeOfCompany: "Partnership",
    yearOfEstablishment: 2018,
    companyRegistrationNumber: "U74999DL2018PTC234567",
    contactPersonName: "Amit Sharma",
    contactPersonMobile: "+91 98765 43211",
    contactPersonEmail: "amit@safetyfirst.com",
    headOfficeAddress: "789, Okhla Industrial Area",
    state: "Delhi",
    city: "New Delhi",
    district: "South Delhi",
    pinCode: "110020",
    gstNumber: "07AABCU9603R1ZN",
    addressProof: { id: "1", name: "Address Proof.pdf", url: "/placeholder.pdf", type: "pdf" },
    branchOffices: [],
    fireSafetyServices: ["Fire Extinguisher Servicing", "Fire Safety Training"],
    experienceInServicing: 5,
    trainedTechniciansCount: 12,
    certifications: "ISO 14001:2015",
    toolsEquipment: "Refilling Equipment, Safety Gear",
    supportingDocuments: [],
    panCard: {
      id: "1",
      name: "PAN Card.jpg",
      url: "/pan-card.jpg",
      type: "image",
    },
    gstCertificate: {
      id: "1",
      name: "GST Certificate.jpg",
      url: "/gst-certificate.jpg",
      type: "image",
    },
    companyRegistrationCertificate: {
      id: "1",
      name: "Registration Certificate.jpg",
      url: "/registration-certificate.jpg",
      type: "image",
    },
    idProof: {
      id: "1",
      name: "Partner ID.jpg",
      url: "/aadhaar-card.jpg",
      type: "image",
    },
    bankPassbook: {
      id: "1",
      name: "Bank Passbook.jpg",
      url: "/bank-passbook.jpg",
      type: "image",
    },
    shopActLicense: {
      id: "1",
      name: "Shop Act.jpg",
      url: "/shop-act.jpg",
      type: "image",
    },
    additionalDocuments: [],
    profileStatus: "Pending",
    appStatus: "Active",
  },
  {
    id: "VEN003",
    companyName: "SecureFire Technologies Ltd",
    legalBusinessName: "SecureFire Technologies Private Limited",
    typeOfCompany: "Private Limited",
    yearOfEstablishment: 2012,
    companyRegistrationNumber: "U74999KA2012PTC345678",
    contactPersonName: "Priya Reddy",
    contactPersonMobile: "+91 98765 43212",
    contactPersonEmail: "priya@securefire.com",
    headOfficeAddress: "234, Electronic City, Phase 1",
    state: "Karnataka",
    city: "Bangalore",
    district: "Bangalore Urban",
    pinCode: "560100",
    gstNumber: "29AABCU9603R1ZO",
    addressProof: { id: "1", name: "Address Proof.pdf", url: "/placeholder.pdf", type: "pdf" },
    branchOffices: [
      { id: "1", address: "567, Whitefield", city: "Bangalore", state: "Karnataka", pinCode: "560066" },
      { id: "2", address: "890, HSR Layout", city: "Bangalore", state: "Karnataka", pinCode: "560102" },
    ],
    fireSafetyServices: [
      "Fire Extinguisher Servicing",
      "Fire Alarm System Installation",
      "Fire Hydrant Testing",
      "Emergency Lighting",
    ],
    experienceInServicing: 11,
    trainedTechniciansCount: 35,
    certifications: "ISO 9001:2015, ISO 14001:2015, NFPA Certified",
    toolsEquipment: "Hydraulic Testing Equipment, Digital Testing Gauges, Refilling Stations, Safety Gear",
    supportingDocuments: [
      { id: "1", name: "ISO Certificates.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "NFPA Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    panCard: {
      id: "1",
      name: "PAN Card.jpg",
      url: "/pan-card.jpg",
      type: "image",
    },
    gstCertificate: {
      id: "1",
      name: "GST Certificate.jpg",
      url: "/gst-certificate.jpg",
      type: "image",
    },
    companyRegistrationCertificate: {
      id: "1",
      name: "Registration Certificate.jpg",
      url: "/registration-certificate.jpg",
      type: "image",
    },
    idProof: {
      id: "1",
      name: "Director ID.jpg",
      url: "/aadhaar-card.jpg",
      type: "image",
    },
    bankPassbook: {
      id: "1",
      name: "Bank Passbook.jpg",
      url: "/bank-passbook.jpg",
      type: "image",
    },
    shopActLicense: {
      id: "1",
      name: "Shop Act.jpg",
      url: "/shop-act.jpg",
      type: "image",
    },
    additionalDocuments: [],
    profileStatus: "Verified",
    appStatus: "Active",
  },
  {
    id: "VEN004",
    companyName: "Phoenix Fire Safety",
    legalBusinessName: "Phoenix Fire Safety Solutions LLP",
    typeOfCompany: "LLP",
    yearOfEstablishment: 2019,
    companyRegistrationNumber: "U74999GJ2019LLP456789",
    contactPersonName: "Vikram Patel",
    contactPersonMobile: "+91 98765 43213",
    contactPersonEmail: "vikram@phoenixfire.com",
    headOfficeAddress: "456, SG Highway, Bodakdev",
    state: "Gujarat",
    city: "Ahmedabad",
    district: "Ahmedabad",
    pinCode: "380054",
    gstNumber: "24AABCU9603R1ZP",
    addressProof: { id: "1", name: "Address Proof.pdf", url: "/placeholder.pdf", type: "pdf" },
    branchOffices: [
      { id: "1", address: "789, Satellite Road", city: "Ahmedabad", state: "Gujarat", pinCode: "380015" },
    ],
    fireSafetyServices: ["Fire Extinguisher Servicing", "Fire Safety Audit", "Fire Safety Training"],
    experienceInServicing: 4,
    trainedTechniciansCount: 18,
    certifications: "ISO 9001:2015",
    toolsEquipment: "Refilling Units, Pressure Testing Equipment, Training Materials",
    supportingDocuments: [{ id: "1", name: "ISO Certificate.pdf", url: "/placeholder.pdf", type: "pdf" }],
    panCard: {
      id: "1",
      name: "PAN Card.jpg",
      url: "/pan-card.jpg",
      type: "image",
    },
    gstCertificate: {
      id: "1",
      name: "GST Certificate.jpg",
      url: "/gst-certificate.jpg",
      type: "image",
    },
    companyRegistrationCertificate: {
      id: "1",
      name: "Registration Certificate.jpg",
      url: "/registration-certificate.jpg",
      type: "image",
    },
    idProof: {
      id: "1",
      name: "Partner ID.jpg",
      url: "/aadhaar-card.jpg",
      type: "image",
    },
    bankPassbook: {
      id: "1",
      name: "Bank Passbook.jpg",
      url: "/bank-passbook.jpg",
      type: "image",
    },
    shopActLicense: {
      id: "1",
      name: "Shop Act.jpg",
      url: "/shop-act.jpg",
      type: "image",
    },
    additionalDocuments: [],
    profileStatus: "Pending",
    appStatus: "Active",
  },
  {
    id: "VEN005",
    companyName: "Guardian Safety Systems",
    legalBusinessName: "Guardian Safety Systems Pvt Ltd",
    typeOfCompany: "Private Limited",
    yearOfEstablishment: 2010,
    companyRegistrationNumber: "U74999TN2010PTC567890",
    contactPersonName: "Suresh Kumar",
    contactPersonMobile: "+91 98765 43214",
    contactPersonEmail: "suresh@guardiansafety.com",
    headOfficeAddress: "678, Anna Salai, Nandanam",
    state: "Tamil Nadu",
    city: "Chennai",
    district: "Chennai",
    pinCode: "600035",
    gstNumber: "33AABCU9603R1ZQ",
    addressProof: { id: "1", name: "Address Proof.pdf", url: "/placeholder.pdf", type: "pdf" },
    branchOffices: [
      { id: "1", address: "901, OMR Road", city: "Chennai", state: "Tamil Nadu", pinCode: "600097" },
      { id: "2", address: "234, Guindy", city: "Chennai", state: "Tamil Nadu", pinCode: "600032" },
    ],
    fireSafetyServices: [
      "Fire Extinguisher Servicing",
      "Fire Alarm System Installation",
      "Sprinkler System Maintenance",
      "Fire Safety Audit",
      "Emergency Response Planning",
    ],
    experienceInServicing: 13,
    trainedTechniciansCount: 42,
    certifications: "ISO 9001:2015, ISO 14001:2015, OHSAS 18001, NFPA Certified",
    toolsEquipment:
      "Advanced Hydraulic Testing Equipment, Digital Gauges, Refilling Stations, Sprinkler Testing Tools, Safety Equipment",
    supportingDocuments: [
      { id: "1", name: "ISO Certificates.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "NFPA Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "3", name: "OHSAS Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    panCard: {
      id: "1",
      name: "PAN Card.jpg",
      url: "/pan-card.jpg",
      type: "image",
    },
    gstCertificate: {
      id: "1",
      name: "GST Certificate.jpg",
      url: "/gst-certificate.jpg",
      type: "image",
    },
    companyRegistrationCertificate: {
      id: "1",
      name: "Registration Certificate.jpg",
      url: "/registration-certificate.jpg",
      type: "image",
    },
    idProof: {
      id: "1",
      name: "Director ID.jpg",
      url: "/aadhaar-card.jpg",
      type: "image",
    },
    bankPassbook: {
      id: "1",
      name: "Bank Passbook.jpg",
      url: "/bank-passbook.jpg",
      type: "image",
    },
    shopActLicense: {
      id: "1",
      name: "Shop Act.jpg",
      url: "/shop-act.jpg",
      type: "image",
    },
    additionalDocuments: [],
    profileStatus: "Verified",
    appStatus: "Active",
  },
  {
    id: "VEN006",
    companyName: "BlazeTech Fire Solutions",
    legalBusinessName: "BlazeTech Fire Solutions India Pvt Ltd",
    typeOfCompany: "Private Limited",
    yearOfEstablishment: 2020,
    companyRegistrationNumber: "U74999UP2020PTC678901",
    contactPersonName: "Neha Singh",
    contactPersonMobile: "+91 98765 43215",
    contactPersonEmail: "neha@blazetech.com",
    headOfficeAddress: "123, Gomti Nagar Extension",
    state: "Uttar Pradesh",
    city: "Lucknow",
    district: "Lucknow",
    pinCode: "226010",
    gstNumber: "09AABCU9603R1ZR",
    addressProof: { id: "1", name: "Address Proof.pdf", url: "/placeholder.pdf", type: "pdf" },
    branchOffices: [],
    fireSafetyServices: ["Fire Extinguisher Servicing", "Fire Safety Training", "Fire Safety Consultation"],
    experienceInServicing: 3,
    trainedTechniciansCount: 10,
    certifications: "ISO 9001:2015",
    toolsEquipment: "Basic Testing Equipment, Refilling Units, Safety Gear",
    supportingDocuments: [{ id: "1", name: "ISO Certificate.pdf", url: "/placeholder.pdf", type: "pdf" }],
    panCard: {
      id: "1",
      name: "PAN Card.jpg",
      url: "/pan-card.jpg",
      type: "image",
    },
    gstCertificate: {
      id: "1",
      name: "GST Certificate.jpg",
      url: "/gst-certificate.jpg",
      type: "image",
    },
    companyRegistrationCertificate: {
      id: "1",
      name: "Registration Certificate.jpg",
      url: "/registration-certificate.jpg",
      type: "image",
    },
    idProof: {
      id: "1",
      name: "Partner ID.jpg",
      url: "/aadhaar-card.jpg",
      type: "image",
    },
    bankPassbook: {
      id: "1",
      name: "Bank Passbook.jpg",
      url: "/bank-passbook.jpg",
      type: "image",
    },
    shopActLicense: {
      id: "1",
      name: "Shop Act.jpg",
      url: "/shop-act.jpg",
      type: "image",
    },
    additionalDocuments: [],
    profileStatus: "Pending",
    appStatus: "Inactive",
  },
]

export default function VendorRegistrationPage() {
  const [vendors, setVendors] = useState<Vendor[]>(dummyVendors)
  const [searchQuery, setSearchQuery] = useState("")
  const [profileStatusFilter, setProfileStatusFilter] = useState<string[]>([])

  useEffect(() => {
    const storedVendors = localStorage.getItem("vendors")
    if (storedVendors) {
      setVendors(JSON.parse(storedVendors))
    } else {
      localStorage.setItem("vendors", JSON.stringify(dummyVendors))
    }
  }, [])

  const handleExport = () => {
    console.log("Exporting vendors...")
  }

  const summaryCards = [
    {
      title: "Total Vendors",
      value: vendors.length,
      icon: Building2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Verified Profiles",
      value: vendors.filter((v) => v.profileStatus === "Verified").length,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Pending Verification",
      value: vendors.filter((v) => v.profileStatus === "Pending").length,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      title: "Active Vendors",
      value: vendors.filter((v) => v.appStatus === "Active").length,
      icon: Activity,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Registration</h1>
            <p className="text-sm text-gray-600 mt-1">Manage vendor profiles and fire safety service providers</p>
          </div>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Vendors
          </Button>
        </div>

        <SummaryCards cards={summaryCards} />

        <VendorFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          profileStatusFilter={profileStatusFilter}
          onProfileStatusChange={setProfileStatusFilter}
        />

        <VendorTable
          vendors={vendors}
          setVendors={setVendors}
          searchQuery={searchQuery}
          profileStatusFilter={profileStatusFilter}
        />
      </div>
    </DashboardLayout>
  )
}
