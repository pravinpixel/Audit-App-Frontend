import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Download, Search, Flame, BookOpen, Phone, Mail, Eye, MessageSquare, Send,
} from "lucide-react"

interface Comment {
  id: string
  author: "customer" | "admin"
  authorName: string
  text: string
  timestamp: string
}

const mockCommentsByCompany: Record<string, Comment[]> = {
  "1": [
    { id: "c1", author: "customer", authorName: "Rahul Sharma", text: "Please update the extinguisher refill date for LOC-001, we got it serviced last week.", timestamp: "12 Jan 2025, 10:30 AM" },
    { id: "c2", author: "admin", authorName: "Admin", text: "Noted. We will verify with the auditor and update the record shortly.", timestamp: "12 Jan 2025, 11:45 AM" },
  ],
}

interface EquipmentRecord {
  companyId: string
  companyName: string
  industryType: string
  branchLocation: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  surveyType: "extinguisher" | "training"
  // extinguisher
  locationNo?: string
  floor?: string
  locationDetail?: string
  extType?: string
  capacity?: string
  brand?: string
  // training
  programmeTitle?: string
  trainingGivenBy?: string
  // due dates
  refillHptDueDate?: string
  shelfLifeDueDate?: string
  trainingDueDate?: string
}

// Source equipment data
const equipmentData: EquipmentRecord[] = [
  {
    companyId: "1", companyName: "Tech Solutions Pvt Ltd", industryType: "IT Services", branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma", contactPhone: "+91 98765 11111", contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-001", floor: "Ground Floor", locationDetail: "Near Main Entrance",
    extType: "CO2", capacity: "5 kg", brand: "FireStop",
    refillHptDueDate: "10/06/2026",
    shelfLifeDueDate: "20/07/2026",
  },
  {
    companyId: "1", companyName: "Tech Solutions Pvt Ltd", industryType: "IT Services", branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma", contactPhone: "+91 98765 11111", contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-002", floor: "Second Floor", locationDetail: "Conference Room B",
    extType: "Foam", capacity: "9 L", brand: "FireStop",
    refillHptDueDate: "05/06/2026",
    shelfLifeDueDate: "15/06/2026",
  },
  {
    companyId: "3", companyName: "Sunrise Industries", industryType: "Chemicals", branchLocation: "Connaught Place, Delhi",
    contactPerson: "Amit Kumar", contactPhone: "+91 98765 33333", contactEmail: "amit.kumar@sunriseindustries.com",
    surveyType: "extinguisher",
    locationNo: "LOC-005", floor: "Basement", locationDetail: "Storage Room",
    extType: "CO2", capacity: "5 kg", brand: "Ceasefire",
    refillHptDueDate: "01/06/2026",
    shelfLifeDueDate: "10/08/2026",
  },
  {
    companyId: "3", companyName: "Sunrise Industries", industryType: "Chemicals", branchLocation: "Connaught Place, Delhi",
    contactPerson: "Amit Kumar", contactPhone: "+91 98765 33333", contactEmail: "amit.kumar@sunriseindustries.com",
    surveyType: "extinguisher",
    locationNo: "LOC-006", floor: "First Floor", locationDetail: "Lab Area",
    extType: "CO2", capacity: "2 kg", brand: "Ceasefire",
    refillHptDueDate: "20/06/2026",
    shelfLifeDueDate: "30/06/2026",
  },
  {
    companyId: "5", companyName: "Prime Retail Group", industryType: "Retail", branchLocation: "Banjara Hills, Hyderabad",
    contactPerson: "Vikram Singh", contactPhone: "+91 98765 55555", contactEmail: "vikram.singh@primeretailgroup.com",
    surveyType: "extinguisher",
    locationNo: "LOC-003", floor: "Ground Floor", locationDetail: "Main Store",
    extType: "Foam", capacity: "6 L", brand: "Minimax",
    refillHptDueDate: "15/07/2026",
    shelfLifeDueDate: "10/06/2026",
  },
  {
    companyId: "5", companyName: "Prime Retail Group", industryType: "Retail", branchLocation: "Banjara Hills, Hyderabad",
    contactPerson: "Vikram Singh", contactPhone: "+91 98765 55555", contactEmail: "vikram.singh@primeretailgroup.com",
    surveyType: "extinguisher",
    locationNo: "LOC-004", floor: "First Floor", locationDetail: "Stockroom",
    extType: "CO2", capacity: "5 kg", brand: "Minimax",
    refillHptDueDate: "18/06/2026",
    shelfLifeDueDate: "25/07/2026",
  },
  {
    companyId: "6", companyName: "Bharat Steel Works", industryType: "Manufacturing", branchLocation: "Ring Road, Surat",
    contactPerson: "Rajesh Mehta", contactPhone: "+91 98765 66666", contactEmail: "rajesh.mehta@bharatsteel.com",
    surveyType: "extinguisher",
    locationNo: "LOC-007", floor: "Shop Floor", locationDetail: "Near Furnace",
    extType: "CO2", capacity: "9 kg", brand: "FireStop",
    refillHptDueDate: "01/05/2026",
    shelfLifeDueDate: "10/05/2026",
  },
  {
    companyId: "6", companyName: "Bharat Steel Works", industryType: "Manufacturing", branchLocation: "Ring Road, Surat",
    contactPerson: "Rajesh Mehta", contactPhone: "+91 98765 66666", contactEmail: "rajesh.mehta@bharatsteel.com",
    surveyType: "extinguisher",
    locationNo: "LOC-008", floor: "Roof Level", locationDetail: "Electrical Room",
    extType: "CO2", capacity: "5 kg", brand: "Ceasefire",
    refillHptDueDate: "10/06/2026",
    shelfLifeDueDate: "20/08/2026",
  },
  {
    companyId: "7", companyName: "Coastal Pharma Ltd", industryType: "Pharma", branchLocation: "MG Road, Kochi",
    contactPerson: "Ananya Nair", contactPhone: "+91 98765 77777", contactEmail: "ananya.nair@coastalpharma.com",
    surveyType: "extinguisher",
    locationNo: "LOC-002", floor: "Second Floor", locationDetail: "Clean Room",
    extType: "CO2", capacity: "2 kg", brand: "Minimax",
    refillHptDueDate: "12/06/2026",
    shelfLifeDueDate: "05/07/2026",
  },
  {
    companyId: "11", companyName: "Eastern Cement Co", industryType: "Construction", branchLocation: "Bhubaneswar Branch",
    contactPerson: "Sanjay Das", contactPhone: "+91 98766 11111", contactEmail: "sanjay.das@easterncement.com",
    surveyType: "extinguisher",
    locationNo: "LOC-001", floor: "Ground Floor", locationDetail: "Main Gate",
    extType: "Foam", capacity: "9 L", brand: "FireStop",
    refillHptDueDate: "15/06/2026",
    shelfLifeDueDate: "01/07/2026",
  },
  {
    companyId: "11", companyName: "Eastern Cement Co", industryType: "Construction", branchLocation: "Bhubaneswar Branch",
    contactPerson: "Sanjay Das", contactPhone: "+91 98766 11111", contactEmail: "sanjay.das@easterncement.com",
    surveyType: "extinguisher",
    locationNo: "LOC-003", floor: "Basement", locationDetail: "Generator Room",
    extType: "CO2", capacity: "5 kg", brand: "Ceasefire",
    refillHptDueDate: "22/07/2026",
    shelfLifeDueDate: "08/05/2026",
  },
  {
    companyId: "2", companyName: "Global Manufacturing Co", industryType: "Manufacturing", branchLocation: "Pune Branch",
    contactPerson: "Priya Patel", contactPhone: "+91 98765 22222", contactEmail: "priya.patel@globalmanufacturing.com",
    surveyType: "extinguisher",
    locationNo: "LOC-009", floor: "Third Floor", locationDetail: "Server Room",
    extType: "CO2", capacity: "2 kg", brand: "FireStop",
    refillHptDueDate: "10/05/2026",
    shelfLifeDueDate: "20/09/2026",
  },
  // Training records
  {
    companyId: "1", companyName: "Tech Solutions Pvt Ltd", industryType: "IT Services", branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma", contactPhone: "+91 98765 11111", contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Basic Fire Safety Awareness", trainingGivenBy: "Srinivas Rao",
    trainingDueDate: "18/06/2026",
  },
  {
    companyId: "3", companyName: "Sunrise Industries", industryType: "Chemicals", branchLocation: "Connaught Place, Delhi",
    contactPerson: "Amit Kumar", contactPhone: "+91 98765 33333", contactEmail: "amit.kumar@sunriseindustries.com",
    surveyType: "training",
    programmeTitle: "Hazardous Material Handling", trainingGivenBy: "Deepak Verma",
    trainingDueDate: "10/07/2026",
  },
  {
    companyId: "6", companyName: "Bharat Steel Works", industryType: "Manufacturing", branchLocation: "Ring Road, Surat",
    contactPerson: "Rajesh Mehta", contactPhone: "+91 98765 66666", contactEmail: "rajesh.mehta@bharatsteel.com",
    surveyType: "training",
    programmeTitle: "Fire Warden Training", trainingGivenBy: "Mohan Das",
    trainingDueDate: "05/06/2026",
  },
  {
    companyId: "7", companyName: "Coastal Pharma Ltd", industryType: "Pharma", branchLocation: "MG Road, Kochi",
    contactPerson: "Ananya Nair", contactPhone: "+91 98765 77777", contactEmail: "ananya.nair@coastalpharma.com",
    surveyType: "training",
    programmeTitle: "Emergency Evacuation Drill", trainingGivenBy: "Suresh Pillai",
    trainingDueDate: "28/06/2026",
  },
  {
    companyId: "2", companyName: "Global Manufacturing Co", industryType: "Manufacturing", branchLocation: "Pune Branch",
    contactPerson: "Priya Patel", contactPhone: "+91 98765 22222", contactEmail: "priya.patel@globalmanufacturing.com",
    surveyType: "training",
    programmeTitle: "Fire Extinguisher Operation", trainingGivenBy: "Arjun Kulkarni",
    trainingDueDate: "01/05/2026",
  },
  // New companies
  {
    companyId: "12", companyName: "Skyline Aviation Services", industryType: "Aviation", branchLocation: "Airport Road, Bangalore",
    contactPerson: "Karthik Reddy", contactPhone: "+91 98111 22334", contactEmail: "karthik.reddy@skylineaviation.com",
    surveyType: "extinguisher",
    locationNo: "LOC-001", floor: "Ground Floor", locationDetail: "Hangar Bay 1",
    extType: "CO2", capacity: "9 kg", brand: "Ceasefire",
    refillHptDueDate: "12/06/2026",
    shelfLifeDueDate: "22/09/2026",
  },
  {
    companyId: "13", companyName: "Greenfield Agro Exports", industryType: "Agriculture", branchLocation: "MIDC, Nashik",
    contactPerson: "Meenal Kulkarni", contactPhone: "+91 98222 33445", contactEmail: "meenal.kulkarni@greenfieldagro.com",
    surveyType: "extinguisher",
    locationNo: "LOC-002", floor: "Ground Floor", locationDetail: "Cold Storage Unit",
    extType: "Foam", capacity: "6 L", brand: "Minimax",
    refillHptDueDate: "28/06/2026",
    shelfLifeDueDate: "14/08/2026",
  },
  {
    companyId: "14", companyName: "Horizon Textiles Ltd", industryType: "Textiles", branchLocation: "Tirupur Road, Coimbatore",
    contactPerson: "Ganesh Murthy", contactPhone: "+91 98333 44556", contactEmail: "ganesh.murthy@horizontextiles.com",
    surveyType: "training",
    programmeTitle: "Textile Unit Fire Safety Training", trainingGivenBy: "Lakshmi Narayanan",
    trainingDueDate: "08/07/2026",
  },
]

