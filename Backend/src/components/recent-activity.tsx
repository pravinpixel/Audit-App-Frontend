import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      type: "success",
      title: "Profile verified for John Smith",
      time: "2 minutes ago",
      user: "Admin User",
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      type: "info",
      title: "Extinguisher form approved",
      time: "15 minutes ago",
      user: "Admin User",
      icon: CheckCircle2,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      type: "warning",
      title: "Service marked complete for Tech Solutions",
      time: "1 hour ago",
      user: "Vendor Team",
      icon: Clock,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      type: "error",
      title: "Profile rejected - incomplete documents",
      time: "2 hours ago",
      user: "Admin User",
      icon: XCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      type: "success",
      title: "Customer profile verified",
      time: "3 hours ago",
      user: "Admin User",
      icon: CheckCircle2,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      type: "info",
      title: "Training form approved for Healthcare Plus",
      time: "4 hours ago",
      user: "Admin User",
      icon: CheckCircle2,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className={`${activity.bgColor} p-2 rounded-full`}>
                <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.time}
                  <span className="text-gray-400 mx-2">•</span>
                  by {activity.user}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
