import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Progress } from "@/components/ui/progress"

export function AuditStatesAnalysis() {
  const stateChartData = [
    { state: "Maharashtra", completed: 342, pending: 89, overdue: 56 },
    { state: "Delhi", completed: 298, pending: 34, overdue: 10 },
    { state: "Karnataka", completed: 245, pending: 41, overdue: 12 },
    { state: "Tamil Nadu", completed: 189, pending: 32, overdue: 13 },
    { state: "Gujarat", completed: 156, pending: 23, overdue: 10 },
    { state: "West Bengal", completed: 134, pending: 22, overdue: 11 },
    { state: "Rajasthan", completed: 118, pending: 19, overdue: 8 },
    { state: "Uttar Pradesh", completed: 105, pending: 18, overdue: 7 },
  ]

  const stateTableData = [
    { state: "Maharashtra", total: 487, completed: 342, pending: 89, overdue: 56, rate: 70 },
    { state: "Delhi", total: 342, completed: 298, pending: 34, overdue: 10, rate: 87 },
    { state: "Karnataka", total: 298, completed: 245, pending: 41, overdue: 12, rate: 82 },
    { state: "Tamil Nadu", total: 234, completed: 189, pending: 32, overdue: 13, rate: 81 },
    { state: "Gujarat", total: 189, completed: 156, pending: 23, overdue: 10, rate: 83 },
    { state: "West Bengal", total: 167, completed: 134, pending: 22, overdue: 11, rate: 80 },
    { state: "Rajasthan", total: 145, completed: 118, pending: 19, overdue: 8, rate: 81 },
    { state: "Uttar Pradesh", total: 134, completed: 105, pending: 18, overdue: 7, rate: 78 },
  ]

  return (
    <div className="space-y-6">
      {/* State-wise Audit Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>State-wise Audit Distribution</CardTitle>
          <CardDescription>Audit performance across different states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Pending" />
                <Bar dataKey="overdue" stackId="a" fill="#EF4444" name="Overdue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* State-wise Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">State</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Total Audits</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Completed</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Pending</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Overdue</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stateTableData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.state}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">{row.total}</td>
                    <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">{row.completed}</td>
                    <td className="px-6 py-4 text-sm text-right text-orange-600">{row.pending}</td>
                    <td className="px-6 py-4 text-sm text-right text-red-600">{row.overdue}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Progress value={row.rate} className="flex-1" />
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">{row.rate}%</span>
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