interface DueEntry {
  id: string
  companyId: string
  companyName: string
  industryType: string
  branchLocation: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  surveyType: "extinguisher" | "training"
  dueType: "Refill & HPT" | "Shelf Life" | "Training"
  dueDate: string
}

// Flatten: one row per due type per equipment
function buildEntries(data: EquipmentRecord[]): DueEntry[] {
  const entries: DueEntry[] = []
  data.forEach((r) => {
    const base = {
      companyId: r.companyId, companyName: r.companyName, industryType: r.industryType,
      branchLocation: r.branchLocation, contactPerson: r.contactPerson, contactPhone: r.contactPhone,
      contactEmail: r.contactEmail, surveyType: r.surveyType,
    }
    if (r.surveyType === "extinguisher") {
      if (r.refillHptDueDate) entries.push({ ...base, id: `${r.companyId}-${r.locationNo}-refill`, dueType: "Refill & HPT", dueDate: r.refillHptDueDate })
      if (r.shelfLifeDueDate) entries.push({ ...base, id: `${r.companyId}-${r.locationNo}-shelf`, dueType: "Shelf Life", dueDate: r.shelfLifeDueDate })
    } else if (r.surveyType === "training") {
      if (r.trainingDueDate) entries.push({ ...base, id: `${r.companyId}-${r.programmeTitle}-training`, dueType: "Training", dueDate: r.trainingDueDate })
    }
  })
  return entries
}

