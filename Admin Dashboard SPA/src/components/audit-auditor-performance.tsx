import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Trophy, Clock, CheckCircle2, TrendingUp } from "lucide-react"

export function AuditAuditorPerformance() {
  const auditorMetrics = [
    { name: "Rajesh Kumar", completed: 156, pending: 12, avgTime: 2.3, accuracy: 98.5, type: "Employee" },
    { name: "Priya Sharma", completed: 142, pending: 8, avgTime: 2.1, accuracy: 97.8, type: "Third-party" },
    { name: "Amit Patel", completed: 138, pending: 15, avgTime: 2.5, accuracy: 96.2, type: "Employee" },
    { name: "Sneha Reddy", completed: 125, pending: 10, avgTime: 2.4, accuracy: 97.1, type: "Third-party" },
    { name: "Vikram Singh", completed: 118, pending: 7, avgTime: 2.2, accuracy: 98.0, type: "Employee" },
    { name: "Anita Desai", completed: 112, pending: 9, avgTime: 2.6, accuracy: 95.8, type: "Third-party" },
  ]

  const monthlyPerformance = [
    { month: "Jul", employee: 285, thirdParty: 198 },
    { month: "Aug", employee: 310, thirdParty: 215 },
    { month: "Sep", employee: 295, thirdParty: 225 },
    { month: "Oct", employee: 340, thirdParty: 240 },
    { month: "Nov", employee: 365, thirdParty: 255 },
    { month: "Dec", employee: 380, thirdParty: 268 },
    { month: "Jan", employee: 355, thirdParty: 245 },
  ]

  const topAuditors = auditorMetrics.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topAuditors.map((auditor, index) => (
          <Card key={auditor.name}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                        : index === 1
                          ? "bg-gradient-to-r from-gray-300 to-gray-500"
                          : "bg-gradient-to-r from-orange-400 to-orange-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{auditor.name}</div>
                    <div className="text-xs text-gray-500">{auditor.type}</div>
                  </div>
                </div>
                <Trophy
                  className={`h-5 w-5 ${
                    index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-orange-500"
                  }`}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold">{auditor.completed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-semibold text-green-600">{auditor.accuracy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Time</span>
                  <span className="font-semibold">{auditor.avgTime}h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auditor Completion Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Auditor Completion Comparison</CardTitle>
            <CardDescription>Total audits completed by each auditor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={auditorMetrics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="pending" fill="#F59E0B" name="Pending" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Employee vs Third-party Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Employee vs Third-party Auditors</CardTitle>
            <CardDescription>Monthly performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="employee"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", r: 4 }}
                    name="Employee Auditors"
                  />
                  <Line
                    type="monotone"
                    dataKey="thirdParty"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: "#F59E0B", r: 4 }}
                    name="Third-party Auditors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Auditor Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Auditor Metrics</CardTitle>
          <CardDescription>Comprehensive performance overview of all auditors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Auditor Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Type</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Completed</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Pending</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Avg Time (hrs)</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {auditorMetrics.map((auditor, index) => (
                  <tr key={auditor.name} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index < 3
                              ? "bg-gradient-to-r from-[#E63946] to-[#FF8C00] text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{auditor.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          auditor.type === "Employee" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {auditor.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{auditor.completed}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-semibold text-orange-600">{auditor.pending}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-gray-700">{auditor.avgTime}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{auditor.accuracy}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
