import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft, Building2, User, Phone, Mail, Flame, BookOpen, CheckCircle2, History, AlertTriangle, Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AuditAssignment } from "@/types/audit-assignment"

interface PersonData {
  name: string
  email: string
  phone: string
}

interface AssignmentRecord {
  id: string
  assignedTo: string
  assigneeType: "Employee" | "Auditor"
  email: string
  phone: string
  extinguisherSurvey: boolean
  trainingSurvey: boolean
  assignedAt: string
  status: "Assigned"
}

const employees: PersonData[] = [
  { name: "Rajesh Kumar",   email: "rajesh.kumar@ushafire.in",   phone: "+91 98765 43210" },
  { name: "Sunita Verma",   email: "sunita.verma@ushafire.in",   phone: "+91 87654 32109" },
  { name: "Pradeep Sharma", email: "pradeep.sharma@ushafire.in", phone: "+91 54321 09876" },
  { name: "Anjali Singh",   email: "anjali.singh@ushafire.in",   phone: "+91 43210 98765" },
]

const auditors: PersonData[] = [
  { name: "John Smith",    email: "john.smith@safetymatters.com",    phone: "+91 98765 43210" },
  { name: "Sarah Johnson", email: "sarah.johnson@safetymatters.com", phone: "+91 87654 32109" },
  { name: "Michael Brown", email: "michael.brown@safetymatters.com", phone: "+91 76543 21098" },
  { name: "Emily Davis",   email: "emily.davis@safetymatters.com",   phone: "+91 65432 10987" },
  { name: "Karthik Rao",   email: "karthik.rao@safetymatters.com",   phone: "+91 76543 21098" },
  { name: "Lakshmi Iyer",  email: "lakshmi.iyer@safetymatters.com",  phone: "+91 65432 10987" },
]

const mockAssignments: AuditAssignment[] = [
  {
    id: "ASSGN001", requestId: "CMP001", requestDate: "21/11/2024",
    companyName: "TechVista Office Complex", companyLocation: "Gurgaon, Haryana",
    contactName: "Anita Sharma", contactPhone: "+91 98765 43210", contactEmail: "anita.sharma@techvista.com",
    buildingType: "Office Complex", floors: 12, extinguisherCount: 68,
    assignmentStatus: "Assigned", salesPerson: "Rajesh Kumar",
  },
  {
    id: "ASSGN002", requestId: "CMP002", requestDate: "22/11/2024",
    companyName: "Green Valley Hospital", companyLocation: "Bangalore, Karnataka",
    contactName: "Dr. Priya Menon", contactPhone: "+91 98765 43211", contactEmail: "priya.menon@greenvalley.com",
    buildingType: "Hospital", floors: 8, extinguisherCount: 95,
    assignmentStatus: "Not Assigned",
  },
  {
    id: "ASSGN003", requestId: "CMP003", requestDate: "23/11/2024",
    companyName: "Sunrise Shopping Mall", companyLocation: "Mumbai, Maharashtra",
    contactName: "Amit Patel", contactPhone: "+91 98765 43212", contactEmail: "amit.patel@sunrise.com",
    buildingType: "Shopping Mall", floors: 5, extinguisherCount: 120,
    assignmentStatus: "Assigned", salesPerson: "Sunita Verma",
  },
  {
    id: "ASSGN004", requestId: "CMP004", requestDate: "24/11/2024",
    companyName: "Heritage Hotel & Resort", companyLocation: "Jaipur, Rajasthan",
    contactName: "Vikram Singh", contactPhone: "+91 98765 43213", contactEmail: "vikram.singh@heritage.com",
    buildingType: "Hotel", floors: 10, extinguisherCount: 85,
    assignmentStatus: "Not Assigned",
  },
  {
    id: "ASSGN005", requestId: "CMP005", requestDate: "25/11/2024",
    companyName: "Future Tech Park", companyLocation: "Hyderabad, Telangana",
    contactName: "Meera Reddy", contactPhone: "+91 98765 43214", contactEmail: "meera.reddy@futuretech.com",
    buildingType: "Tech Park", floors: 15, extinguisherCount: 145,
    assignmentStatus: "Assigned", salesPerson: "Karthik Rao",
  },
  {
    id: "ASSGN006", requestId: "CMP006", requestDate: "26/11/2024",
    companyName: "Prime Education Center", companyLocation: "Pune, Maharashtra",
    contactName: "Neha Deshmukh", contactPhone: "+91 98765 43215", contactEmail: "neha.deshmukh@primeedu.com",
    buildingType: "Educational Institute", floors: 6, extinguisherCount: 52,
    assignmentStatus: "Not Assigned",
  },
  {
    id: "ASSGN007", requestId: "CMP007", requestDate: "27/11/2024",
    companyName: "Metro Industrial Hub", companyLocation: "Chennai, Tamil Nadu",
    contactName: "Suresh Kumar", contactPhone: "+91 98765 43216", contactEmail: "suresh.kumar@metrohub.com",
    buildingType: "Industrial Complex", floors: 4, extinguisherCount: 78,
    assignmentStatus: "Assigned", salesPerson: "Lakshmi Iyer",
  },
  {
    id: "ASSGN008", requestId: "CMP008", requestDate: "28/11/2024",
    companyName: "City Center Apartments", companyLocation: "Kolkata, West Bengal",
    contactName: "Rohit Chatterjee", contactPhone: "+91 98765 43217", contactEmail: "rohit.chatterjee@citycenter.com",
    buildingType: "Residential Complex", floors: 20, extinguisherCount: 160,
    assignmentStatus: "Not Assigned",
  },
]

