import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Customer } from "@/types/customer"
import { useToast } from "@/hooks/use-toast"

export default function EditCustomerPage() {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const listPath = location.pathname.split("/").slice(0, -1).join("/") || "/customers"
  const isDataReviewCustomerData = location.pathname.startsWith("/data-review/customer-data")
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(0)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState<Partial<Customer>>({})

  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      const customers: Customer[] = JSON.parse(storedCustomers)
      const found = customers.find((c) => c.id === params.id)
      if (found) {
        setCustomer(found)
        setFormData(found)
      }
    }
  }, [params.id])

  const handleInputChange = (field: keyof Customer, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVerifyNext = () => {
    if (activeTab < 2) {
      setActiveTab(activeTab + 1)
      toast({
        title: "Tab Verified",
        description: "Moving to the next tab.",
      })
    }
  }

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1)
    }
  }

  const handleVerifySubmit = () => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      const customers: Customer[] = JSON.parse(storedCustomers)
      const updatedCustomers = customers.map((c) =>
        c.id === params.id ? { ...c, ...formData, status: "Verified" as const } : c,
      )
      localStorage.setItem("customers", JSON.stringify(updatedCustomers))

      toast({
        title: "Customer Verified",
        description: "The customer profile has been successfully verified.",
      })

      navigate(listPath)
    }
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  const tabs = ["Customer Information", "Contact Details", "Address & Other Details"]

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-[#E63946] hover:bg-[#E63946]/10"
          onClick={() => navigate(listPath)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{customer.customerName}</h1>
          <p className="text-sm text-gray-600">Customer ID: {customer.id}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "flex-1 px-6 py-3 text-sm font-medium transition-colors",
                    activeTab === index
                      ? "text-[#E63946] border-b-2 border-[#E63946] bg-[#E63946]/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName || ""}
                      onChange={(e) => handleInputChange("customerName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Input
                      id="industryType"
                      value={formData.industryType || ""}
                      onChange={(e) => handleInputChange("industryType", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalArea">Total Area (in Sq. Ft.)</Label>
                    <Input
                      id="totalArea"
                      type="number"
                      value={formData.totalArea || ""}
                      onChange={(e) => handleInputChange("totalArea", Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalEmployeeCount">Total Employee Count</Label>
                    <Input
                      id="totalEmployeeCount"
                      type="number"
                      value={formData.totalEmployeeCount || ""}
                      onChange={(e) => handleInputChange("totalEmployeeCount", Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="safetyEquipments">What are all the safety equipments available?</Label>
                  <Textarea
                    id="safetyEquipments"
                    value={formData.safetyEquipments || ""}
                    onChange={(e) => handleInputChange("safetyEquipments", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupOfCompanies">Group of Companies</Label>
                    <Input
                      id="groupOfCompanies"
                      value={formData.groupOfCompanies || ""}
                      onChange={(e) => handleInputChange("groupOfCompanies", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="branchLocations">Branch Locations</Label>
                    <Input
                      id="branchLocations"
                      value={formData.branchLocations || ""}
                      onChange={(e) => handleInputChange("branchLocations", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headOfficeLocation">Head Office Location</Label>
                    <Input
                      id="headOfficeLocation"
                      value={formData.headOfficeLocation || ""}
                      onChange={(e) => handleInputChange("headOfficeLocation", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks || ""}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Person - 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPerson1Name">Contact Person</Label>
                      <Input
                        id="contactPerson1Name"
                        value={formData.contactPerson1Name || ""}
                        onChange={(e) => handleInputChange("contactPerson1Name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson1Designation">Designation</Label>
                      <Input
                        id="contactPerson1Designation"
                        value={formData.contactPerson1Designation || ""}
                        onChange={(e) => handleInputChange("contactPerson1Designation", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson1Mobile">Mobile No</Label>
                      <Input
                        id="contactPerson1Mobile"
                        value={formData.contactPerson1Mobile || ""}
                        onChange={(e) => handleInputChange("contactPerson1Mobile", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson1Email">Email Address</Label>
                      <Input
                        id="contactPerson1Email"
                        type="email"
                        value={formData.contactPerson1Email || ""}
                        onChange={(e) => handleInputChange("contactPerson1Email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Person - 2</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPerson2Name">Contact Person</Label>
                      <Input
                        id="contactPerson2Name"
                        value={formData.contactPerson2Name || ""}
                        onChange={(e) => handleInputChange("contactPerson2Name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson2Designation">Designation</Label>
                      <Input
                        id="contactPerson2Designation"
                        value={formData.contactPerson2Designation || ""}
                        onChange={(e) => handleInputChange("contactPerson2Designation", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson2Mobile">Mobile No</Label>
                      <Input
                        id="contactPerson2Mobile"
                        value={formData.contactPerson2Mobile || ""}
                        onChange={(e) => handleInputChange("contactPerson2Mobile", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson2Email">Email Address</Label>
                      <Input
                        id="contactPerson2Email"
                        type="email"
                        value={formData.contactPerson2Email || ""}
                        onChange={(e) => handleInputChange("contactPerson2Email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gpsLocation">GPS Location</Label>
                    <Input
                      id="gpsLocation"
                      value={formData.gpsLocation || ""}
                      onChange={(e) => handleInputChange("gpsLocation", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      value={formData.area || ""}
                      onChange={(e) => handleInputChange("area", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ""}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state || ""}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ""}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={formData.district || ""}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pinCode">Pin Code</Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode || ""}
                      onChange={(e) => handleInputChange("pinCode", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country || ""}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gst">GST</Label>
                    <Input
                      id="gst"
                      value={formData.gst || ""}
                      onChange={(e) => handleInputChange("gst", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gstCompanyName">GST Company Name</Label>
                    <Input
                      id="gstCompanyName"
                      value={formData.gstCompanyName || ""}
                      onChange={(e) => handleInputChange("gstCompanyName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
            <div>
              {activeTab > 0 && (
                <Button variant="outline" onClick={handlePrevious} className="border-gray-300 bg-transparent">
                  Previous
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeTab < 2 ? (
                <Button className="bg-[#E63946] hover:bg-[#c62e3a] text-white" onClick={handleVerifyNext}>
                  {isDataReviewCustomerData ? "Save & Next" : "Next"}
                </Button>
              ) : (
                <Button className="bg-[#E63946] hover:bg-[#c62e3a] text-white" onClick={handleVerifySubmit}>
                  {isDataReviewCustomerData ? "Verify & Approve Profile" : "Save"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
