import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Download, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuditFilters } from "@/components/audit-filters"
import { AuditTable } from "@/components/audit-table"
import { SummaryCards } from "@/components/summary-cards"
import type { AuditCompany } from "@/types/audit"

const DUMMY_ASSIGNEE_NAMES = ["Rahul Sharma", "Priya Menon", "Arjun Reddy", "Sneha Iyer", "Vikram Nair", "Anita Desai"]

interface StoredAssignment {
  assignmentStatus: "Self Assigned"
  assignedTo: string
}

export default function DataReviewSurveyDataPage() {
  const navigate = useNavigate()
  const [audits, setAudits] = useState<AuditCompany[]>([])
  const [filteredAudits, setFilteredAudits] = useState<AuditCompany[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [industryTypeFilter, setIndustryTypeFilter] = useState<string[]>([])
  const [branchLocationFilter, setBranchLocationFilter] = useState<string[]>([])
  const [headOfficeFilter, setHeadOfficeFilter] = useState<string[]>([])
  const [stateFilter, setStateFilter] = useState<string[]>([])
  const [cityFilter, setCityFilter] = useState<string[]>([])

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    const mockAudits: AuditCompany[] = [
      {
        id: "AUD001",
        companyName: "Tech Solutions Pvt Ltd",
        industryType: "IT Services",
        branchLocation: "Bangalore - Koramangala",
        headOfficeLocation: "Bangalore",
        state: "Karnataka",
        city: "Bangalore",
        approvalsPending: 3,
        assignmentStatus: "Self Assigned",
        assignedTo: "Rahul Sharma",
      },
      {
        id: "AUD002",
        companyName: "Manufacturing Corp",
        industryType: "Manufacturing",
        branchLocation: "Mumbai - Andheri",
        headOfficeLocation: "Mumbai",
        state: "Maharashtra",
        city: "Mumbai",
        approvalsPending: 5,
        assignmentStatus: "Not Assigned",
      },
      {
        id: "AUD003",
        companyName: "Retail Enterprises",
        industryType: "Retail",
        branchLocation: "Delhi - Connaught Place",
        headOfficeLocation: "New Delhi",
        state: "Delhi",
        city: "New Delhi",
        approvalsPending: 2,
        assignmentStatus: "Not Assigned",
      },
      {
        id: "AUD004",
        companyName: "Healthcare Systems",
        industryType: "Healthcare",
        branchLocation: "Chennai - T Nagar",
        headOfficeLocation: "Chennai",
        state: "Tamil Nadu",
        city: "Chennai",
        approvalsPending: 4,
        assignmentStatus: "Self Assigned",
        assignedTo: "Priya Menon",
      },
      {
        id: "AUD005",
        companyName: "Education Hub",
        industryType: "Education",
        branchLocation: "Pune - Hinjewadi",
        headOfficeLocation: "Pune",
        state: "Maharashtra",
        city: "Pune",
        approvalsPending: 1,
        assignmentStatus: "Not Assigned",
      },
    ]

    const storedAssignments = localStorage.getItem("surveyDataAssignments")
    const assignments: Record<string, StoredAssignment> = storedAssignments ? JSON.parse(storedAssignments) : {}
    const auditsWithAssignments = mockAudits.map((audit) =>
      assignments[audit.id] ? { ...audit, ...assignments[audit.id] } : audit,
    )

    const pendingAudits = auditsWithAssignments.filter((a) => a.approvalsPending > 0)
    setAudits(pendingAudits)
    setFilteredAudits(pendingAudits)
  }, [navigate])

  useEffect(() => {
    let filtered = [...audits]

    if (searchQuery) {
      filtered = filtered.filter(
        (audit) =>
          audit.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audit.industryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audit.branchLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audit.headOfficeLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audit.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          audit.city.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (industryTypeFilter.length > 0) {
      filtered = filtered.filter((audit) => industryTypeFilter.includes(audit.industryType))
    }

    if (branchLocationFilter.length > 0) {
      filtered = filtered.filter((audit) => branchLocationFilter.includes(audit.branchLocation))
    }

    if (headOfficeFilter.length > 0) {
      filtered = filtered.filter((audit) => headOfficeFilter.includes(audit.headOfficeLocation))
    }

    if (stateFilter.length > 0) {
      filtered = filtered.filter((audit) => stateFilter.includes(audit.state))
    }

    if (cityFilter.length > 0) {
      filtered = filtered.filter((audit) => cityFilter.includes(audit.city))
    }

    setFilteredAudits(filtered)
  }, [searchQuery, industryTypeFilter, branchLocationFilter, headOfficeFilter, stateFilter, cityFilter, audits])

  const handleView = (auditId: string) => {
    const customerId = auditId.replace("AUD", "CUST")
    navigate(`/data-review/customers/${customerId}`, { state: { auditId } })
  }

  const handleSelfAssign = (auditId: string, assignedTo: string) => {
    const storedAssignments = localStorage.getItem("surveyDataAssignments")
    const assignments: Record<string, StoredAssignment> = storedAssignments ? JSON.parse(storedAssignments) : {}
    assignments[auditId] = { assignmentStatus: "Self Assigned", assignedTo }
    localStorage.setItem("surveyDataAssignments", JSON.stringify(assignments))

    const updateAssignment = (list: AuditCompany[]) =>
      list.map((a) => (a.id === auditId ? { ...a, assignmentStatus: "Self Assigned" as const, assignedTo } : a))
    setAudits(updateAssignment)
    setFilteredAudits(updateAssignment)
  }

  const summaryCards = [
    {
      title: "Companies with Pending",
      value: filteredAudits.length,
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
    },
    {
      title: "Total Pending Approvals",
      value: filteredAudits.reduce((sum, audit) => sum + audit.approvalsPending, 0),
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Review - Survey Data</h1>
            <p className="text-sm text-gray-600 mt-1">Review survey records pending approval</p>
          </div>
          <Button className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <SummaryCards cards={summaryCards} />

        <AuditFilters
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

        <AuditTable
          audits={filteredAudits}
          onView={handleView}
          showAssignmentStatus
          onSelfAssign={handleSelfAssign}
          assigneeOptions={DUMMY_ASSIGNEE_NAMES}
        />
      </div>
    </DashboardLayout>
  )
}
