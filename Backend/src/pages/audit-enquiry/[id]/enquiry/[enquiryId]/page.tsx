import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import type { EnquiryDetails, VendorAction } from "@/types/audit-enquiry"

export default function EnquiryDetailsPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [enquiryDetails, setEnquiryDetails] = useState<EnquiryDetails | null>(null)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchEnquiryDetails()
  }, [params.enquiryId, navigate])

  const fetchEnquiryDetails = () => {
    // Mock enquiry details with vendor actions timeline
    const mockVendorActions: VendorAction[] = [
      {
        action: "Enquiry viewed by customer",
        date: "2025-02-15",
        time: "10:30 AM",
      },
      {
        action: "Expected service date marked",
        date: "2025-02-16",
        time: "02:15 PM",
      },
      {
        action: "Service Done",
        date: "2025-02-20",
        time: "04:30 PM",
        remarks: "Extinguisher refilled and pressure tested. All safety checks completed successfully.",
      },
    ]

    const mockDetails: EnquiryDetails = {
      id: params.enquiryId as string,
      companyId: params.id as string,
      auditorName: "John Smith",
      auditorPhone: "+91 98765 43210",
      auditorEmail: "john.smith@safetymatters.com",
      customerLocationNo: "LOC-001",
      floorDetails: "Ground Floor",
      locationDetails: "Near Main Entrance",
      extinguisherType: "CO2",
      capacity: "5 kg",
      brand: "FireStop",
      refillDueDate: "2025-06-15",
      hptDueDate: "2025-12-15",
      shelfLifeExpiry: "2028-01-20",
      productImage: "/red-fire-extinguisher.png",
      status: "Service Done",
      customerName: "Tech Solutions Pvt Ltd",
      remarks: "Urgent service required. Extinguisher showing low pressure.",
      enquiryDate: "2025-02-15",
      enquiryTime: "10:30 AM",
      vendorActions: mockVendorActions,
    }

    setEnquiryDetails(mockDetails)
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

          <h1 className="text-2xl font-bold text-gray-900">Enquiry Details</h1>
          <p className="text-sm text-gray-600 mt-1">Detailed information about the enquiry and vendor actions</p>
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
              <p className="text-sm font-medium text-gray-500 mb-1">Remarks</p>
              <p className="text-base text-gray-900">{enquiryDetails.remarks}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Enquiry Created On</p>
              <p className="text-base text-gray-900">
                {enquiryDetails.enquiryDate} at {enquiryDetails.enquiryTime}
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
            <div className="space-y-6">
              {enquiryDetails.vendorActions.map((action, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        action.action === "Service Done" ? "bg-green-100" : "bg-blue-100"
                      }`}
                    >
                      {action.action === "Service Done" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    {index < enquiryDetails.vendorActions.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2" />
                    )}
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
