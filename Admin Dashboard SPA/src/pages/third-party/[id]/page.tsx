import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Download } from "lucide-react"
import type { ThirdPartyAuditor } from "@/types/third-party"
import { useToast } from "@/hooks/use-toast"
import { RejectRemarksModal } from "@/components/reject-remarks-modal"
import { AttachmentViewer } from "@/components/attachment-viewer"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock data - In real app, fetch from API
const MOCK_AUDITORS: ThirdPartyAuditor[] = [
  {
    id: "TPR001",
    fullName: "Rajesh Kumar",
    mobile: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    residentialAddress: "123, MG Road, Bangalore",
    city: "Bangalore",
    pincode: "560001",
    highestQualification: "B.Tech in Fire Safety Engineering",
    specialization: "Industrial Fire Safety",
    yearsOfExperience: 8,
    certifications: [
      { id: "1", name: "Fire Safety Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "ISO Certification.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    accountHolderName: "Rajesh Kumar",
    accountNumber: "1234567890",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
    panNumber: "ABCDE1234F",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "123456789012",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Active",
  },
  {
    id: "TPR002",
    fullName: "Priya Sharma",
    mobile: "+91 98765 43211",
    email: "priya.sharma@example.com",
    residentialAddress: "456, Park Street, Mumbai",
    city: "Mumbai",
    pincode: "400001",
    highestQualification: "M.Sc in Safety Management",
    specialization: "Commercial Fire Safety",
    yearsOfExperience: 5,
    certifications: [{ id: "1", name: "Safety Management Certificate.pdf", url: "/placeholder.pdf", type: "pdf" }],
    accountHolderName: "Priya Sharma",
    accountNumber: "9876543210",
    bankName: "HDFC Bank",
    ifscCode: "HDFC0004567",
    panNumber: "FGHIJ5678K",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "987654321098",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Pending",
    appStatus: "Active",
  },
  {
    id: "TPR003",
    fullName: "Amit Patel",
    mobile: "+91 98765 43212",
    email: "amit.patel@example.com",
    residentialAddress: "789, Ring Road, Ahmedabad",
    city: "Ahmedabad",
    pincode: "380001",
    highestQualification: "Diploma in Fire Technology",
    specialization: "Residential Fire Safety",
    yearsOfExperience: 10,
    certifications: [
      { id: "1", name: "Fire Technology Diploma.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "Advanced Training Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    accountHolderName: "Amit Patel",
    accountNumber: "1122334455",
    bankName: "ICICI Bank",
    ifscCode: "ICIC0001122",
    panNumber: "KLMNO9012P",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "456789012345",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Inactive",
  },
  {
    id: "TPR004",
    fullName: "Sneha Reddy",
    mobile: "+91 98765 43213",
    email: "sneha.reddy@example.com",
    residentialAddress: "321, Jubilee Hills, Hyderabad",
    city: "Hyderabad",
    pincode: "500033",
    highestQualification: "B.Sc in Industrial Safety",
    specialization: "Chemical Fire Safety",
    yearsOfExperience: 6,
    certifications: [{ id: "1", name: "Industrial Safety Certificate.pdf", url: "/placeholder.pdf", type: "pdf" }],
    accountHolderName: "Sneha Reddy",
    accountNumber: "5544332211",
    bankName: "Axis Bank",
    ifscCode: "UTIB0005544",
    panNumber: "PQRST3456U",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "654321098765",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Pending",
    appStatus: "Active",
  },
  {
    id: "TPR005",
    fullName: "Vikram Singh",
    mobile: "+91 98765 43214",
    email: "vikram.singh@example.com",
    residentialAddress: "654, Civil Lines, Delhi",
    city: "Delhi",
    pincode: "110001",
    highestQualification: "M.Tech in Safety Engineering",
    specialization: "High-Rise Fire Safety",
    yearsOfExperience: 12,
    certifications: [
      { id: "1", name: "Safety Engineering Degree.pdf", url: "/placeholder.pdf", type: "pdf" },
      { id: "2", name: "High-Rise Safety Certificate.pdf", url: "/placeholder.pdf", type: "pdf" },
    ],
    accountHolderName: "Vikram Singh",
    accountNumber: "7788990011",
    bankName: "Punjab National Bank",
    ifscCode: "PUNB0077889",
    panNumber: "UVWXY6789Z",
    panImage: "/pan-card.jpg",
    aadhaarNumber: "789012345678",
    aadhaarImage: "/aadhaar-card.jpg",
    profileImage: "/profile-photo.jpg",
    videoUpload: "/placeholder.mp4",
    profileStatus: "Verified",
    appStatus: "Active",
  },
]

export default function EditThirdPartyPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { toast } = useToast()
  const [auditor, setAuditor] = useState<ThirdPartyAuditor | null>(null)
  const [formData, setFormData] = useState<ThirdPartyAuditor | null>(null)
  const [currentTab, setCurrentTab] = useState("personal")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [viewingAttachment, setViewingAttachment] = useState<{ url: string; type: string } | null>(null)

  useEffect(() => {
    console.log("[v0] Edit page mounted, params:", params)
    const foundAuditor = MOCK_AUDITORS.find((a) => a.id === params.id)
    console.log("[v0] Found auditor:", foundAuditor)
    if (foundAuditor) {
      setAuditor(foundAuditor)
      setFormData(foundAuditor)
    }
  }, [params]) // Updated dependency to params

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Loading auditor details...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleVerifyAndNext = () => {
    if (currentTab === "personal") {
      setCurrentTab("bank")
      toast({
        title: "Personal details verified",
        description: "Moving to Bank Information tab.",
        className: "bg-green-50 border-green-200",
      })
    } else if (currentTab === "bank") {
      setCurrentTab("kyc")
      toast({
        title: "Bank details verified",
        description: "Moving to KYC Details tab.",
        className: "bg-green-50 border-green-200",
      })
    } else if (currentTab === "kyc") {
      const updatedAuditor = { ...formData, profileStatus: "Verified" as const }
      // In real app, save to API
      toast({
        title: "Profile verified successfully",
        description: "The auditor profile has been verified and approved.",
        className: "bg-green-50 border-green-200",
      })
      navigate("/third-party")
    }
  }

  const handleReject = (remarks: string) => {
    const updatedAuditor: ThirdPartyAuditor = {
      ...formData,
      profileStatus: "Rejected" as const,
      rejectionRemarks: remarks,
      rejectionHistory: [
        ...(formData.rejectionHistory || []),
        {
          date: new Date().toISOString(),
          remarks,
          rejectedBy: "Admin User",
        },
      ],
    }
    const storedAuditors = localStorage.getItem("thirdPartyAuditors")
    if (storedAuditors) {
      const auditors = JSON.parse(storedAuditors)
      const updatedAuditors = auditors.map((a: ThirdPartyAuditor) => (a.id === updatedAuditor.id ? updatedAuditor : a))
      localStorage.setItem("thirdPartyAuditors", JSON.stringify(updatedAuditors))
    }

    toast({
      title: "Profile rejected successfully",
      description: "The auditor has been notified of the rejection.",
      className: "bg-red-50 border-red-200",
    })
    setShowRejectModal(false)
    navigate("/third-party")
  }

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  const validateAadhaar = (aadhaar: string) => {
    const aadhaarRegex = /^\d{12}$/
    return aadhaarRegex.test(aadhaar.replace(/\s/g, ""))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="hover:bg-[#E63946]/10 hover:text-[#E63946]"
          onClick={() => navigate("/third-party")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Third Party Registration
        </Button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Third Party Auditor</h1>
            <p className="text-gray-600 mt-1">{formData.fullName}</p>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 mb-6">
              <TabsTrigger value="personal" className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white">
                Personal & Academic
              </TabsTrigger>
              <TabsTrigger value="bank" className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white">
                Bank Information
              </TabsTrigger>
              <TabsTrigger value="kyc" className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white">
                KYC Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile No *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="qualification">Highest Qualification *</Label>
                  <Input
                    id="qualification"
                    value={formData.highestQualification}
                    onChange={(e) => handleInputChange("highestQualification", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization / Field *</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years Of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange("yearsOfExperience", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Residential Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.residentialAddress}
                    onChange={(e) => handleInputChange("residentialAddress", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Relevant Certifications</Label>
                  <div className="space-y-2 mt-2">
                    {formData.certifications.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{cert.name}</span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingAttachment({ url: cert.url, type: cert.type })}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button type="button" variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {formData.rejectionHistory && formData.rejectionHistory.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-base mb-4 text-gray-900">Rejected Reason</h4>
                  <div className="space-y-4">
                    {formData.rejectionHistory.map((history, index) => (
                      <div key={index} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{history.remarks}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-900 font-medium">
                            {new Date(history.date).toLocaleDateString()} at{" "}
                            {new Date(history.date).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Rejected by Admin</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bank" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountHolder">Account Holder Name *</Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolderName}
                    onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ifsc">IFSC Code *</Label>
                  <Input
                    id="ifsc"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange("ifscCode", e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              {formData.rejectionHistory && formData.rejectionHistory.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-base mb-4 text-gray-900">Rejected Reason</h4>
                  <div className="space-y-4">
                    {formData.rejectionHistory.map((history, index) => (
                      <div key={index} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{history.remarks}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-900 font-medium">
                            {new Date(history.date).toLocaleDateString()} at{" "}
                            {new Date(history.date).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Rejected by Admin</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="kyc" className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">PAN Card</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.panImage || "/placeholder.svg"}
                      alt="PAN Card"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.panImage, type: "image" })}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = formData.panImage
                        link.download = "pan-card.jpg"
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Aadhaar Card</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.aadhaarImage || "/placeholder.svg"}
                      alt="Aadhaar Card"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.aadhaarImage, type: "image" })}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = formData.aadhaarImage
                        link.download = "aadhaar-card.jpg"
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Profile Image</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.profileImage, type: "image" })}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = formData.profileImage
                        link.download = "profile-image.jpg"
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Video Upload</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <video src={formData.videoUpload || "/placeholder.svg"} className="w-full h-40 object-cover" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.videoUpload, type: "video" })}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = formData.videoUpload
                        link.download = "video-upload.mp4"
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              {formData.rejectionHistory && formData.rejectionHistory.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-base mb-4 text-gray-900">Rejected Reason</h4>
                  <div className="space-y-4">
                    {formData.rejectionHistory.map((history, index) => (
                      <div key={index} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{history.remarks}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-gray-900 font-medium">
                            {new Date(history.date).toLocaleDateString()} at{" "}
                            {new Date(history.date).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Rejected by Admin</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <Button variant="outline" className="text-red-600 bg-transparent" onClick={() => setShowRejectModal(true)}>
              Reject
            </Button>
            <Button className="bg-[#E63946] hover:bg-[#c62e3a]" onClick={handleVerifyAndNext}>
              {currentTab === "kyc" ? "Verify & Submit" : "Verify & Next"}
            </Button>
          </div>

          {formData.profileStatus === "Rejected" &&
            formData.rejectionHistory &&
            formData.rejectionHistory.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="space-y-3">
                  {formData.rejectionHistory.map((history, index) => (
                    <div key={index} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-2 text-red-900">Rejected Reason</h4>
                        <p className="text-sm text-gray-700">{history.remarks}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-500">
                          {new Date(history.date).toLocaleDateString()} at {new Date(history.date).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Rejected by {history.rejectedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {showRejectModal && (
        <RejectRemarksModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onSubmit={handleReject}
        />
      )}

      {viewingAttachment && (
        <AttachmentViewer
          isOpen={!!viewingAttachment}
          onClose={() => setViewingAttachment(null)}
          url={viewingAttachment.url}
          type={viewingAttachment.type}
        />
      )}
    </DashboardLayout>
  )
}
