import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomerFilters } from "@/components/customer-filters"
import { CustomerTable } from "@/components/customer-table"
import { Button } from "@/components/ui/button"
import { Download, Users, CheckCircle2, Clock, Share2 } from "lucide-react"
import type { Customer } from "@/types/customer"
import { SummaryCards } from "@/components/summary-cards"

const dummyCustomers: Customer[] = [
  {
    id: "CUST001",
    auditorName: "John Smith",
    auditorMobile: "+91 98765 43210",
    auditorEmail: "john.smith@safetymatters.com",
    customerName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    headOfficeLocation: "Electronic City, Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    status: "Verified",
    portalAccess: "Shared",
    totalArea: 15000,
    totalEmployeeCount: 250,
    safetyEquipments: "Fire Extinguishers, Smoke Detectors, Emergency Exits",
    groupOfCompanies: "Tech Solutions Group",
    branchLocations: "Bangalore, Mumbai, Delhi",
    remarks: "Regular safety audits conducted",
    contactPerson1Name: "Rahul Sharma",
    contactPerson1Designation: "Safety Manager",
    contactPerson1Mobile: "+91 98765 11111",
    contactPerson1Email: "rahul@techsolutions.com",
    contactPerson2Name: "Priya Patel",
    contactPerson2Designation: "HR Manager",
    contactPerson2Mobile: "+91 98765 22222",
    contactPerson2Email: "priya@techsolutions.com",
    gpsLocation: "12.9352° N, 77.6245° E",
    address: "45, Tech Park, Electronic City Phase 1",
    area: "Electronic City",
    district: "Bangalore Urban",
    pinCode: "560100",
    country: "India",
    gst: "29AAAAA0000A1Z5",
    gstCompanyName: "Tech Solutions Private Limited",
  },
  {
    id: "CUST002",
    auditorName: "Sarah Johnson",
    auditorMobile: "+91 87654 32109",
    auditorEmail: "sarah.johnson@safetymatters.com",
    customerName: "Manufacturing Industries Ltd",
    industryType: "Manufacturing",
    branchLocation: "Peenya Industrial Area, Bangalore",
    headOfficeLocation: "Whitefield, Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    status: "Pending",
    portalAccess: "Not Shared",
    totalArea: 25000,
    totalEmployeeCount: 450,
    safetyEquipments: "Fire Extinguishers, Fire Alarms, Sprinkler Systems",
    groupOfCompanies: "Manufacturing Industries Group",
    branchLocations: "Bangalore, Chennai, Pune",
    remarks: "New facility, pending first audit",
    contactPerson1Name: "Amit Kumar",
    contactPerson1Designation: "Operations Manager",
    contactPerson1Mobile: "+91 98765 33333",
    contactPerson1Email: "amit@manufacturing.com",
    contactPerson2Name: "Sneha Reddy",
    contactPerson2Designation: "Safety Officer",
    contactPerson2Mobile: "+91 98765 44444",
    contactPerson2Email: "sneha@manufacturing.com",
    gpsLocation: "13.0358° N, 77.5540° E",
    address: "Plot 234, Peenya Industrial Area, Phase 2",
    area: "Peenya",
    district: "Bangalore Urban",
    pinCode: "560058",
    country: "India",
    gst: "29BBBBB1111B2Z6",
    gstCompanyName: "Manufacturing Industries Limited",
  },
  {
    id: "CUST003",
    auditorName: "Michael Brown",
    auditorMobile: "+91 76543 21098",
    auditorEmail: "michael.brown@safetymatters.com",
    customerName: "Retail Solutions Co",
    industryType: "Retail",
    branchLocation: "MG Road, Mumbai",
    headOfficeLocation: "Andheri, Mumbai",
    state: "Maharashtra",
    city: "Mumbai",
    status: "Verified",
    portalAccess: "Shared",
    totalArea: 8000,
    totalEmployeeCount: 120,
    safetyEquipments: "Fire Extinguishers, Emergency Lighting, Exit Signs",
    groupOfCompanies: "Retail Solutions Chain",
    branchLocations: "Mumbai, Pune, Nashik",
    remarks: "All safety measures in place",
    contactPerson1Name: "Rajesh Nair",
    contactPerson1Designation: "Store Manager",
    contactPerson1Mobile: "+91 98765 55555",
    contactPerson1Email: "rajesh@retail.com",
    contactPerson2Name: "Kavita Singh",
    contactPerson2Designation: "Admin Head",
    contactPerson2Mobile: "+91 98765 66666",
    contactPerson2Email: "kavita@retail.com",
    gpsLocation: "19.0760° N, 72.8777° E",
    address: "Shop 56-58, MG Road Commercial Complex",
    area: "MG Road",
    district: "Mumbai City",
    pinCode: "400001",
    country: "India",
    gst: "27CCCCC2222C3Z7",
    gstCompanyName: "Retail Solutions Company",
  },
  {
    id: "CUST004",
    auditorName: "Emily Davis",
    auditorMobile: "+91 65432 10987",
    auditorEmail: "emily.davis@safetymatters.com",
    customerName: "Healthcare Services Pvt Ltd",
    industryType: "Healthcare",
    branchLocation: "Koramangala, Bangalore",
    headOfficeLocation: "Indiranagar, Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    status: "Pending",
    portalAccess: "Not Shared",
    totalArea: 12000,
    totalEmployeeCount: 180,
    safetyEquipments: "Fire Extinguishers, Smoke Detectors, Fire Alarms, Emergency Exits",
    groupOfCompanies: "Healthcare Services Network",
    branchLocations: "Bangalore, Mysore, Mangalore",
    remarks: "Medical facility requiring special safety protocols",
    contactPerson1Name: "Dr. Sunita Rao",
    contactPerson1Designation: "Administrator",
    contactPerson1Mobile: "+91 98765 77777",
    contactPerson1Email: "sunita@healthcare.com",
    contactPerson2Name: "Vijay Kumar",
    contactPerson2Designation: "Facilities Manager",
    contactPerson2Mobile: "+91 98765 88888",
    contactPerson2Email: "vijay@healthcare.com",
    gpsLocation: "12.9352° N, 77.6245° E",
    address: "23, Hospital Road, Koramangala 5th Block",
    area: "Koramangala",
    district: "Bangalore Urban",
    pinCode: "560095",
    country: "India",
    gst: "29DDDDD3333D4Z8",
    gstCompanyName: "Healthcare Services Private Limited",
  },
  {
    id: "CUST005",
    auditorName: "Robert Wilson",
    auditorMobile: "+91 54321 09876",
    auditorEmail: "robert.wilson@safetymatters.com",
    customerName: "Education Institute",
    industryType: "Education",
    branchLocation: "Jayanagar, Bangalore",
    headOfficeLocation: "BTM Layout, Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    status: "Verified",
    portalAccess: "Shared",
    totalArea: 30000,
    totalEmployeeCount: 350,
    safetyEquipments: "Fire Extinguishers, Fire Alarms, Emergency Exits, Assembly Points",
    groupOfCompanies: "Education Institute Group",
    branchLocations: "Bangalore, Mysore, Hubli",
    remarks: "Educational institution with multiple buildings",
    contactPerson1Name: "Prof. Anand Mehta",
    contactPerson1Designation: "Principal",
    contactPerson1Mobile: "+91 98765 99999",
    contactPerson1Email: "anand@education.com",
    contactPerson2Name: "Meera Iyer",
    contactPerson2Designation: "Admin Officer",
    contactPerson2Mobile: "+91 98765 00000",
    contactPerson2Email: "meera@education.com",
    gpsLocation: "12.9250° N, 77.5937° E",
    address: "456, Main Road, Jayanagar 4th Block",
    area: "Jayanagar",
    district: "Bangalore Urban",
    pinCode: "560011",
    country: "India",
    gst: "29EEEEE4444E5Z9",
    gstCompanyName: "Education Institute",
  },
  {
    id: "CUST006",
    auditorName: "Lisa Anderson",
    auditorMobile: "+91 43210 98765",
    auditorEmail: "lisa.anderson@safetymatters.com",
    customerName: "Logistics Services Ltd",
    industryType: "Logistics",
    branchLocation: "Yeshwanthpur, Bangalore",
    headOfficeLocation: "Hebbal, Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    status: "Verified",
    portalAccess: "Shared",
    totalArea: 20000,
    totalEmployeeCount: 300,
    safetyEquipments: "Fire Extinguishers, Fire Alarms, Sprinkler Systems",
    groupOfCompanies: "Logistics Services Group",
    branchLocations: "Bangalore, Hyderabad, Chennai",
    remarks: "Warehouse facility with proper safety measures",
    contactPerson1Name: "Ramesh Gupta",
    contactPerson1Designation: "Warehouse Manager",
    contactPerson1Mobile: "+91 98765 12121",
    contactPerson1Email: "ramesh@logistics.com",
    contactPerson2Name: "Anita Desai",
    contactPerson2Designation: "Safety Coordinator",
    contactPerson2Mobile: "+91 98765 23232",
    contactPerson2Email: "anita@logistics.com",
    gpsLocation: "13.0280° N, 77.5619° E",
    address: "Plot 89, Industrial Estate, Yeshwanthpur",
    area: "Yeshwanthpur",
    district: "Bangalore Urban",
    pinCode: "560022",
    country: "India",
    gst: "29FFFFF5555F6Z0",
    gstCompanyName: "Logistics Services Limited",
  },
  {
    id: "CUST007",
    auditorName: "David Martinez",
    auditorMobile: "+91 32109 87654",
    auditorEmail: "david.martinez@safetymatters.com",
    customerName: "Financial Services Corp",
    industryType: "Finance",
    branchLocation: "Cunningham Road, Bangalore",
    headOfficeLocation: "MG Road, Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    status: "Pending",
    portalAccess: "Not Shared",
    totalArea: 10000,
    totalEmployeeCount: 200,
    safetyEquipments: "Fire Extinguishers, Smoke Detectors, Emergency Exits",
    groupOfCompanies: "Financial Services Group",
    branchLocations: "Bangalore, Mumbai, Delhi",
    remarks: "Office space requiring safety compliance",
    contactPerson1Name: "Arun Kumar",
    contactPerson1Designation: "Facility Manager",
    contactPerson1Mobile: "+91 98765 34343",
    contactPerson1Email: "arun@financial.com",
    contactPerson2Name: "Deepa Nair",
    contactPerson2Designation: "HR Manager",
    contactPerson2Mobile: "+91 98765 45454",
    contactPerson2Email: "deepa@financial.com",
    gpsLocation: "12.9716° N, 77.5946° E",
    address: "Tower B, 5th Floor, Cunningham Road",
    area: "Cunningham Road",
    district: "Bangalore Urban",
    pinCode: "560052",
    country: "India",
    gst: "29GGGGGG6666G7Z1",
    gstCompanyName: "Financial Services Corporation",
  },
  {
    id: "CUST008",
    auditorName: "Jennifer Taylor",
    auditorMobile: "+91 21098 76543",
    auditorEmail: "jennifer.taylor@safetymatters.com",
    customerName: "Hospitality Services Pvt Ltd",
    industryType: "Hospitality",
    branchLocation: "Residency Road, Bangalore",
    headOfficeLocation: "Richmond Road, Bangalore",
    state: "Karnataka",
    city: "Bangalore",
    status: "Verified",
    portalAccess: "Shared",
    totalArea: 18000,
    totalEmployeeCount: 280,
    safetyEquipments: "Fire Extinguishers, Fire Alarms, Emergency Exits, Sprinklers",
    groupOfCompanies: "Hospitality Services Chain",
    branchLocations: "Bangalore, Goa, Kerala",
    remarks: "Hotel property with comprehensive safety systems",
    contactPerson1Name: "Suresh Reddy",
    contactPerson1Designation: "General Manager",
    contactPerson1Mobile: "+91 98765 56565",
    contactPerson1Email: "suresh@hospitality.com",
    contactPerson2Name: "Lakshmi Iyer",
    contactPerson2Designation: "Safety Manager",
    contactPerson2Mobile: "+91 98765 67676",
    contactPerson2Email: "lakshmi@hospitality.com",
    gpsLocation: "12.9762° N, 77.6033° E",
    address: "123, Residency Road",
    area: "Residency Road",
    district: "Bangalore Urban",
    pinCode: "560025",
    country: "India",
    gst: "29HHHHHH7777H8Z2",
    gstCompanyName: "Hospitality Services Private Limited",
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers)
  const [searchQuery, setSearchQuery] = useState("")
  const [industryTypeFilter, setIndustryTypeFilter] = useState<string[]>([])
  const [branchLocationFilter, setBranchLocationFilter] = useState<string[]>([])
  const [headOfficeLocationFilter, setHeadOfficeLocationFilter] = useState<string[]>([])
  const [stateFilter, setStateFilter] = useState<string[]>([])
  const [cityFilter, setCityFilter] = useState<string[]>([])

  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    } else {
      localStorage.setItem("customers", JSON.stringify(dummyCustomers))
    }
  }, [])

  const handleExport = () => {
    console.log("Exporting customers...")
  }

  const summaryCards = [
    {
      title: "Total Customers",
      value: customers.length,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Verified Customers",
      value: customers.filter((c) => c.status === "Verified").length,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Pending Verification",
      value: customers.filter((c) => c.status === "Pending").length,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      title: "Portal Access Shared",
      value: customers.filter((c) => c.portalAccess === "Shared").length,
      icon: Share2,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage customer profiles and information</p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Customers
          </Button>
        </div>

        <SummaryCards cards={summaryCards} />

        <CustomerFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          industryTypeFilter={industryTypeFilter}
          onIndustryTypeChange={setIndustryTypeFilter}
          branchLocationFilter={branchLocationFilter}
          onBranchLocationChange={setBranchLocationFilter}
          headOfficeLocationFilter={headOfficeLocationFilter}
          onHeadOfficeLocationChange={setHeadOfficeLocationFilter}
          stateFilter={stateFilter}
          onStateChange={setStateFilter}
          cityFilter={cityFilter}
          onCityChange={setCityFilter}
        />

        <CustomerTable
          customers={customers}
          setCustomers={setCustomers}
          searchQuery={searchQuery}
          industryTypeFilter={industryTypeFilter}
          branchLocationFilter={branchLocationFilter}
          headOfficeLocationFilter={headOfficeLocationFilter}
          stateFilter={stateFilter}
          cityFilter={cityFilter}
        />
      </div>
    </DashboardLayout>
  )
}
