import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export function AuditOverview() {
  const statusData = [
    { name: "Completed", value: 1847, percentage: 68.5, color: "#10B981" },
    { name: "In Progress", value: 423, percentage: 15.7, color: "#3B82F6" },
    { name: "Pending", value: 298, percentage: 11.1, color: "#F59E0B" },
    { name: "Overdue", value: 126, percentage: 4.7, color: "#EF4444" },
  ]

  const trendData = [
    { month: "Jul", audits: 210, verified: 145 },
    { month: "Aug", audits: 235, verified: 178 },
    { month: "Sep", audits: 248, verified: 195 },
    { month: "Oct", audits: 280, verified: 235 },
    { month: "Nov", audits: 315, verified: 285 },
    { month: "Dec", audits: 350, verified: 325 },
    { month: "Jan", audits: 298, verified: 267 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Audit Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Status Breakdown</CardTitle>
          <CardDescription>Overall audit status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Pie Chart */}
            <div className="h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status List */}
            <div className="grid grid-cols-2 gap-4">
              {statusData.map((status) => (
                <div key={status.name} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-sm flex-shrink-0" style={{ backgroundColor: status.color }} />
                  <div>
                    <div className="text-sm font-medium">{status.name}</div>
                    <div className="text-lg font-bold">{status.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Audit Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Audit Trends</CardTitle>
          <CardDescription>Last 7 months audit activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="audits"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="verified"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
