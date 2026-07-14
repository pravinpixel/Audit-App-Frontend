import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, FileText, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AuditFilters } from "@/components/audit-filters"
import { AuditTable } from "@/components/audit-table"
import { SummaryCards } from "@/components/summary-cards"
import type { AuditCompany } from "@/types/audit"

export default function AuditsPage() {
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

    fetchAudits()
  }, [navigate])

  const fetchAudits = async () => {
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
      },
    ]
    setAudits(mockAudits)
    setFilteredAudits(mockAudits)
  }

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
    navigate(`/audits/${auditId}`)
  }

  const summaryCards = [
    {
      title: "Total Audits",
      value: filteredAudits.length,
      icon: FileText,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Pending Approvals",
      value: filteredAudits.reduce((sum, audit) => sum + audit.approvalsPending, 0),
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      title: "Companies with Pending",
      value: filteredAudits.filter((a) => a.approvalsPending > 0).length,
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
    },
    {
      title: "Completed Audits",
      value: filteredAudits.filter((a) => a.approvalsPending === 0).length,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audits Data</h1>
            <p className="text-sm text-gray-600 mt-1">View and manage audit data for all companies</p>
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

        <AuditTable audits={filteredAudits} onView={handleView} />
      </div>
    </DashboardLayout>
  )
}