const initialEntries = buildEntries(equipmentData)

// Per-company counts of items due for Refill & HPT vs Shelf Life
const companyDueCounts: Record<string, { refillHpt: number; shelfLife: number }> = {}
equipmentData.forEach((r) => {
  if (r.surveyType !== "extinguisher") return
  const counts = companyDueCounts[r.companyId] ?? { refillHpt: 0, shelfLife: 0 }
  if (r.refillHptDueDate) counts.refillHpt += 1
  if (r.shelfLifeDueDate) counts.shelfLife += 1
  companyDueCounts[r.companyId] = counts
})

// Convert DD/MM/YYYY → YYYY-MM-DD for date inputs
function toInputDate(dmy: string): string {
  const p = dmy.split("/")
  if (p.length !== 3) return ""
  return `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}`
}
// Convert YYYY-MM-DD → DD/MM/YYYY for display
function toDisplayDate(iso: string): string {
  const p = iso.split("-")
  if (p.length !== 3) return iso
  return `${p[2]}/${p[1]}/${p[0]}`
}

function getDaysFromNow(dmy: string): number {
  const iso = toInputDate(dmy)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(iso)
  date.setHours(0, 0, 0, 0)
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function FollowupStatusBadge({ date }: { date: string }) {
  const days = getDaysFromNow(date)
  if (days < 0) {
    return (
      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 whitespace-nowrap">
        Overdue {Math.abs(days)}d
      </span>
    )
  }
  return (
    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600 whitespace-nowrap">
      Due in {days}d
    </span>
  )
}

function ProductTypeCell({ surveyType }: { surveyType: DueEntry["surveyType"] }) {
  return surveyType === "extinguisher" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold w-fit">
      <Flame className="h-3 w-3" /> Extinguisher
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold w-fit">
      <BookOpen className="h-3 w-3" /> Training
    </span>
  )
}

