import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Download, Plus, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AttachmentViewer } from "@/components/attachment-viewer"
import type { Vendor } from "@/types/vendor"

export default function EditVendorPage() {
  const navigate = useNavigate()
  const params = useParams()
  const vendorId = params.id as string
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [formData, setFormData] = useState<Vendor | null>(null)
  const [activeTab, setActiveTab] = useState("company")
  const [viewingAttachment, setViewingAttachment] = useState<{ url: string; type: string } | null>(null)

  useEffect(() => {
    const storedVendors = localStorage.getItem("vendors")
    if (storedVendors) {
      const vendors: Vendor[] = JSON.parse(storedVendors)
      const foundVendor = vendors.find((v) => v.id === vendorId)
      if (foundVendor) {
        setVendor(foundVendor)
        setFormData(foundVendor)
      }
    }
  }, [vendorId])

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading vendor data...</p>
        </div>
      </DashboardLayout>
    )
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleVerifyAndNext = () => {
    if (activeTab === "company") {
      setActiveTab("location")
      // toast({
      //   title: "Company details verified",
      //   description: "Moving to Location Information tab.",
      //   className: "bg-green-50 border-green-200",
      // })
    } else if (activeTab === "location") {
      setActiveTab("technical")
      // toast({
      //   title: "Location details verified",
      //   description: "Moving to Technical Capabilities tab.",
      //   className: "bg-green-50 border-green-200",
      // })
    } else if (activeTab === "technical") {
      setActiveTab("kyc")
      // toast({
      //   title: "Technical details verified",
      //   description: "Moving to KYC Documents tab.",
      //   className: "bg-green-50 border-green-200",
      // })
    } else if (activeTab === "kyc") {
      const updatedVendor = { ...formData, profileStatus: "Verified" as const }
      const storedVendors = localStorage.getItem("vendors")
      if (storedVendors) {
        const vendors = JSON.parse(storedVendors)
        const updatedVendors = vendors.map((v: Vendor) => (v.id === updatedVendor.id ? updatedVendor : v))
        localStorage.setItem("vendors", JSON.stringify(updatedVendors))
      }
      // toast({
      //   title: "Profile verified successfully",
      //   description: "The vendor profile has been verified and approved.",
      //   className: "bg-green-50 border-green-200",
      // })
      navigate("/vendor-registration")
    }
  }

  const handleReject = (remarks: string) => {
    const updatedVendor = { ...formData, profileStatus: "Rejected" as const }
    const storedVendors = localStorage.getItem("vendors")
    if (storedVendors) {
      const vendors = JSON.parse(storedVendors)
      const updatedVendors = vendors.map((v: Vendor) => (v.id === updatedVendor.id ? updatedVendor : v))
      localStorage.setItem("vendors", JSON.stringify(updatedVendors))
    }
    // toast({
    //   title: "Profile rejected",
    //   description: "The vendor has been notified of the rejection.",
    //   className: "bg-red-50 border-red-200",
    // })
    navigate("/vendor-registration")
  }

  const addBranchOffice = () => {
    const newBranch = {
      id: Date.now().toString(),
      address: "",
      city: "",
      state: "",
      pinCode: "",
    }
    handleInputChange("branchOffices", [...formData.branchOffices, newBranch])
  }

  const removeBranchOffice = (id: string) => {
    handleInputChange(
      "branchOffices",
      formData.branchOffices.filter((b) => b.id !== id),
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="hover:bg-[#E63946]/10 hover:text-[#E63946]"
          onClick={() => navigate("/vendor-registration")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendor Registration
        </Button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Vendor Profile</h1>
            <p className="text-gray-600 mt-1">{formData.companyName}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 mb-6">
              <TabsTrigger value="company" className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white">
                Company Info
              </TabsTrigger>
              <TabsTrigger value="location" className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white">
                Location
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white"
              >
                Technical
              </TabsTrigger>
              <TabsTrigger value="kyc" className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white">
                KYC Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="legalBusinessName">Legal Business Name *</Label>
                  <Input
                    id="legalBusinessName"
                    value={formData.legalBusinessName}
                    onChange={(e) => handleInputChange("legalBusinessName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="typeOfCompany">Type of Company *</Label>
                  <Select value={formData.typeOfCompany} onValueChange={(v) => handleInputChange("typeOfCompany", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Private Limited">Private Limited</SelectItem>
                      <SelectItem value="Public Limited">Public Limited</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Proprietorship">Proprietorship</SelectItem>
                      <SelectItem value="LLP">LLP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="yearOfEstablishment">Year of Establishment *</Label>
                  <Input
                    id="yearOfEstablishment"
                    type="number"
                    value={formData.yearOfEstablishment}
                    onChange={(e) => handleInputChange("yearOfEstablishment", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="companyRegistrationNumber">Company Registration Number *</Label>
                  <Input
                    id="companyRegistrationNumber"
                    value={formData.companyRegistrationNumber}
                    onChange={(e) => handleInputChange("companyRegistrationNumber", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPersonName">Contact Person Name *</Label>
                  <Input
                    id="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPersonMobile">Contact Person Mobile *</Label>
                  <Input
                    id="contactPersonMobile"
                    value={formData.contactPersonMobile}
                    onChange={(e) => handleInputChange("contactPersonMobile", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPersonEmail">Contact Person Email *</Label>
                  <Input
                    id="contactPersonEmail"
                    type="email"
                    value={formData.contactPersonEmail}
                    onChange={(e) => handleInputChange("contactPersonEmail", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="headOfficeAddress">Head Office Address *</Label>
                  <Textarea
                    id="headOfficeAddress"
                    value={formData.headOfficeAddress}
                    onChange={(e) => handleInputChange("headOfficeAddress", e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pinCode">PIN Code *</Label>
                  <Input
                    id="pinCode"
                    value={formData.pinCode}
                    onChange={(e) => handleInputChange("pinCode", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gstNumber">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleInputChange("gstNumber", e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <Label>Address Proof</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(formData.addressProof.url, "_blank")}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Branch Offices</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBranchOffice}
                    className="text-[#E63946] border-[#E63946] hover:bg-[#E63946]/10 bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Branch
                  </Button>
                </div>
                {formData.branchOffices.map((branch, index) => (
                  <div key={branch.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Branch {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBranchOffice(branch.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Input placeholder="Address" value={branch.address} readOnly />
                      </div>
                      <Input placeholder="City" value={branch.city} readOnly />
                      <Input placeholder="State" value={branch.state} readOnly />
                      <Input placeholder="PIN Code" value={branch.pinCode} readOnly />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Fire Safety Services Offered *</Label>
                  <div className="mt-2 space-y-2">
                    {formData.fireSafetyServices.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="experienceInServicing">Experience in Servicing (Years) *</Label>
                  <Input
                    id="experienceInServicing"
                    type="number"
                    value={formData.experienceInServicing}
                    onChange={(e) => handleInputChange("experienceInServicing", Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="trainedTechniciansCount">Number of Trained Technicians *</Label>
                  <Input
                    id="trainedTechniciansCount"
                    type="number"
                    value={formData.trainedTechniciansCount}
                    onChange={(e) => handleInputChange("trainedTechniciansCount", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="certifications">Certifications *</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange("certifications", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="toolsEquipment">Tools & Equipment Available *</Label>
                  <Textarea
                    id="toolsEquipment"
                    value={formData.toolsEquipment}
                    onChange={(e) => handleInputChange("toolsEquipment", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Supporting Documents</Label>
                  <div className="space-y-2 mt-2">
                    {formData.supportingDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{doc.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.url, "_blank")}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a")
                            link.href = doc.url
                            link.download = doc.name
                            link.click()
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kyc" className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">PAN Card</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.panCard.url || "/placeholder.svg"}
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
                      onClick={() => setViewingAttachment({ url: formData.panCard.url, type: "image" })}
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
                        link.href = formData.panCard.url
                        link.download = formData.panCard.name
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">GST Certificate</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.gstCertificate.url || "/placeholder.svg"}
                      alt="GST Certificate"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.gstCertificate.url, type: "image" })}
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
                        link.href = formData.gstCertificate.url
                        link.download = formData.gstCertificate.name
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Company Registration Certificate</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.companyRegistrationCertificate.url || "/placeholder.svg"}
                      alt="Company Registration Certificate"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() =>
                        setViewingAttachment({ url: formData.companyRegistrationCertificate.url, type: "image" })
                      }
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
                        link.href = formData.companyRegistrationCertificate.url
                        link.download = formData.companyRegistrationCertificate.name
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">ID Proof</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.idProof.url || "/placeholder.svg"}
                      alt="ID Proof"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.idProof.url, type: "image" })}
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
                        link.href = formData.idProof.url
                        link.download = formData.idProof.name
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Bank Passbook</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.bankPassbook.url || "/placeholder.svg"}
                      alt="Bank Passbook"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.bankPassbook.url, type: "image" })}
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
                        link.href = formData.bankPassbook.url
                        link.download = formData.bankPassbook.name
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Shop Act License</Label>
                  <div className="border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={formData.shopActLicense.url || "/placeholder.svg"}
                      alt="Shop Act License"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => setViewingAttachment({ url: formData.shopActLicense.url, type: "image" })}
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
                        link.href = formData.shopActLicense.url
                        link.download = formData.shopActLicense.name
                        link.click()
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <Button variant="outline" className="text-red-600 bg-transparent" onClick={handleReject}>
              Reject
            </Button>
            <Button className="bg-[#E63946] hover:bg-[#c62e3a]" onClick={handleVerifyAndNext}>
              {activeTab === "kyc" ? "Verify & Submit" : "Verify & Next"}
            </Button>
          </div>
        </div>
      </div>

      {viewingAttachment && (
        <AttachmentViewer
          url={viewingAttachment.url}
          type={viewingAttachment.type}
          onClose={() => setViewingAttachment(null)}
        />
      )}
    </DashboardLayout>
  )
}
