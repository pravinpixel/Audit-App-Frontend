import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomerTable } from "@/components/customer-table"
import { SummaryCards } from "@/components/summary-cards"
import { Clock } from "lucide-react"
import type { Customer } from "@/types/customer"

export default function DataReviewCustomerDataPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      setCustomers(JSON.parse(storedCustomers))
    }
  }, [])

  const pendingCustomers = customers.filter((c) => c.status === "Pending")

  const summaryCards = [
    {
      title: "Pending Customer Reviews",
      value: pendingCustomers.length,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Review - Customer Data</h1>
          <p className="text-sm text-gray-600 mt-1">Review customer records pending verification</p>
        </div>

        <SummaryCards cards={summaryCards} />

        <CustomerTable
          customers={pendingCustomers}
          setCustomers={setCustomers}
          searchQuery={searchQuery}
          industryTypeFilter={[]}
          branchLocationFilter={[]}
          headOfficeLocationFilter={[]}
          stateFilter={[]}
          cityFilter={[]}
        />
      </div>
    </DashboardLayout>
  )
}