const mockHistory: Record<string, AssignmentRecord[]> = {
  ASSGN001: [
    {
      id: "H001", assignedTo: "Rajesh Kumar", assigneeType: "Employee",
      email: "rajesh.kumar@ushafire.in", phone: "+91 98765 43210",
      extinguisherSurvey: true, trainingSurvey: false,
      assignedAt: "21/11/2024, 10:32 AM", status: "Assigned",
    },
  ],
  ASSGN003: [
    {
      id: "H002", assignedTo: "Pradeep Sharma", assigneeType: "Employee",
      email: "pradeep.sharma@ushafire.in", phone: "+91 54321 09876",
      extinguisherSurvey: true, trainingSurvey: true,
      assignedAt: "22/11/2024, 09:15 AM", status: "Assigned",
    },
    {
      id: "H003", assignedTo: "Sunita Verma", assigneeType: "Employee",
      email: "sunita.verma@ushafire.in", phone: "+91 87654 32109",
      extinguisherSurvey: true, trainingSurvey: true,
      assignedAt: "23/11/2024, 02:45 PM", status: "Assigned",
    },
  ],
  ASSGN005: [
    {
      id: "H004", assignedTo: "Sarah Johnson", assigneeType: "Auditor",
      email: "sarah.johnson@safetymatters.com", phone: "+91 87654 32109",
      extinguisherSurvey: false, trainingSurvey: true,
      assignedAt: "24/11/2024, 11:00 AM", status: "Assigned",
    },
    {
      id: "H005", assignedTo: "Karthik Rao", assigneeType: "Auditor",
      email: "karthik.rao@safetymatters.com", phone: "+91 76543 21098",
      extinguisherSurvey: true, trainingSurvey: true,
      assignedAt: "25/11/2024, 03:20 PM", status: "Assigned",
    },
  ],
  ASSGN007: [
    {
      id: "H006", assignedTo: "Lakshmi Iyer", assigneeType: "Auditor",
      email: "lakshmi.iyer@safetymatters.com", phone: "+91 65432 10987",
      extinguisherSurvey: true, trainingSurvey: false,
      assignedAt: "27/11/2024, 04:10 PM", status: "Assigned",
    },
  ],
}

