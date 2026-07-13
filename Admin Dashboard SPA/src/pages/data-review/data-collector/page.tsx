import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ThirdPartyTable } from "@/components/third-party-table"
import { SummaryCards } from "@/components/summary-cards"
import { Clock } from "lucide-react"
import type { ThirdPartyAuditor } from "@/types/third-party"
import { dummyAuditors } from "@/lib/third-party-data"

export default function DataReviewDataCollectorPage() {
  const [auditors, setAuditors] = useState<ThirdPartyAuditor[]>(dummyAuditors)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const storedAuditors = localStorage.getItem("thirdPartyAuditors")
    const parsed = storedAuditors ? JSON.parse(storedAuditors) : []
    if (Array.isArray(parsed) && parsed.length > 0) {
      setAuditors(parsed)
    } else {
      localStorage.setItem("thirdPartyAuditors", JSON.stringify(dummyAuditors))
      setAuditors(dummyAuditors)
    }
  }, [])

  const pendingCount = auditors.filter((a) => a.profileStatus === "Pending").length

  const summaryCards = [
    {
      title: "Pending Data Collector Reviews",
      value: pendingCount,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Review - Data Collector</h1>
          <p className="text-sm text-gray-600 mt-1">Review data collector profiles pending verification</p>
        </div>

        <SummaryCards cards={summaryCards} />

        <ThirdPartyTable
          auditors={auditors}
          setAuditors={setAuditors}
          searchQuery={searchQuery}
          profileStatusFilter={["Pending"]}
        />
      </div>
    </DashboardLayout>
  )
}
