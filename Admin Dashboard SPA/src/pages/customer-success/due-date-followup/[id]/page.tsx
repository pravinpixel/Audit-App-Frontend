import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ExtinguisherSurveyTable } from "@/components/extinguisher-survey-table"
import { TrainingSurveyTable } from "@/components/training-survey-table"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react"
import type { ExtinguisherSurvey, TrainingSurvey } from "@/types/audit"

interface Comment {
  id: string
  author: "customer" | "admin"
  authorName: string
  text: string
  timestamp: string
}

interface CompanyProfile {
  companyName: string
  industryType: string
  branchLocation: string
  city: string
  primaryContact: {
    name: string
    designation: string
    mobile: string
    email: string
  }
}

const mockCompanies: Record<string, CompanyProfile> = {
  "1": {
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    city: "Bangalore",
    primaryContact: { name: "Rahul Sharma", designation: "Facility Manager", mobile: "+91 98765 11111", email: "rahul.sharma@techsolutions.com" },
  },
  "2": {
    companyName: "Global Manufacturing Co",
    industryType: "Manufacturing",
    branchLocation: "Pune Branch",
    city: "Pune",
    primaryContact: { name: "Priya Patel", designation: "Plant Manager", mobile: "+91 98765 22222", email: "priya.patel@globalmanufacturing.com" },
  },
  "3": {
    companyName: "Sunrise Industries",
    industryType: "Chemicals",
    branchLocation: "Connaught Place, Delhi",
    city: "New Delhi",
    primaryContact: { name: "Amit Kumar", designation: "Safety Officer", mobile: "+91 98765 33333", email: "amit.kumar@sunriseindustries.com" },
  },
  "5": {
    companyName: "Prime Retail Group",
    industryType: "Retail",
    branchLocation: "Banjara Hills, Hyderabad",
    city: "Hyderabad",
    primaryContact: { name: "Vikram Singh", designation: "Store Manager", mobile: "+91 98765 55555", email: "vikram.singh@primeretailgroup.com" },
  },
  "6": {
    companyName: "Bharat Steel Works",
    industryType: "Manufacturing",
    branchLocation: "Ring Road, Surat",
    city: "Surat",
    primaryContact: { name: "Rajesh Mehta", designation: "Safety Officer", mobile: "+91 98765 66666", email: "rajesh.mehta@bharatsteel.com" },
  },
  "7": {
    companyName: "Coastal Pharma Ltd",
    industryType: "Pharma",
    branchLocation: "MG Road, Kochi",
    city: "Kochi",
    primaryContact: { name: "Ananya Nair", designation: "Facility Manager", mobile: "+91 98765 77777", email: "ananya.nair@coastalpharma.com" },
  },
  "11": {
    companyName: "Eastern Cement Co",
    industryType: "Construction",
    branchLocation: "Bhubaneswar Branch",
    city: "Bhubaneswar",
    primaryContact: { name: "Sanjay Das", designation: "Safety Officer", mobile: "+91 98766 11111", email: "sanjay.das@easterncement.com" },
  },
  "12": {
    companyName: "Skyline Aviation Services",
    industryType: "Aviation",
    branchLocation: "Airport Road, Bangalore",
    city: "Bangalore",
    primaryContact: { name: "Karthik Reddy", designation: "Facility Manager", mobile: "+91 98111 22334", email: "karthik.reddy@skylineaviation.com" },
  },
  "13": {
    companyName: "Greenfield Agro Exports",
    industryType: "Agriculture",
    branchLocation: "MIDC, Nashik",
    city: "Nashik",
    primaryContact: { name: "Meenal Kulkarni", designation: "Facility Manager", mobile: "+91 98222 33445", email: "meenal.kulkarni@greenfieldagro.com" },
  },
  "14": {
    companyName: "Horizon Textiles Ltd",
    industryType: "Textiles",
    branchLocation: "Tirupur Road, Coimbatore",
    city: "Coimbatore",
    primaryContact: { name: "Ganesh Murthy", designation: "Facility Manager", mobile: "+91 98333 44556", email: "ganesh.murthy@horizontextiles.com" },
  },
}