export default function AuditAssignmentDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id as string

  const assignment = mockAssignments.find((a) => a.id === id)
  const history = mockHistory[id] ?? []

  const [assigneeType, setAssigneeType] = useState<"employee" | "auditor">("employee")
  const [selectedName, setSelectedName] = useState("")
  const [assignExt, setAssignExt] = useState(false)
  const [assignTraining, setAssignTraining] = useState(false)
  const [records, setRecords] = useState<AssignmentRecord[]>(history)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<AssignmentRecord | null>(null)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) navigate("/")
  }, [navigate])

  if (!assignment) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-gray-500">Assignment not found.</p>
          <Button variant="outline" onClick={() => navigate("/data-review/audit-assignment")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const personList = assigneeType === "employee" ? employees : auditors
  const selectedPerson = personList.find((p) => p.name === selectedName)
  const canAssign = !!selectedName && (assignExt || assignTraining)

  const handleTypeChange = (type: "employee" | "auditor") => {
    setAssigneeType(type)
    setSelectedName("")
    setAssignExt(false)
    setAssignTraining(false)
  }

  const handleAssign = () => {
    if (!selectedPerson || !selectedName) return
    setIsSaving(true)
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })

    const newRecord: AssignmentRecord = {
      id: `H${Date.now()}`,
      assignedTo: selectedName,
      assigneeType: assigneeType === "employee" ? "Employee" : "Auditor",
      email: selectedPerson.email,
      phone: selectedPerson.phone,
      extinguisherSurvey: assignExt,
      trainingSurvey: assignTraining,
      assignedAt: `${dateStr}, ${timeStr}`,
      status: "Assigned",
    }

    setRecords((prev) => prev.concat(newRecord))

    setAssigneeType("")
    setSelectedName("")
    setAssignExt(false)
    setAssignTraining(false)
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/data-review/audit-assignment")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Assignment</h1>
            <p className="text-sm text-gray-500 mt-0.5">{assignment.requestId} · {assignment.companyName}</p>
          </div>
        </div>

        {/* Company Info + Assignment Form always side-by-side */}
        <div className="grid grid-cols-2 gap-6">

          {/* Left — Company Details */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Company Details</p>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-[#E63946]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{assignment.companyName}</div>
                  <div className="text-sm text-gray-500">{assignment.companyLocation}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Request ID</p>
                  <p className="font-semibold text-gray-800">{assignment.requestId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Request Date</p>
                  <p className="font-semibold text-gray-800">{assignment.requestDate}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Building Type</p>
                  <p className="font-semibold text-gray-800">{assignment.buildingType}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Floors</p>
                  <p className="font-semibold text-gray-800">{assignment.floors}</p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <div className="text-sm">
                  <span className="text-gray-500">Fire Extinguishers: </span>
                  <span className="font-semibold text-gray-800">~{assignment.extinguisherCount}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Contact</p>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-800">{assignment.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600">{assignment.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600">{assignment.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Assignment Form */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Assign Audit
                </p>
              </div>

              {/* Assign To toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Assign To</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("employee")}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      assigneeType === "employee"
                        ? "bg-[#E63946] text-white border-[#E63946]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#E63946] hover:text-[#E63946]"
                    }`}
                  >
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("auditor")}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      assigneeType === "auditor"
                        ? "bg-[#E63946] text-white border-[#E63946]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#E63946] hover:text-[#E63946]"
                    }`}
                  >
                    Auditor
                  </button>
                </div>
              </div>

              {/* Name select — always visible */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Select {assigneeType === "employee" ? "Employee" : "Auditor"}
                </Label>
                <Select value={selectedName} onValueChange={setSelectedName}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={`Choose a${assigneeType === "auditor" ? "n auditor" : "n employee"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {personList.map((p) => (
                      <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPerson && (
                  <div className="bg-blue-50 rounded-lg px-3 py-2.5 border border-blue-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <Mail className="h-3.5 w-3.5 text-blue-500" />
                      {selectedPerson.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-700">
                      <Phone className="h-3.5 w-3.5 text-blue-500" />
                      {selectedPerson.phone}
                    </div>
                  </div>
                )}
              </div>

              {/* Survey checkboxes — always visible */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Survey Assignment</Label>
                <div className="space-y-2.5">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${assignExt ? "border-[#E63946] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <Checkbox
                      checked={assignExt}
                      onCheckedChange={(v) => setAssignExt(!!v)}
                      className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                    />
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-800">Extinguisher Survey</span>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${assignTraining ? "border-[#E63946] bg-red-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <Checkbox
                      checked={assignTraining}
                      onCheckedChange={(v) => setAssignTraining(!!v)}
                      className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                    />
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-800">Training Survey</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-2 border-t">
                {saved && (
                  <div className="flex items-center gap-1.5 text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Assignment saved successfully
                  </div>
                )}
                <div className="ml-auto">
                  <Button
                    onClick={handleAssign}
                    disabled={!canAssign || isSaving}
                    className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white px-6"
                  >
                    {isSaving ? "Saving…" : records.some((r) => r.status === "Assigned") ? "Update Assignment" : "Assign"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignment History */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <History className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-700">Assignment History</h2>
            {records.length > 0 && (
              <span className="ml-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{records.length}</span>
            )}
          </div>

          {records.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No assignments have been made yet for this audit.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">#</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">Assigned To</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">Contact</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">Surveys</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">Assigned On</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((rec, idx) => (
                    <TableRow key={rec.id} className="hover:bg-gray-50">
                      <TableCell className="text-gray-400 text-xs">{idx + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{rec.assignedTo}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
                          rec.assigneeType === "Employee"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {rec.assigneeType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {rec.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {rec.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {rec.extinguisherSurvey && (
                            <span className="inline-flex items-center gap-1 text-xs text-orange-700">
                              <Flame className="h-3 w-3" /> Extinguisher
                            </span>
                          )}
                          {rec.trainingSurvey && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-700">
                              <BookOpen className="h-3 w-3" /> Training
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 whitespace-nowrap">{rec.assignedAt}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {rec.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => setRemoveTarget(rec)}
                          className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Remove confirmation dialog */}
      <Dialog open={!!removeTarget} onOpenChange={(open) => { if (!open) setRemoveTarget(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Remove Assignee
            </DialogTitle>
          </DialogHeader>

          <div className="py-3">
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                By removing the assignee the mapped company will automatically get removed from the user login.
              </p>
            </div>
            {removeTarget && (
              <div className="mt-4 text-sm text-gray-600">
                You are about to remove <span className="font-semibold text-gray-900">{removeTarget.assignedTo}</span> ({removeTarget.assigneeType}) from this audit assignment.
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                setRecords((prev) => prev.filter((r) => r.id !== removeTarget?.id))
                setRemoveTarget(null)
              }}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Yes, Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