export default function DueDateFollowupPage() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<DueEntry[]>(initialEntries)
  const [searchQuery, setSearchQuery] = useState("")
  const [commentsByCompany, setCommentsByCompany] = useState<Record<string, Comment[]>>(mockCommentsByCompany)
  const [commentDialogCompanyId, setCommentDialogCompanyId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return entries
    return entries.filter((e) =>
      e.companyName.toLowerCase().includes(q) ||
      e.branchLocation.toLowerCase().includes(q) ||
      e.contactPerson.toLowerCase().includes(q) ||
      e.contactPhone.toLowerCase().includes(q) ||
      e.contactEmail.toLowerCase().includes(q)
    )
  }, [entries, searchQuery])

  const handleDueDateChange = (id: string, value: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, dueDate: toDisplayDate(value) } : e)))
  }

  const handleView = (companyId: string, surveyType: DueEntry["surveyType"]) => {
    navigate(`/customer-success/due-date-followup/${companyId}?type=${surveyType}`)
  }

  const handleSendComment = () => {
    const trimmed = newComment.trim()
    if (!trimmed || !commentDialogCompanyId) return
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "admin",
      authorName: "Admin",
      text: trimmed,
      timestamp: new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      }),
    }
    setCommentsByCompany((prev) => ({
      ...prev,
      [commentDialogCompanyId]: [...(prev[commentDialogCompanyId] || []), comment],
    }))
    setNewComment("")
  }

  const activeCommentCompanyName = entries.find((e) => e.companyId === commentDialogCompanyId)?.companyName

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Success — Due Date Followup</h1>
            <p className="text-sm text-gray-600 mt-1">Equipment & training due dates — follow up before they lapse</p>
          </div>
          <Button className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946]/90 hover:to-[#FF8C00]/90 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by company, branch or contact…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 border-gray-300"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946] hover:to-[#FF8C00]">
                  <TableHead className="font-semibold text-white">Company Name</TableHead>
                  <TableHead className="font-semibold text-white">Branch Location</TableHead>
                  <TableHead className="font-semibold text-white">Product Type</TableHead>
                  <TableHead className="font-semibold text-white">Contact Details</TableHead>
                  <TableHead className="font-semibold text-white">Due Summary</TableHead>
                  <TableHead className="font-semibold text-white">Next Follow Up Date</TableHead>
                  <TableHead className="font-semibold text-white">Comment</TableHead>
                  <TableHead className="font-semibold text-white">Status</TableHead>
                  <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No due records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{entry.companyName}</TableCell>
                      <TableCell>{entry.branchLocation}</TableCell>
                      <TableCell>
                        <ProductTypeCell surveyType={entry.surveyType} />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                            {entry.contactPhone}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                            {entry.contactEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                          <span>Refill & HPT: {companyDueCounts[entry.companyId]?.refillHpt ?? 0}</span>
                          <span>Shelf Life: {companyDueCounts[entry.companyId]?.shelfLife ?? 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <input
                          type="date"
                          value={toInputDate(entry.dueDate)}
                          onChange={(e) => handleDueDateChange(entry.id, e.target.value)}
                          className="px-2 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#E63946] focus:border-[#E63946]"
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => { setCommentDialogCompanyId(entry.companyId); setNewComment("") }}
                          className="relative inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-gray-400 hover:text-[#E63946]" />
                          {(commentsByCompany[entry.companyId]?.length ?? 0) > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E63946] text-white text-[9px] font-bold flex items-center justify-center">
                              {commentsByCompany[entry.companyId]?.length ?? 0}
                            </span>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <FollowupStatusBadge date={entry.dueDate} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(entry.companyId, entry.surveyType)}
                          className="text-[#E63946] hover:text-[#E63946] hover:bg-[#E63946]/10"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={commentDialogCompanyId !== null} onOpenChange={(open) => !open && setCommentDialogCompanyId(null)}>
        <DialogContent className="max-w-lg flex flex-col p-0 gap-0" style={{ maxHeight: "85vh" }}>
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-[#E63946]" />
              Comments
              {activeCommentCompanyName && (
                <span className="text-xs font-normal text-gray-400 ml-1">· {activeCommentCompanyName}</span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto px-5 py-5 space-y-5 flex-1">
            {(commentDialogCompanyId ? commentsByCompany[commentDialogCompanyId] || [] : []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first to add one.</p>
            ) : (
              (commentsByCompany[commentDialogCompanyId!] || []).map((comment) => (
                <div key={comment.id} className={`flex gap-3 ${comment.author === "admin" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    comment.author === "admin" ? "bg-[#E63946] text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {comment.author === "admin" ? "A" : comment.authorName.charAt(0)}
                  </div>
                  <div className={`flex flex-col gap-1 max-w-[78%] ${comment.author === "admin" ? "items-end" : "items-start"}`}>
                    <div className={`flex items-center gap-2 ${comment.author === "admin" ? "flex-row-reverse" : ""}`}>
                      <span className="text-xs font-semibold text-gray-700">{comment.authorName}</span>
                      <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      comment.author === "admin"
                        ? "bg-[#E63946] text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}>
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
            <div className="flex gap-2 items-end">
              <Textarea
                placeholder="Write a reply…"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendComment() }
                }}
                className="resize-none text-sm bg-white border-gray-200 focus:border-[#E63946]/40"
                rows={2}
              />
              <Button
                onClick={handleSendComment}
                disabled={!newComment.trim()}
                className="h-10 w-10 p-0 shrink-0 bg-[#E63946] hover:bg-[#E63946]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
