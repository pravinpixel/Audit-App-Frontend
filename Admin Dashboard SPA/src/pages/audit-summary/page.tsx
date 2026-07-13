import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, Building2, Package, GraduationCap, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SummaryCards } from "@/components/summary-cards"
import { AuditOverview } from "@/components/audit-overview"
import { AuditStatesAnalysis } from "@/components/audit-states-analysis"
import { AuditExpiryTracking } from "@/components/audit-expiry-tracking"
import { AuditAuditorPerformance } from "@/components/audit-auditor-performance"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AuditCompany, ExtinguisherSurvey, TrainingSurvey } from "@/types/audit"

type TabType = "overview" | "states" | "expiry" | "auditor"

export default function AuditSummaryPage() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<AuditCompany[]>([])
  const [extinguisherSurveys, setExtinguisherSurveys] = useState<ExtinguisherSurvey[]>([])
  const [trainingSurveys, setTrainingSurveys] = useState<TrainingSurvey[]>([])
  const [filteredCompanies, setFilteredCompanies] = useState<AuditCompany[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [industryTypeFilter, setIndustryTypeFilter] = useState<string[]>([])
  const [stateFilter, setStateFilter] = useState<string[]>([])
  const [cityFilter, setCityFilter] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    const mockCompanies: AuditCompany[] = [
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
    ]

    const mockExtinguisherSurveys: ExtinguisherSurvey[] = [
      {
        id: "EXT001",
        companyId: "AUD001",
        auditorName: "Rajesh Kumar",
        auditorPhone: "+91 98765 43210",
        auditorEmail: "rajesh@safety.com",
        customerLocationNo: "LOC-101",
        floorDetails: "Ground Floor",
        locationDetails: "Near Reception",
        extinguisherType: "ABC Powder",
        capacity: "5 Kg",
        brand: "Ceasefire",
        refillDueDate: "2024-03-15",
        hptDueDate: "2024-06-20",
        shelfLifeExpiry: "2025-12-31",
        productImage: "/red-fire-extinguisher.png",
        status: "Pending",
      },
      {
        id: "EXT002",
        companyId: "AUD001",
        auditorName: "Rajesh Kumar",
        auditorPhone: "+91 98765 43210",
        auditorEmail: "rajesh@safety.com",
        customerLocationNo: "LOC-102",
        floorDetails: "First Floor",
        locationDetails: "Near Cafeteria",
        extinguisherType: "CO2",
        capacity: "4.5 Kg",
        brand: "Kanex",
        refillDueDate: "2024-04-10",
        hptDueDate: "2024-07-15",
        shelfLifeExpiry: "2026-01-20",
        productImage: "/red-fire-extinguisher.png",
        status: "Verified",
      },
      {
        id: "EXT003",
        companyId: "AUD002",
        auditorName: "Priya Sharma",
        auditorPhone: "+91 98765 43211",
        auditorEmail: "priya@safety.com",
        customerLocationNo: "LOC-201",
        floorDetails: "Ground Floor",
        locationDetails: "Factory Entrance",
        extinguisherType: "Foam",
        capacity: "9 Kg",
        brand: "Ceasefire",
        refillDueDate: "2024-02-28",
        hptDueDate: "2024-05-30",
        shelfLifeExpiry: "2025-11-15",
        productImage: "/red-fire-extinguisher.png",
        status: "Pending",
      },
    ]

    const mockTrainingSurveys: TrainingSurvey[] = [
      {
        id: "TRN001",
        companyId: "AUD001",
        auditorName: "Rajesh Kumar",
        auditorPhone: "+91 98765 43210",
        auditorEmail: "rajesh@safety.com",
        trainingTitle: "Fire Safety Awareness",
        trainingDueDate: "2024-03-01",
        trainingGivenBy: "Safety Matters Training Team",
        status: "Pending",
      },
      {
        id: "TRN002",
        companyId: "AUD002",
        auditorName: "Priya Sharma",
        auditorPhone: "+91 98765 43211",
        auditorEmail: "priya@safety.com",
        trainingTitle: "Emergency Response Protocol",
        trainingDueDate: "2024-04-15",
        trainingGivenBy: "Fire Department Officials",
        status: "Verified",
      },
    ]

    setCompanies(mockCompanies)
    setExtinguisherSurveys(mockExtinguisherSurveys)
    setTrainingSurveys(mockTrainingSurveys)
    setFilteredCompanies(mockCompanies)
  }

  useEffect(() => {
    let filtered = [...companies]

    if (searchQuery) {
      filtered = filtered.filter(
        (company) =>
          company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.industryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.city.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (industryTypeFilter.length > 0) {
      filtered = filtered.filter((company) => industryTypeFilter.includes(company.industryType))
    }

    if (stateFilter.length > 0) {
      filtered = filtered.filter((company) => stateFilter.includes(company.state))
    }

    if (cityFilter.length > 0) {
      filtered = filtered.filter((company) => cityFilter.includes(company.city))
    }

    setFilteredCompanies(filtered)
  }, [searchQuery, industryTypeFilter, stateFilter, cityFilter, companies])

  const totalExtinguishers = extinguisherSurveys.length
  const totalTrainings = trainingSurveys.length
  const verifiedExtinguishers = extinguisherSurveys.filter((e) => e.status === "Verified").length
  const verifiedTrainings = trainingSurveys.filter((t) => t.status === "Verified").length

  const summaryCards = [
    {
      title: "Total Audits",
      value: "2,694",
      subtitle: "12% from last month",
      trend: "up",
      icon: Building2,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
    {
      title: "Items Audited",
      value: "63,245",
      subtitle: "6% from last month",
      trend: "up",
      icon: Package,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
    },
    {
      title: "Active Auditors",
      value: "127",
      subtitle: "58 Employees, 69 Third-party",
      icon: GraduationCap,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      subtitle: "Above target (90%)",
      trend: "up",
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
  ]

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "states", label: "States Analysis" },
    { id: "expiry", label: "Expiry Tracking" },
    { id: "auditor", label: "Auditor Performance" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Summary</h1>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive overview of audit activities, performance, and analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <SummaryCards cards={summaryCards} />

        <div className="flex gap-2 border-b overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <AuditOverview />}
        {activeTab === "states" && <AuditStatesAnalysis />}
        {activeTab === "expiry" && <AuditExpiryTracking />}
        {activeTab === "auditor" && <AuditAuditorPerformance />}
      </div>
    </DashboardLayout>
  )
}
