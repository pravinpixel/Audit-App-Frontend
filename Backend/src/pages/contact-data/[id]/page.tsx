import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Building2, MapPin, User, Save, KeyRound, History } from "lucide-react"
import type { Customer } from "@/types/customer"

interface ProductAccess {
  enabled: boolean
  accessLevel: "Edit" | "View"
}

type ContactType = "Customer Administrator" | "Product Contact" | "Customer User"

interface ContactPerson {
  name?: string
  designation?: string
  mobile?: string
  email?: string
  contactType?: ContactType
  portalAccessEnabled?: boolean
  extinguisherAccess?: ProductAccess
  trainingAccess?: ProductAccess
}

interface ActivityLogEntry {
  id: string
  timestamp: string
  performedBy: string
  changes: { field: string; from: string; to: string }[]
}

const describeAccess = (access?: ProductAccess) => (access?.enabled ? access.accessLevel : "Disabled")

export default function ContactDataDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()
  const listPath = location.pathname.split("/").slice(0, -1).join("/") || "/contact-data"
  const isDataReviewContactData = location.pathname.startsWith("/data-review/contact-data")
  const incomingAuditId = (location.state as { auditId?: string } | null)?.auditId
  const { toast } = useToast()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const isReverification = isDataReviewContactData && customer?.status !== "Verified"
  const [selectedAddress, setSelectedAddress] = useState<string>("")
  const [addresses, setAddresses] = useState<string[]>([])
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([])
  const [originalContactPersons, setOriginalContactPersons] = useState<ContactPerson[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([])

  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      const customers: Customer[] = JSON.parse(storedCustomers)
      const found = customers.find((c) => c.id === params.id)
      if (found) {
        setCustomer(found)
        // Build 3 distinctly different addresses for this GST number
        const city = found.city || "Mumbai"
        const state = found.state || "Maharashtra"
        const derived = [
          `Registered Office: ${found.address || "Plot 12, Industrial Estate"}, ${city}, ${state} - 400001`,
          `Branch Office: 45 MG Road, Sector 18, ${found.branchLocation || "Pune"}, ${state} - 411001`,
          `Head Office: Tower B, Tech Park, ${found.headOfficeLocation || "Bengaluru"}, Karnataka - 560100`,
        ]
        setAddresses(derived)
        // Select the first address by default
        setSelectedAddress(derived[0])

        const storedAccess = localStorage.getItem(`portalAccess_${found.id}`)
        const accessByIndex: Partial<ContactPerson>[] = storedAccess ? JSON.parse(storedAccess) : []
        const defaultAccess = (): Pick<ContactPerson, "portalAccessEnabled" | "extinguisherAccess" | "trainingAccess"> => ({
          portalAccessEnabled: false,
          extinguisherAccess: { enabled: false, accessLevel: "View" },
          trainingAccess: { enabled: false, accessLevel: "View" },
        })

        const builtContactPersons = [
          {
            name: found.contactPerson1Name,
            designation: found.contactPerson1Designation,
            mobile: found.contactPerson1Mobile,
            email: found.contactPerson1Email,
            ...defaultAccess(),
            ...accessByIndex[0],
          },
          {
            name: found.contactPerson2Name,
            designation: found.contactPerson2Designation,
            mobile: found.contactPerson2Mobile,
            email: found.contactPerson2Email,
            ...defaultAccess(),
            ...accessByIndex[1],
          },
        ].filter((p) => p.name)

        setContactPersons(builtContactPersons)
        setOriginalContactPersons(JSON.parse(JSON.stringify(builtContactPersons)))
      }
    }

    const storedLog = localStorage.getItem(`activityLog_contact_${params.id}`)
    if (storedLog) {
      setActivityLog(JSON.parse(storedLog))
    } else {
      const now = Date.now()
      const dummyLog: ActivityLogEntry[] = [
        {
          id: "LOG-DUMMY-3",
          timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
          performedBy: "Admin User",
          changes: [{ field: "Contact Person 1 - Mobile No", from: "+91 98765 00000", to: "+91 98765 11111" }],
        },
        {
          id: "LOG-DUMMY-2",
          timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
          performedBy: "Admin User",
          changes: [
            { field: "Contact Person 1 - Portal Access", from: "Disabled", to: "Enabled" },
            { field: "Contact Person 1 - Extinguisher Access", from: "Disabled", to: "View" },
          ],
        },
        {
          id: "LOG-DUMMY-1",
          timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
          performedBy: "Admin User",
          changes: [{ field: "Contact Person 2 - Designation", from: "Executive", to: "HR Manager" }],
        },
      ]
      setActivityLog(dummyLog)
      localStorage.setItem(`activityLog_contact_${params.id}`, JSON.stringify(dummyLog))
    }
  }, [params.id])

  const handleContactChange = (index: number, field: keyof ContactPerson, value: string) => {
    setContactPersons((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)))
  }

  const handlePortalAccessToggle = (index: number, enabled: boolean) => {
    setContactPersons((prev) => prev.map((p, i) => (i === index ? { ...p, portalAccessEnabled: enabled } : p)))
  }

  const handleProductAccessToggle = (index: number, product: "extinguisherAccess" | "trainingAccess", enabled: boolean) => {
    setContactPersons((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, [product]: { ...(p[product] ?? { accessLevel: "View" }), enabled } }
          : p,
      ),
    )
  }

  const handleProductAccessLevel = (index: number, product: "extinguisherAccess" | "trainingAccess", accessLevel: "Edit" | "View") => {
    setContactPersons((prev) =>
      prev.map((p, i) =>
        i === index
          ? { ...p, [product]: { ...(p[product] ?? { enabled: false }), accessLevel } }
          : p,
      ),
    )
  }

  const handleSave = () => {
    if (!customer) return
    setIsSaving(true)
    localStorage.setItem(
      `portalAccess_${customer.id}`,
      JSON.stringify(
        contactPersons.map((p) => ({
          contactType: p.contactType,
          portalAccessEnabled: p.portalAccessEnabled,
          extinguisherAccess: p.extinguisherAccess,
          trainingAccess: p.trainingAccess,
        })),
      ),
    )
    const storedCustomers = localStorage.getItem("customers")
    if (storedCustomers) {
      const customers: Customer[] = JSON.parse(storedCustomers)
      const updated = customers.map((c) => {
        if (c.id !== customer.id) return c
        return {
          ...c,
          contactPerson1Name: contactPersons[0]?.name ?? c.contactPerson1Name,
          contactPerson1Designation: contactPersons[0]?.designation ?? c.contactPerson1Designation,
          contactPerson1Mobile: contactPersons[0]?.mobile ?? c.contactPerson1Mobile,
          contactPerson1Email: contactPersons[0]?.email ?? c.contactPerson1Email,
          contactPerson2Name: contactPersons[1]?.name ?? c.contactPerson2Name,
          contactPerson2Designation: contactPersons[1]?.designation ?? c.contactPerson2Designation,
          contactPerson2Mobile: contactPersons[1]?.mobile ?? c.contactPerson2Mobile,
          contactPerson2Email: contactPersons[1]?.email ?? c.contactPerson2Email,
        }
      })
      localStorage.setItem("customers", JSON.stringify(updated))
    }

    const changes: { field: string; from: string; to: string }[] = []
    contactPersons.forEach((person, index) => {
      const original = originalContactPersons[index] ?? {}
      const label = `Contact Person ${index + 1}`
      const compare = (field: string, from: string, to: string) => {
        if (from !== to) changes.push({ field: `${label} - ${field}`, from, to })
      }
      compare("Contact Type", original.contactType ?? "—", person.contactType ?? "—")
      compare("Name", original.name ?? "—", person.name ?? "—")
      compare("Designation", original.designation ?? "—", person.designation ?? "—")
      compare("Mobile No", original.mobile ?? "—", person.mobile ?? "—")
      compare("Email Address", original.email ?? "—", person.email ?? "—")
      compare("Portal Access", original.portalAccessEnabled ? "Enabled" : "Disabled", person.portalAccessEnabled ? "Enabled" : "Disabled")
      compare("Extinguisher Access", describeAccess(original.extinguisherAccess), describeAccess(person.extinguisherAccess))
      compare("Training Access", describeAccess(original.trainingAccess), describeAccess(person.trainingAccess))
    })

    if (changes.length > 0) {
      const newEntry: ActivityLogEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        performedBy: "Admin User",
        changes,
      }
      const updatedLog = [newEntry, ...activityLog]
      setActivityLog(updatedLog)
      localStorage.setItem(`activityLog_contact_${customer.id}`, JSON.stringify(updatedLog))
    }

    setIsSaving(false)
    toast({
      title: "Contact details saved",
      description: "The contact person details have been updated successfully.",
    })
    navigate(
      isDataReviewContactData
        ? incomingAuditId
          ? `/data-review/survey-data/${incomingAuditId}`
          : "/data-review/survey-data"
        : listPath,
    )
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">Loading contact data...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="bg-transparent" onClick={() => navigate(listPath)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.customerName}</h1>
            <p className="text-sm text-gray-600 mt-1">Company contact details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GST Number */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-[#E63946]" />
              <Label className="text-sm font-medium text-gray-700">GST Number</Label>
            </div>
            <p className="text-lg font-semibold text-gray-900 tracking-wide">{customer.gst || "Not Available"}</p>
            {customer.gstCompanyName && <p className="text-sm text-gray-500 mt-1">{customer.gstCompanyName}</p>}
          </div>

          {/* Address Dropdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-[#E63946]" />
              <Label className="text-sm font-medium text-gray-700">Select Address</Label>
            </div>
            <Select value={selectedAddress} onValueChange={setSelectedAddress}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an address for this GST number" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((addr, index) => (
                  <SelectItem key={index} value={addr}>
                    {addr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contact Person Details - shown after address is selected */}
        {selectedAddress && (
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-[#E63946]" />
              <Label className="text-sm font-medium text-gray-700">Contact Person Details</Label>
            </div>

            {contactPersons.length === 0 ? (
              <p className="text-sm text-gray-500">No contact persons available for this company.</p>
            ) : (
              <div className="space-y-5">
                {contactPersons.map((person, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#E63946]">Contact Person - {index + 1}</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-gray-700">Contact Type</Label>
                          <Select
                            value={person.contactType ?? ""}
                            onValueChange={(value) => handleContactChange(index, "contactType", value as ContactType)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select contact type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Customer Administrator">Customer Administrator</SelectItem>
                              <SelectItem value="Product Contact">Product Contact</SelectItem>
                              <SelectItem value="Customer User">Customer User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">Contact Person</Label>
                            <Input
                              value={person.name || ""}
                              onChange={(e) => handleContactChange(index, "name", e.target.value)}
                              placeholder="Enter contact person name"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">Designation</Label>
                            <Input
                              value={person.designation || ""}
                              onChange={(e) => handleContactChange(index, "designation", e.target.value)}
                              placeholder="Enter designation"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">Mobile No</Label>
                            <Input
                              value={person.mobile || ""}
                              onChange={(e) => handleContactChange(index, "mobile", e.target.value)}
                              placeholder="Enter mobile number"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                            <Input
                              type="email"
                              value={person.email || ""}
                              onChange={(e) => handleContactChange(index, "email", e.target.value)}
                              placeholder="Enter email address"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Customer Portal Module Permission Access */}
                      <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50 h-fit">
                        <div className="flex items-center gap-2">
                          <KeyRound className="h-3.5 w-3.5 text-gray-400" />
                          <Label className="text-sm font-medium text-gray-700">Customer Portal Module Permission Access</Label>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Enable Portal Access</span>
                          <Switch
                            checked={person.portalAccessEnabled ?? false}
                            onCheckedChange={(checked) => handlePortalAccessToggle(index, checked)}
                          />
                        </div>
                        <div className="space-y-2.5 pt-3 border-t border-gray-200">
                          {(["extinguisherAccess", "trainingAccess"] as const).map((product) => (
                            <div key={product} className="flex items-center justify-between gap-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                  checked={person[product]?.enabled ?? false}
                                  onCheckedChange={(checked) => handleProductAccessToggle(index, product, checked as boolean)}
                                  disabled={!person.portalAccessEnabled}
                                  className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                                />
                                <span className="text-sm text-gray-700">
                                  {product === "extinguisherAccess" ? "Extinguisher" : "Training"}
                                </span>
                              </label>
                              <Select
                                value={person[product]?.accessLevel ?? "View"}
                                onValueChange={(value) => handleProductAccessLevel(index, product, value as "Edit" | "View")}
                                disabled={!person.portalAccessEnabled || !person[product]?.enabled}
                              >
                                <SelectTrigger className="w-28 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="View">View</SelectItem>
                                  <SelectItem value="Edit">Edit</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {contactPersons.length > 0 && (
              <div className="flex justify-end mt-5">
                <Button onClick={handleSave} disabled={isSaving} className="bg-[#E63946] hover:bg-[#E63946]/90">
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : isDataReviewContactData ? "Verify contact details" : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="h-4 w-4 text-[#E63946]" />
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
          </div>

          {activityLog.length === 0 ? (
            <p className="text-sm text-gray-500">No changes recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {activityLog.map((entry, entryIndex) => {
                const highlight = isReverification && entryIndex === 0
                return (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{entry.performedBy}</p>
                      <p
                        className={
                          highlight
                            ? "text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800"
                            : "text-xs text-gray-500"
                        }
                      >
                        {highlight ? "Re-updated on " : ""}
                        {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {entry.changes.map((change, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          Changed <span className="font-medium text-gray-900">{change.field}</span> from "
                          {change.from}" to "{change.to}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
