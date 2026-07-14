import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Clock, ClipboardList, Flame } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuditAssignmentFilters } from "@/components/audit-assignment-filters"
import { AuditAssignmentTable } from "@/components/audit-assignment-table"
import { SummaryCards } from "@/components/summary-cards"
import type { AuditAssignment } from "@/types/audit-assignment"

export default function DataReviewAuditAssignmentPage() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState<AuditAssignment[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<AuditAssignment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [buildingTypeFilter, setBuildingTypeFilter] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState<string[]>([])

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchAssignments()
  }, [navigate])

  const fetchAssignments = async () => {
    const mockAssignments: AuditAssignment[] = [
      {
        id: "ASSGN001",
        requestId: "CMP001",
        requestDate: "21/11/2024",
        companyName: "TechVista Office Complex",
        companyLocation: "Gurgaon, Haryana",
        contactName: "Anita Sharma",
        contactPhone: "+91 98765 43210",
        contactEmail: "anita.sharma@techvista.com",
        buildingType: "Office Complex",
        floors: 12,
        extinguisherCount: 68,
        assignmentStatus: "Assigned",
        salesPerson: "Rajesh Kumar",
      },
      {
        id: "ASSGN002",
        requestId: "CMP002",
        requestDate: "22/11/2024",
        companyName: "Green Valley Hospital",
        companyLocation: "Bangalore, Karnataka",
        contactName: "Dr. Priya Menon",
        contactPhone: "+91 98765 43211",
        contactEmail: "priya.menon@greenvalley.com",
        buildingType: "Hospital",
        floors: 8,
        extinguisherCount: 95,
        assignmentStatus: "Not Assigned",
      },
      {
        id: "ASSGN003",
        requestId: "CMP003",
        requestDate: "23/11/2024",
        companyName: "Sunrise Shopping Mall",
        companyLocation: "Mumbai, Maharashtra",
        contactName: "Amit Patel",
        contactPhone: "+91 98765 43212",
        contactEmail: "amit.patel@sunrise.com",
        buildingType: "Shopping Mall",
        floors: 5,
        extinguisherCount: 120,
        assignmentStatus: "Assigned",
        salesPerson: "Sunita Verma",
      },
      {
        id: "ASSGN004",
        requestId: "CMP004",
        requestDate: "24/11/2024",
        companyName: "Heritage Hotel & Resort",
        companyLocation: "Jaipur, Rajasthan",
        contactName: "Vikram Singh",
        contactPhone: "+91 98765 43213",
        contactEmail: "vikram.singh@heritage.com",
        buildingType: "Hotel",
        floors: 10,
        extinguisherCount: 85,
        assignmentStatus: "Not Assigned",
      },
      {
        id: "ASSGN005",
        requestId: "CMP005",
        requestDate: "25/11/2024",
        companyName: "Future Tech Park",
        companyLocation: "Hyderabad, Telangana",
        contactName: "Meera Reddy",
        contactPhone: "+91 98765 43214",
        contactEmail: "meera.reddy@futuretech.com",
        buildingType: "Tech Park",
        floors: 15,
        extinguisherCount: 145,
        assignmentStatus: "Assigned",
        salesPerson: "Karthik Rao",
      },
      {
        id: "ASSGN006",
        requestId: "CMP006",
        requestDate: "26/11/2024",
        companyName: "Prime Education Center",
        companyLocation: "Pune, Maharashtra",
        contactName: "Neha Deshmukh",
        contactPhone: "+91 98765 43215",
        contactEmail: "neha.deshmukh@primeedu.com",
        buildingType: "Educational Institute",
        floors: 6,
        extinguisherCount: 52,
        assignmentStatus: "Not Assigned",
      },
      {
        id: "ASSGN007",
        requestId: "CMP007",
        requestDate: "27/11/2024",
        companyName: "Metro Industrial Hub",
        companyLocation: "Chennai, Tamil Nadu",
        contactName: "Suresh Kumar",
        contactPhone: "+91 98765 43216",
        contactEmail: "suresh.kumar@metrohub.com",
        buildingType: "Industrial Complex",
        floors: 4,
        extinguisherCount: 78,
        assignmentStatus: "Assigned",
        salesPerson: "Lakshmi Iyer",
      },
      {
        id: "ASSGN008",
        requestId: "CMP008",
        requestDate: "28/11/2024",
        companyName: "City Center Apartments",
        companyLocation: "Kolkata, West Bengal",
        contactName: "Rohit Chatterjee",
        contactPhone: "+91 98765 43217",
        contactEmail: "rohit.chatterjee@citycenter.com",
        buildingType: "Residential Complex",
        floors: 20,
        extinguisherCount: 160,
        assignmentStatus: "Not Assigned",
      },
    ]
    // Only show pending (Not Assigned) assignments in Data Review
    const pendingAssignments = mockAssignments.filter((a) => a.assignmentStatus === "Not Assigned")
    setAssignments(pendingAssignments)
    setFilteredAssignments(pendingAssignments)
  }

  useEffect(() => {
    let filtered = [...assignments]

    if (searchQuery) {
      filtered = filtered.filter(
        (assignment) =>
          assignment.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.companyLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          assignment.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter((assignment) => statusFilter.includes(assignment.assignmentStatus))
    }

    if (buildingTypeFilter.length > 0) {
      filtered = filtered.filter((assignment) => buildingTypeFilter.includes(assignment.buildingType))
    }

    if (locationFilter.length > 0) {
      filtered = filtered.filter((assignment) => locationFilter.some((loc) => assignment.companyLocation.includes(loc)))
    }

    setFilteredAssignments(filtered)
  }, [searchQuery, statusFilter, buildingTypeFilter, locationFilter, assignments])

  const summaryCards = [
    {
      title: "Pending Assignments",
      value: filteredAssignments.length,
      icon: Clock,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
    },
    {
      title: "Total Requests",
      value: filteredAssignments.length,
      icon: ClipboardList,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Total Extinguishers",
      value: filteredAssignments.reduce((sum, a) => sum + a.extinguisherCount, 0),
      icon: Flame,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Assignment - Data Review</h1>
            <p className="text-sm text-gray-600 mt-1">Review audit assignment requests pending assignment</p>
          </div>
        </div>

        <SummaryCards cards={summaryCards} />

        <AuditAssignmentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          buildingTypeFilter={buildingTypeFilter}
          onBuildingTypeChange={setBuildingTypeFilter}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
        />

        <AuditAssignmentTable assignments={filteredAssignments} onUpdate={fetchAssignments} />
      </div>
    </DashboardLayout>
  )
}
