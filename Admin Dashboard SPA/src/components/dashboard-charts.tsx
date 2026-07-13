import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function DashboardCharts() {
  const auditsOverTime = [
    { month: "Jan", audits: 198, verified: 156 },
    { month: "Feb", audits: 235, verified: 189 },
    { month: "Mar", audits: 256, verified: 210 },
    { month: "Apr", audits: 289, verified: 245 },
    { month: "May", audits: 312, verified: 267 },
    { month: "Jun", audits: 325, verified: 289 },
  ]

  const auditsByIndustry = [
    { industry: "Manufacturing", count: 567 },
    { industry: "Healthcare", count: 432 },
    { industry: "Education", count: 389 },
    { industry: "Retail", count: 345 },
    { industry: "Hospitality", count: 298 },
    { industry: "Tech", count: 234 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Audits Completed Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={auditsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="audits" stroke="#E63946" strokeWidth={2} name="Audits" />
              <Line type="monotone" dataKey="verified" stroke="#4ECDC4" strokeWidth={2} name="Verified" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audits by Industry Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={auditsByIndustry} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="industry" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#E63946" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
