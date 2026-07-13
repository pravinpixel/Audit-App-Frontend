import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  UserCheck,
  Building2,
  FileText,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

export function DashboardKPIs() {
  const kpis = [
    {
      title: "Total Employees",
      value: "847",
      trend: { value: "12.5%", isPositive: true, label: "vs last period" },
      icon: Users,
      iconColor: "bg-blue-500",
      details: null,
    },
    {
      title: "Total Auditors",
      value: "156",
      trend: { value: "8.3%", isPositive: true, label: "vs last period" },
      icon: UserCheck,
      iconColor: "bg-green-500",
      details: "Active: 142 | Pending: 14",
    },
    {
      title: "Total Customers",
      value: "423",
      trend: { value: "3.2%", isPositive: false, label: "vs last period" },
      icon: Building2,
      iconColor: "bg-purple-500",
      details: "Verified: 398 | Pending: 25",
    },
    {
      title: "Audits Conducted",
      value: "2,847",
      trend: { value: "15.7%", isPositive: true, label: "vs last period" },
      icon: FileText,
      iconColor: "bg-orange-500",
      details: null,
    },
    {
      title: "Pending Approvals",
      value: "89",
      trend: { value: "5.4%", isPositive: false, label: "vs last period" },
      icon: ClipboardCheck,
      iconColor: "bg-amber-500",
      details: "Extinguisher: 52 | Training: 37",
    },
    {
      title: "Total Enquiries",
      value: "334",
      trend: { value: "11.2%", isPositive: true, label: "vs last period" },
      icon: MessageSquare,
      iconColor: "bg-indigo-500",
      details: "New: 45 | In Progress: 127 | Done: 162",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
            <div className={`${kpi.iconColor} p-3 rounded-xl`}>
              <kpi.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
            {kpi.details && <p className="text-xs text-gray-600 mt-2">{kpi.details}</p>}
            <div className="flex items-center mt-3">
              {kpi.trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${kpi.trend.isPositive ? "text-green-500" : "text-red-500"}`}>
                {kpi.trend.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">{kpi.trend.label}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
