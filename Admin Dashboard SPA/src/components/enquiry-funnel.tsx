import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function EnquiryFunnel() {
  const funnelData = [
    { stage: "New Enquiries", count: 340, color: "#E63946" },
    { stage: "Viewed", count: 265, color: "#FF8C00" },
    { stage: "Service Marked", count: 180, color: "#FFD700" },
    { stage: "Completed", count: 165, color: "#4ECDC4" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enquiry Progress Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
