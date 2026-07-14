import { Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { EnquirySurveyItem } from "@/types/audit-enquiry"
import { useNavigate } from "react-router-dom"

interface ExtinguisherEnquiryTableProps {
  surveys: EnquirySurveyItem[]
  companyId: string
}

export function ExtinguisherEnquiryTable({ surveys, companyId }: ExtinguisherEnquiryTableProps) {
  const navigate = useNavigate()

  const handleViewEnquiry = (surveyId: string) => {
    navigate(`/audit-enquiry/${companyId}/enquiry/${surveyId}`)
  }

  const getVendorStatusBadge = (status: string) => {
    const statusConfig = {
      "Assigned to Vendor": { bg: "bg-blue-100", text: "text-blue-800" },
      "Enquiry Viewed": { bg: "bg-purple-100", text: "text-purple-800" },
      "Service Date Marked": { bg: "bg-yellow-100", text: "text-yellow-800" },
      "Service Done": { bg: "bg-green-100", text: "text-green-800" },
    }
    return statusConfig[status as keyof typeof statusConfig] || { bg: "bg-gray-100", text: "text-gray-800" }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946] hover:to-[#FF8C00]">
              <TableHead className="font-semibold text-white">Location No</TableHead>
              <TableHead className="font-semibold text-white">Floor</TableHead>
              <TableHead className="font-semibold text-white">Location</TableHead>
              <TableHead className="font-semibold text-white">Type & Capacity</TableHead>
              <TableHead className="font-semibold text-white">Brand</TableHead>
              <TableHead className="font-semibold text-white">Refill Due</TableHead>
              <TableHead className="font-semibold text-white">HPT Due</TableHead>
              <TableHead className="font-semibold text-white">Shelf Life</TableHead>
              <TableHead className="font-semibold text-white">Product Image</TableHead>
              <TableHead className="font-semibold text-white">Enquiry Details</TableHead>
              <TableHead className="font-semibold text-white">Service Expected Date</TableHead>
              <TableHead className="font-semibold text-white">Service Done On</TableHead>
              <TableHead className="font-semibold text-white">Vendor Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                  No surveys found
                </TableCell>
              </TableRow>
            ) : (
              surveys.map((survey) => {
                const statusStyle = getVendorStatusBadge(survey.status)
                return (
                  <TableRow key={survey.id} className="hover:bg-gray-50">
                    <TableCell>{survey.customerLocationNo}</TableCell>
                    <TableCell>{survey.floorDetails}</TableCell>
                    <TableCell>{survey.locationDetails}</TableCell>
                    <TableCell>
                      {survey.extinguisherType} - {survey.capacity}
                    </TableCell>
                    <TableCell>{survey.brand}</TableCell>
                    <TableCell>{survey.refillDueDate}</TableCell>
                    <TableCell>{survey.hptDueDate}</TableCell>
                    <TableCell>{survey.shelfLifeExpiry}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleViewEnquiry(survey.id)}
                        className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d32f3c] hover:to-[#f57c00] text-white"
                      >
                        View Enquiry
                      </Button>
                    </TableCell>
                    <TableCell>
                      {survey.serviceExpectedDate ? (
                        <span className="text-sm">{survey.serviceExpectedDate}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {survey.serviceDoneDate ? (
                        <span className="text-sm">{survey.serviceDoneDate}</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${statusStyle.bg} ${statusStyle.text} hover:${statusStyle.bg}`}
                      >
                        {survey.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
