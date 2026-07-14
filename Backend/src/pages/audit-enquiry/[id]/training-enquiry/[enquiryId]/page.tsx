import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { VendorAction } from "@/types/audit-enquiry"

interface TrainingEnquiryDetails {
  id: string
  companyId: string
  auditorName: string
  auditorPhone: string
  auditorEmail: string
  trainingTitle: string
  trainingDueDate: string
  trainingGivenBy: string
  status: string
  customerName: string
  remarks: string
  enquiryDate: string
  enquiryTime: string
  serviceExpectedDate?: string
  serviceDoneDate?: string
  vendorActions: VendorAction[]
}

export default function TrainingEnquiryDetailsPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [enquiryDetails, setEnquiryDetails] = useState<TrainingEnquiryDetails | null>(null)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchEnquiryDetails()
  }, [params.enquiryId, navigate])

  const fetchEnquiryDetails = () => {
    // Mock training enquiry details based on enquiry ID
    const statusMap: Record<string, string> = {
      TRN001: "Enquiry Viewed",
      TRN002: "Service Done",
      TRN003: "Assigned to Vendor",
      TRN004: "Service Date Marked",
      TRN005: "Enquiry Viewed",
      TRN006: "Service Done",
      TRN007: "Service Date Marked",
      TRN008: "Service Done",
    }

    const status = statusMap[params.enquiryId as string] || "Assigned to Vendor"

    // Generate vendor actions based on status
    const getVendorActions = (currentStatus: string): VendorAction[] => {
      const baseAction: VendorAction = {
        action: "Enquiry viewed by customer",
        date: "2025-02-15",
        time: "10:30 AM",
      }

      if (currentStatus === "Assigned to Vendor") {
        return []
      }

      if (currentStatus === "Enquiry Viewed") {
        return [baseAction]
      }

      const serviceDateAction: VendorAction = {
        action: "Expected service date marked",
        date: "2025-02-16",
        time: "02:15 PM",
      }

      if (currentStatus === "Service Date Marked") {
        return [baseAction, serviceDateAction]
      }

      if (currentStatus === "Service Done") {
        return [
          baseAction,
          serviceDateAction,
          {
            action: "Service Done",
            date: "2025-02-20",
            time: "04:30 PM",
            remarks: "Training session completed successfully with all participants. Certificates issued.",
          },
        ]
      }

      return []
    }

    const mockDetails: TrainingEnquiryDetails = {
      id: params.enquiryId as string,
      companyId: params.id as string,
      auditorName: "Michael Chen",
      auditorPhone: "+91 76543 21098",
      auditorEmail: "michael.chen@safetymatters.com",
      trainingTitle: "Fire Safety Basics",
      trainingDueDate: "2025-03-20",
      trainingGivenBy: "Safety Matters Training Dept",
      status: status,
      customerName: "Tech Solutions Pvt Ltd",
      remarks: "Basic fire safety training required for 20 employees.",
      enquiryDate: "2025-02-15",
      enquiryTime: "10:30 AM",
      serviceExpectedDate: status !== "Assigned to Vendor" ? "2025-03-10" : undefined,
      serviceDoneDate: status === "Service Done" ? "2025-02-18" : undefined,
      vendorActions: getVendorActions(status),
    }

    setEnquiryDetails(mockDetails)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Service Done":
        return "text-green-600"
      case "Service Date Marked":
        return "text-yellow-600"
      case "Enquiry Viewed":
        return "text-purple-600"
      default:
        return "text-blue-600"
    }
  }

  if (!enquiryDetails) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/audit-enquiry/${params.id}`)}
            className="mb-4 -ml-2 hover:bg-[#88344C] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Enquiry List
          </Button>

          <h1 className="text-2xl font-bold text-gray-900">Training Enquiry Details</h1>
          <p className="text-sm text-gray-600 mt-1">
            Detailed information about the training enquiry and vendor actions
          </p>
        </div>

        {/* Customer Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Customer Name</p>
              <p className="text-lg font-semibold text-gray-900">{enquiryDetails.customerName}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Training Programme</p>
              <p className="text-lg font-semibold text-gray-900">{enquiryDetails.trainingTitle}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Remarks</p>
              <p className="text-base text-gray-900">{enquiryDetails.remarks}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Enquiry Created On</p>
              <p className="text-base text-gray-900">
                {enquiryDetails.enquiryDate} at {enquiryDetails.enquiryTime}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
              <p className={`text-base font-semibold ${getStatusColor(enquiryDetails.status)}`}>
                {enquiryDetails.status}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Actions Timeline Section */}
        <Card>
          <CardHeader>
            <CardTitle>Vendor Actions Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {enquiryDetails.vendorActions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No vendor actions recorded yet</p>
                <p className="text-sm mt-2">Waiting for vendor to view the enquiry</p>
              </div>
            ) : (
              <div className="space-y-0">
                {enquiryDetails.vendorActions.map((action, index) => {
                  const isCompleted = action.action === "Service Done"

                  return (
                    <div key={index} className="flex flex-col items-start">
                      {/* Timeline Item */}
                      <div className="flex items-start gap-4">
                        {/* Icon Circle */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted ? "bg-green-100" : "bg-blue-100"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                          ) : (
                            <Clock className="w-6 h-6 text-blue-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-2">
                          <p className="font-semibold text-gray-900">{action.action}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {action.date} at {action.time}
                          </p>
                          {action.remarks && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-sm font-medium text-gray-700 mb-1">Vendor Remarks:</p>
                              <p className="text-sm text-gray-600">{action.remarks}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dashed Connector Line */}
                      {index < enquiryDetails.vendorActions.length - 1 && (
                        <div className="ml-6 h-12 border-l-2 border-dashed border-gray-300" />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