const mockCommentsByCompany: Record<string, Comment[]> = {
  "1": [
    { id: "c1", author: "customer", authorName: "Rahul Sharma", text: "Please update the extinguisher refill date for LOC-001, we got it serviced last week.", timestamp: "12 Jan 2025, 10:30 AM" },
    { id: "c2", author: "admin", authorName: "Admin", text: "Noted. We will verify with the auditor and update the record shortly.", timestamp: "12 Jan 2025, 11:45 AM" },
  ],
}

export default function DueDateFollowupEditPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [extinguisherSurveys, setExtinguisherSurveys] = useState<ExtinguisherSurvey[]>([])
  const [trainingSurveys, setTrainingSurveys] = useState<TrainingSurvey[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("All")

  const viewedSurveyType = searchParams.get("type") === "training" ? "training" : "extinguisher"
  const companyId = params.id as string
  const company = mockCompanies[companyId] ?? Object.values(mockCompanies)[0]
  const [commentOpen, setCommentOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(mockCommentsByCompany[companyId] ?? [])
  const [newComment, setNewComment] = useState("")

  const handleSendComment = () => {
    const trimmed = newComment.trim()
    if (!trimmed) return
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
    setComments((prev) => [...prev, comment])
    setNewComment("")
  }

  useEffect(() => {
    const id = params.id as string

    const mockExtinguisherSurveys: ExtinguisherSurvey[] = [
      { id: "EXT001", companyId: id, auditorName: "Rahul Sharma", auditorPhone: "+91 98765 11111", auditorEmail: "rahul@example.com", enquiryDateTime: "10-09-2025 10:30 AM", customerLocationNo: "LOC-001", floorDetails: "Ground Floor", locationDetails: "Near Main Entrance", extinguisherType: "CO2", capacity: "5 kg", brand: "FireStop", refillDueDate: "2026-07-15", hptDueDate: "2026-12-15", shelfLifeExpiry: "2030-01-20", productImage: "/red-fire-extinguisher.png", status: "Pending" },
      { id: "EXT002", companyId: id, auditorName: "Priya Patel", auditorPhone: "+91 98765 22222", auditorEmail: "priya@example.com", enquiryDateTime: "14-10-2025 02:15 PM", customerLocationNo: "LOC-002", floorDetails: "First Floor", locationDetails: "Near Server Room", extinguisherType: "ABC Powder", capacity: "6 kg", brand: "SafeGuard", refillDueDate: "2026-08-10", hptDueDate: "2027-02-10", shelfLifeExpiry: "2030-03-15", productImage: "/red-fire-extinguisher.png", status: "Verified" },
      { id: "EXT003", companyId: id, auditorName: "Amit Kumar", auditorPhone: "+91 98765 33333", auditorEmail: "amit@example.com", enquiryDateTime: "13-08-2025 09:45 AM", customerLocationNo: "LOC-003", floorDetails: "Second Floor", locationDetails: "Conference Room A", extinguisherType: "Foam", capacity: "9 L", brand: "FireStop", refillDueDate: "2026-06-10", hptDueDate: "2026-11-20", shelfLifeExpiry: "2027-12-10", productImage: "/red-fire-extinguisher.png", status: "Pending" },
      { id: "EXT004", companyId: id, auditorName: "Sneha Reddy", auditorPhone: "+91 98765 44444", auditorEmail: "sneha@example.com", enquiryDateTime: "12-11-2025 11:20 AM", customerLocationNo: "LOC-004", floorDetails: "Third Floor", locationDetails: "Cafeteria", extinguisherType: "Water", capacity: "9 L", brand: "SafeGuard", refillDueDate: "2026-09-05", hptDueDate: "2027-03-05", shelfLifeExpiry: "2030-06-30", productImage: "/red-fire-extinguisher.png", status: "Verified" },
      { id: "EXT005", companyId: id, auditorName: "Kiran Rao", auditorPhone: "+91 98765 55555", auditorEmail: "kiran@example.com", enquiryDateTime: "10-07-2025 09:00 AM", customerLocationNo: "LOC-005", floorDetails: "Basement", locationDetails: "Storage Room", extinguisherType: "CO2", capacity: "5 kg", brand: "Ceasefire", refillDueDate: "2026-06-10", hptDueDate: "2027-03-10", shelfLifeExpiry: "2030-03-10", productImage: "/red-fire-extinguisher.png", status: "Pending" },
      { id: "EXT006", companyId: id, auditorName: "Meena Krishnan", auditorPhone: "+91 98765 66666", auditorEmail: "meena@example.com", enquiryDateTime: "05-12-2025 11:30 AM", customerLocationNo: "LOC-006", floorDetails: "Fourth Floor", locationDetails: "IT Lab", extinguisherType: "DCP", capacity: "9 kg", brand: "SafeGuard", refillDueDate: "2026-07-18", hptDueDate: "2026-06-20", shelfLifeExpiry: "2028-09-15", productImage: "/red-fire-extinguisher.png", status: "Verified" },
      { id: "EXT007", companyId: id, auditorName: "Arjun Nair", auditorPhone: "+91 98765 77777", auditorEmail: "arjun@example.com", enquiryDateTime: "18-06-2025 02:00 PM", customerLocationNo: "LOC-007", floorDetails: "Ground Floor", locationDetails: "Reception Area", extinguisherType: "Foam", capacity: "6 L", brand: "FireStop", refillDueDate: "2026-08-25", hptDueDate: "2026-07-08", shelfLifeExpiry: "2026-05-30", productImage: "/red-fire-extinguisher.png", status: "Pending" },
      { id: "EXT008", companyId: id, auditorName: "Divya Menon", auditorPhone: "+91 98765 88888", auditorEmail: "divya@example.com", enquiryDateTime: "22-01-2026 10:15 AM", customerLocationNo: "LOC-008", floorDetails: "Fifth Floor", locationDetails: "Board Room", extinguisherType: "Water", capacity: "9 L", brand: "Naffco", refillDueDate: "2026-06-23", hptDueDate: "2027-01-15", shelfLifeExpiry: "2029-03-20", productImage: "/red-fire-extinguisher.png", status: "Verified" },
      { id: "EXT009", companyId: id, auditorName: "Suresh Pillai", auditorPhone: "+91 98765 99999", auditorEmail: "suresh@example.com", enquiryDateTime: "08-05-2025 03:45 PM", customerLocationNo: "LOC-009", floorDetails: "Basement 2", locationDetails: "Parking Level", extinguisherType: "CO2", capacity: "2 kg", brand: "Ceasefire", refillDueDate: "2026-10-12", hptDueDate: "2026-06-18", shelfLifeExpiry: "2026-06-15", productImage: "/red-fire-extinguisher.png", status: "Pending" },
      { id: "EXT010", companyId: id, auditorName: "Pooja Iyer", auditorPhone: "+91 98766 10101", auditorEmail: "pooja@example.com", enquiryDateTime: "14-02-2026 09:30 AM", customerLocationNo: "LOC-010", floorDetails: "Second Floor", locationDetails: "Chemical Lab", extinguisherType: "ABC Powder", capacity: "6 kg", brand: "SafeGuard", refillDueDate: "2026-07-05", hptDueDate: "2026-09-01", shelfLifeExpiry: "2028-11-10", productImage: "/red-fire-extinguisher.png", status: "Verified" },
    ]

    const mockTrainingSurveys: TrainingSurvey[] = [
      { id: "TRN001", companyId: id, auditorName: "Michael Chen", auditorPhone: "+91 76543 21098", auditorEmail: "michael.chen@safetymatters.com", trainingDateTime: "15-01-2025 09:00 AM", trainingTitle: "Fire Safety Basics", trainingDueDate: "2025-03-20", trainingGivenBy: "Safety Matters Training Dept", status: "Pending" },
      { id: "TRN002", companyId: id, auditorName: "Emily Davis", auditorPhone: "+91 65432 10987", auditorEmail: "emily.davis@safetymatters.com", trainingDateTime: "14-01-2025 02:00 PM", trainingTitle: "Emergency Evacuation Procedures", trainingDueDate: "2025-04-15", trainingGivenBy: "Safety Matters Training Dept", status: "Verified" },
      { id: "TRN003", companyId: id, auditorName: "Thomas Garcia", auditorPhone: "+91 54321 09876", auditorEmail: "thomas.garcia@safetymatters.com", trainingDateTime: "13-01-2025 10:30 AM", trainingTitle: "First Aid Training", trainingDueDate: "2025-05-10", trainingGivenBy: "Safety Matters Training Dept", status: "Pending" },
      { id: "TRN004", companyId: id, auditorName: "Amanda White", auditorPhone: "+91 43210 98765", auditorEmail: "amanda.white@safetymatters.com", trainingDateTime: "12-01-2025 11:00 AM", trainingTitle: "Hazard Communication", trainingDueDate: "2025-06-05", trainingGivenBy: "Safety Matters Training Dept", status: "Verified" },
      { id: "TRN005", companyId: id, auditorName: "Christopher Lee", auditorPhone: "+91 32109 87654", auditorEmail: "christopher.lee@safetymatters.com", trainingDateTime: "11-01-2025 03:30 PM", trainingTitle: "Personal Protective Equipment", trainingDueDate: "2025-07-12", trainingGivenBy: "Safety Matters Training Dept", status: "Pending" },
      { id: "TRN006", companyId: id, auditorName: "Patricia Martinez", auditorPhone: "+91 21098 76543", auditorEmail: "patricia.martinez@safetymatters.com", trainingDateTime: "10-01-2025 09:30 AM", trainingTitle: "Electrical Safety", trainingDueDate: "2025-08-18", trainingGivenBy: "Safety Matters Training Dept", status: "Verified" },
      { id: "TRN007", companyId: id, auditorName: "Daniel Thompson", auditorPhone: "+91 10987 65432", auditorEmail: "daniel.thompson@safetymatters.com", trainingDateTime: "09-01-2025 04:00 PM", trainingTitle: "Workplace Ergonomics", trainingDueDate: "2025-09-22", trainingGivenBy: "Safety Matters Training Dept", status: "Pending" },
      { id: "TRN008", companyId: id, auditorName: "Karen Robinson", auditorPhone: "+91 09876 54321", auditorEmail: "karen.robinson@safetymatters.com", trainingDateTime: "08-01-2025 11:15 AM", trainingTitle: "Chemical Safety Handling", trainingDueDate: "2025-10-08", trainingGivenBy: "Safety Matters Training Dept", status: "Verified" },
    ]

    setExtinguisherSurveys(mockExtinguisherSurveys)
    setTrainingSurveys(mockTrainingSurveys)
  }, [params.id])

  const handleApproveExtinguisher = (id: string) => {
    setExtinguisherSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Verified" } : s)))
  }

  const handleBulkApproveExtinguisher = (ids: string[]) => {
    setExtinguisherSurveys((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, status: "Verified" } : s)))
  }

  const handleApproveTraining = (id: string) => {
    setTrainingSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, status: "Verified" } : s)))
  }

  const handleBulkApproveTraining = (ids: string[]) => {
    setTrainingSurveys((prev) => prev.map((s) => (ids.includes(s.id) ? { ...s, status: "Verified" } : s)))
  }

  const handleUpdateExtinguisher = (id: string, updatedData: Partial<ExtinguisherSurvey>) => {
    setExtinguisherSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData, status: "Pending" } : s)))
  }

  const handleUpdateTraining = (id: string, updatedData: Partial<TrainingSurvey>) => {
    setTrainingSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData, status: "Pending" } : s)))
  }

  const handleDeleteExtinguisher = (id: string) => {
    if (confirm("Are you sure you want to delete this survey?")) {
      setExtinguisherSurveys((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const handleDeleteTraining = (id: string) => {
    if (confirm("Are you sure you want to delete this survey?")) {
      setTrainingSurveys((prev) => prev.filter((s) => s.id !== id))
    }
  }

  const filteredExtinguisherSurveys =
    statusFilter === "All" ? extinguisherSurveys : extinguisherSurveys.filter((s) => s.status === statusFilter)

  const filteredTrainingSurveys =
    statusFilter === "All" ? trainingSurveys : trainingSurveys.filter((s) => s.status === statusFilter)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/customer-success/due-date-followup")}
            className="mb-4 -ml-2 hover:bg-[#E63946] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Due Date Followup
          </Button>

          <h1 className="text-2xl font-bold text-gray-900">{company.companyName}</h1>
          <p className="text-sm text-gray-600 mt-1">Equipment & training due date management</p>
        </div>

        {/* Info Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Company banner */}
          <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-100">
            <div className="h-10 w-10 rounded-lg bg-[#E63946]/10 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-[#E63946]" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-gray-900">{company.companyName}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3 text-[#E63946]" />
                  {company.branchLocation}
                </span>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  {company.city}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom two-panel: contact left, comments right */}
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            {/* Primary Contact */}
            <div className="px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Primary Contact</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-[#E63946]/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#E63946]">
                    {company.primaryContact.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{company.primaryContact.name}</p>
                    <p className="text-xs text-gray-500">{company.primaryContact.designation}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pl-0.5">
                  <span className="inline-flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    {company.primaryContact.mobile}
                  </span>
                  <span className="inline-flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    {company.primaryContact.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Comments panel */}
            <div className="px-6 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Comments</p>
                <button
                  onClick={() => setCommentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E63946]/10 hover:bg-[#E63946]/20 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#E63946]" />
                  <span className="text-xs font-semibold text-[#E63946]">{comments.length}</span>
                </button>
              </div>

              {comments.length > 0 ? (
                <button
                  onClick={() => setCommentOpen(true)}
                  className="flex items-start gap-2.5 text-left group"
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    comments[comments.length - 1].author === "admin"
                      ? "bg-[#E63946] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {comments[comments.length - 1].author === "admin" ? "A" : comments[comments.length - 1].authorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-gray-700">{comments[comments.length - 1].authorName}</span>
                      <span className="text-[10px] text-gray-400">{comments[comments.length - 1].timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                      {comments[comments.length - 1].text}
                    </p>
                  </div>
                </button>
              ) : (
                <p className="text-xs text-gray-400">No comments yet.</p>
              )}

              <button
                onClick={() => setCommentOpen(true)}
                className="self-start text-xs text-[#E63946] hover:underline font-medium mt-auto"
              >
                View all & reply →
              </button>
            </div>
          </div>
        </div>

        {/* Comment Dialog */}
        <Dialog open={commentOpen} onOpenChange={setCommentOpen}>
          <DialogContent className="max-w-lg flex flex-col p-0 gap-0" style={{ maxHeight: "85vh" }}>
            <DialogHeader className="px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
              <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
                <MessageSquare className="h-4 w-4 text-[#E63946]" />
                Comments
                <span className="text-xs font-normal text-gray-400 ml-1">· {company.companyName}</span>
              </DialogTitle>
            </DialogHeader>

            {/* Thread */}
            <div className="overflow-y-auto px-5 py-5 space-y-5 flex-1">
              {comments.map((comment) => (
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
              ))}
            </div>

            {/* Input */}
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              {viewedSurveyType === "training" ? "Training Survey Form" : "Extinguisher Survey Form"}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {viewedSurveyType === "training" ? (
            <TrainingSurveyTable
              surveys={filteredTrainingSurveys}
              onApprove={handleApproveTraining}
              onBulkApprove={handleBulkApproveTraining}
              onUpdate={handleUpdateTraining}
              onDelete={handleDeleteTraining}
              editOnly
            />
          ) : (
            <ExtinguisherSurveyTable
              surveys={filteredExtinguisherSurveys}
              onApprove={handleApproveExtinguisher}
              onBulkApprove={handleBulkApproveExtinguisher}
              onUpdate={handleUpdateExtinguisher}
              onDelete={handleDeleteExtinguisher}
              editOnly
              showBulkDetails
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
