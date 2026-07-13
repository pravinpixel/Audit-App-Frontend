import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CustomerFilters } from "@/components/customer-filters"
import { ContactDataTable } from "@/components/contact-data-table"
import { SummaryCards } from "@/components/summary-cards"
import { Users, CheckCircle2, Clock, Contact } from "lucide-react"
import type { Customer } from "@/types/customer"

export default function ContactDataPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
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
    }
  }, [])

  const summaryCards = [
    {
      title: "Total Companies",
      value: customers.length,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      title: "Verified",
      value: customers.filter((c) => c.status === "Verified").length,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Pending",
      value: customers.filter((c) => c.status === "Pending").length,
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50",
    },
    {
      title: "With Contacts",
      value: customers.filter((c) => c.contactPerson1Name).length,
      icon: Contact,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Data</h1>
            <p className="text-sm text-gray-600 mt-1">Manage company contact details</p>
          </div>
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

        <ContactDataTable
          customers={customers}
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
