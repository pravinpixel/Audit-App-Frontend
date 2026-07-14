import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AuditAssignmentStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Status</CardTitle>
        <CardDescription>Audit assignment distribution and status tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-[400px] text-gray-500">
          Assignment status content coming soon...
        </div>
      </CardContent>
    </Card>
  )
}
