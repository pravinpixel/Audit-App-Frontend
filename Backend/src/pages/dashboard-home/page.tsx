import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardKPIs } from "@/components/dashboard-kpis"
import { EnquiryFunnel } from "@/components/enquiry-funnel"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardHomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
    }
  }, [navigate])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Comprehensive overview of audits, verifications, and compliance</p>
        </div>

        {/* Dashboard 1 & 2: KPI Cards */}
        <DashboardKPIs />

        {/* Dashboard 5: Enquiry Progress Funnel */}
        <EnquiryFunnel />

        {/* Dashboard 6: Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  )
}
