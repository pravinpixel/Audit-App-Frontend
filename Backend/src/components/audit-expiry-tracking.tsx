import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ComplianceInsights } from "@/components/compliance-insights"

export function AuditExpiryTracking() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expiry Tracking</CardTitle>
        <CardDescription>Track refill due dates, HPT schedules, and shelf life expiry</CardDescription>
      </CardHeader>
      <CardContent>
        <ComplianceInsights />
      </CardContent>
    </Card>
  )
}
