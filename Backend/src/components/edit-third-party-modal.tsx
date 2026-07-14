import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

interface EditThirdPartyModalProps {
  auditor: ThirdPartyAuditor
  onClose: () => void
  onUpdate: (auditor: ThirdPartyAuditor) => void
}

export function EditThirdPartyModal({ auditor, onClose, onUpdate }: EditThirdPartyModalProps) {
  const [formData, setFormData] = useState(auditor)
  const [currentTab, setCurrentTab] = useState("personal")
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [viewingAttachment, setViewingAttachment] = useState<{ url: string; type: string } | null>(null)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVerify = () => {
    const updatedAuditor = { ...formData, profileStatus: "Verified" as const }
    onUpdate(updatedAuditor)
    toast({
      title: "Profile verified successfully",
      description: "The auditor profile has been verified and approved.",
      className: "bg-green-50 border-green-200",
    })
    onClose()
  }

  const handleNext = () => {
    if (currentTab === "personal") {
      setCurrentTab("bank")
    } else if (currentTab === "bank") {
      setCurrentTab("kyc")
    }
  }

  const handlePrevious = () => {
    if (currentTab === "kyc") {
      setCurrentTab("bank")
    } else if (currentTab === "bank") {
      setCurrentTab("personal")
    }
  }

  const handleReject = (remarks: string) => {
    const updatedAuditor = {
      ...formData,
      profileStatus: "Pending" as const,
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
    onUpdate(updatedAuditor)
    toast({
      title: "Profile rejected successfully",
      description: "The auditor has been notified of the rejection.",
      className: "bg-red-50 border-red-200",
    })
    setShowRejectModal(false)
    onClose()
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
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Third Party Auditor - {auditor.fullName}</DialogTitle>
          </DialogHeader>

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger
                value="personal"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E63946] data-[state=active]:to-[#FF8C00] data-[state=active]:text-white"
              >
                Personal & Academic
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E63946] data-[state=active]:to-[#FF8C00] data-[state=active]:text-white"
              >
                Bank Information
              </TabsTrigger>
              <TabsTrigger
                value="kyc"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#E63946] data-[state=active]:to-[#FF8C00] data-[state=active]:text-white"
              >
                KYC Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
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

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  className="text-red-600 bg-transparent"
                  onClick={() => setShowRejectModal(true)}
                >
                  Reject
                </Button>
                <div className="flex gap-2">
                  <Button
                    className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white"
                    onClick={handleVerify}
                  >
                    Verify & Next
                  </Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4 mt-4">
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

              <div className="flex justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 bg-transparent"
                    onClick={() => setShowRejectModal(true)}
                  >
                    Reject
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white"
                    onClick={handleVerify}
                  >
                    Verify & Next
                  </Button>
                  <Button onClick={handleNext}>Next</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pan">PAN Number *</Label>
                  <Input
                    id="pan"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                    maxLength={10}
                    className={!validatePAN(formData.panNumber) && formData.panNumber ? "border-red-500" : ""}
                  />
                  {!validatePAN(formData.panNumber) && formData.panNumber && (
                    <p className="text-xs text-red-500 mt-1">Invalid PAN format (e.g., ABCDE1234F)</p>
                  )}
                </div>
                <div>
                  <Label>PAN Image</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingAttachment({ url: formData.panImage, type: "image" })}
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
                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                  <Input
                    id="aadhaar"
                    value={formData.aadhaarNumber}
                    onChange={(e) => handleInputChange("aadhaarNumber", e.target.value.replace(/\D/g, ""))}
                    maxLength={12}
                    className={
                      !validateAadhaar(formData.aadhaarNumber) && formData.aadhaarNumber ? "border-red-500" : ""
                    }
                  />
                  {!validateAadhaar(formData.aadhaarNumber) && formData.aadhaarNumber && (
                    <p className="text-xs text-red-500 mt-1">Invalid Aadhaar format (12 digits required)</p>
                  )}
                </div>
                <div>
                  <Label>Aadhaar Image</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingAttachment({ url: formData.aadhaarImage, type: "image" })}
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
                <div>
                  <Label>Profile Image Upload</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingAttachment({ url: formData.profileImage, type: "image" })}
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
                <div>
                  <Label>Video Upload</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingAttachment({ url: formData.videoUpload, type: "video" })}
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
              </div>

              {formData.rejectionHistory && formData.rejectionHistory.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
                  <h4 className="font-semibold text-sm mb-2">Rejection History</h4>
                  <div className="space-y-2">
                    {formData.rejectionHistory.map((history, index) => (
                      <div key={index} className="text-sm">
                        <p className="text-gray-600">
                          {new Date(history.date).toLocaleDateString()} - {history.rejectedBy}
                        </p>
                        <p className="text-gray-800">{history.remarks}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 bg-transparent"
                    onClick={() => setShowRejectModal(true)}
                  >
                    Reject
                  </Button>
                </div>
                <Button
                  className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white"
                  onClick={handleVerify}
                >
                  Verify & Submit
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showRejectModal && <RejectRemarksModal onClose={() => setShowRejectModal(false)} onSubmit={handleReject} />}

      {viewingAttachment && (
        <AttachmentViewer
          url={viewingAttachment.url}
          type={viewingAttachment.type}
          onClose={() => setViewingAttachment(null)}
        />
      )}
    </>
  )
}
