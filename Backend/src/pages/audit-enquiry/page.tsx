import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, MessageSquare, Users, Building2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuditEnquiryFilters } from "@/components/audit-enquiry-filters"
import { AuditEnquiryTable } from "@/components/audit-enquiry-table"
import { SummaryCards } from "@/components/summary-cards"
import type { AuditEnquiry } from "@/types/audit-enquiry"

export default function AuditEnquiryPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [industryTypeFilter, setIndustryTypeFilter] = useState<string[]>([])
  const [branchLocationFilter, setBranchLocationFilter] = useState<string[]>([])
  const [headOfficeFilter, setHeadOfficeFilter] = useState<string[]>([])
  const [stateFilter, setStateFilter] = useState<string[]>([])
  const [cityFilter, setCityFilter] = useState<string[]>([])

  const [enquiries, setEnquiries] = useState<AuditEnquiry[]>([
    {
      id: "ENQ001",
      customerName: "Tech Solutions Pvt Ltd",
      industryType: "IT Services",
      branchLocation: "Bangalore - Koramangala",
      headOfficeLocation: "Bangalore",
      state: "Karnataka",
      city: "Bangalore",
      salesPerson: "Rajesh Kumar",
    },
    {
      id: "ENQ002",
      customerName: "Manufacturing Corp",
      industryType: "Manufacturing",
      branchLocation: "Mumbai - Andheri",
      headOfficeLocation: "Mumbai",
      state: "Maharashtra",
      city: "Mumbai",
      salesPerson: "Priya Sharma",
    },
    {
      id: "ENQ003",
      customerName: "Healthcare Services Ltd",
      industryType: "Healthcare",
      branchLocation: "Delhi - Connaught Place",
      headOfficeLocation: "Delhi",
      state: "Delhi",
      city: "New Delhi",
      salesPerson: "Amit Patel",
    },
    {
      id: "ENQ004",
      customerName: "Retail Chain Stores",
      industryType: "Retail",
      branchLocation: "Chennai - T Nagar",
      headOfficeLocation: "Chennai",
      state: "Tamil Nadu",
      city: "Chennai",
      salesPerson: "Sunita Reddy",
    },
    {
      id: "ENQ005",
      customerName: "Financial Services Inc",
      industryType: "Finance",
      branchLocation: "Hyderabad - Hitech City",
      headOfficeLocation: "Hyderabad",
      state: "Telangana",
      city: "Hyderabad",
      salesPerson: "Vikram Singh",
    },
    {
      id: "ENQ006",
      customerName: "Education Academy",
      industryType: "Education",
      branchLocation: "Pune - Kothrud",
      headOfficeLocation: "Pune",
      state: "Maharashtra",
      city: "Pune",
      salesPerson: "Anjali Desai",
    },
    {
      id: "ENQ007",
      customerName: "Hospitality Group",
      industryType: "Hospitality",
      branchLocation: "Goa - Panaji",
      headOfficeLocation: "Goa",
      state: "Goa",
      city: "Panaji",
      salesPerson: "Rohit Mehta",
    },
    {
      id: "ENQ008",
      customerName: "Logistics Solutions",
      industryType: "Logistics",
      branchLocation: "Kolkata - Salt Lake",
      headOfficeLocation: "Kolkata",
      state: "West Bengal",
      city: "Kolkata",
      salesPerson: "Neha Gupta",
    },
  ])

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
    }
  }, [navigate])

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      searchQuery === "" ||
      enquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.industryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.branchLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.city.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesIndustryType = industryTypeFilter.length === 0 || industryTypeFilter.includes(enquiry.industryType)
    const matchesBranchLocation =
      branchLocationFilter.length === 0 || branchLocationFilter.includes(enquiry.branchLocation)
    const matchesHeadOffice = headOfficeFilter.length === 0 || headOfficeFilter.includes(enquiry.headOfficeLocation)
    const matchesState = stateFilter.length === 0 || stateFilter.includes(enquiry.state)
    const matchesCity = cityFilter.length === 0 || cityFilter.includes(enquiry.city)

    return (
      matchesSearch && matchesIndustryType && matchesBranchLocation && matchesHeadOffice && matchesState && matchesCity
    )
  })

  const summaryCards = [
    {
      title: "Total Enquiries",
      value: filteredEnquiries.length,
      icon: MessageSquare,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Sales Persons",
      value: new Set(enquiries.map((e) => e.salesPerson)).size,
      icon: Users,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Industries Covered",
      value: new Set(enquiries.map((e) => e.industryType)).size,
      icon: Building2,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      title: "Cities",
      value: new Set(enquiries.map((e) => e.city)).size,
      icon: MapPin,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
  ]

  const handleView = (id: string) => {
    navigate(`/audit-enquiry/${id}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Enquiry</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage audit enquiries</p>
          </div>
          <Button className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Enquiries
          </Button>
        </div>

        <SummaryCards cards={summaryCards} />

        <AuditEnquiryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          industryTypeFilter={industryTypeFilter}
          onIndustryTypeChange={setIndustryTypeFilter}
          branchLocationFilter={branchLocationFilter}
          onBranchLocationChange={setBranchLocationFilter}
          headOfficeFilter={headOfficeFilter}
          onHeadOfficeChange={setHeadOfficeFilter}
          stateFilter={stateFilter}
          onStateChange={setStateFilter}
          cityFilter={cityFilter}
          onCityChange={setCityFilter}
        />

        <AuditEnquiryTable enquiries={filteredEnquiries} onView={handleView} />
      </div>
    </DashboardLayout>
  )
}
