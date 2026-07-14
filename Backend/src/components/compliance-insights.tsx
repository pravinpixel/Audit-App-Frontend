import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

export function ComplianceInsights() {
  const insights = [
    {
      title: "Extinguisher Refill Due",
      data: [
        { name: "Overdue", value: 23, color: "#E63946" },
        { name: "Due Soon (30 days)", value: 45, color: "#FFA500" },
        { name: "Due Later (60 days)", value: 67, color: "#FFD700" },
        { name: "Safe", value: 289, color: "#4ECDC4" },
      ],
    },
    {
      title: "HPT Due",
      data: [
        { name: "Overdue", value: 12, color: "#E63946" },
        { name: "Due Soon (30 days)", value: 28, color: "#FFA500" },
        { name: "Due Later (60 days)", value: 42, color: "#FFD700" },
        { name: "Safe", value: 156, color: "#4ECDC4" },
      ],
    },
    {
      title: "Shelf Life Expiry",
      data: [
        { name: "Expired", value: 8, color: "#E63946" },
        { name: "Expiring Soon (30 days)", value: 19, color: "#FFA500" },
        { name: "Expiring Later (60 days)", value: 34, color: "#FFD700" },
        { name: "Safe", value: 198, color: "#4ECDC4" },
      ],
    },
    {
      title: "Training Programme Due",
      data: [
        { name: "Overdue", value: 15, color: "#E63946" },
        { name: "Due Soon (30 days)", value: 32, color: "#FFA500" },
        { name: "Due Later (60 days)", value: 48, color: "#FFD700" },
        { name: "Safe", value: 234, color: "#4ECDC4" },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Compliance Due & Expiry Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base font-semibold">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={insight.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {insight.data.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {insight.data.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
