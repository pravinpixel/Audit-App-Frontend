import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Building2, MapPin, User, Phone, Mail, MessageSquare, Send, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExtinguisherSurveyTable } from "@/components/extinguisher-survey-table"
import { TrainingSurveyTable } from "@/components/training-survey-table"
import type { AuditCompany, ExtinguisherSurvey, TrainingSurvey } from "@/types/audit"

interface Comment {
  id: string
  author: "customer" | "admin"
  authorName: string
  text: string
  timestamp: string
}

const mockComments: Comment[] = [
  {
    id: "c1",
    author: "customer",
    authorName: "Rajesh Kumar",
    text: "Please update the extinguisher refill date for LOC-001, we got it serviced last week.",
    timestamp: "12 Jan 2025, 10:30 AM",
  },
  {
    id: "c2",
    author: "admin",
    authorName: "Admin",
    text: "Noted. We will verify with the auditor and update the record shortly.",
    timestamp: "12 Jan 2025, 11:45 AM",
  },
  {
    id: "c3",
    author: "customer",
    authorName: "Rajesh Kumar",
    text: "Also, 2 extinguishers on the 3rd floor were serviced by a different vendor. Please check.",
    timestamp: "13 Jan 2025, 09:15 AM",
  },
  {
    id: "c4",
    author: "admin",
    authorName: "Admin",
    text: "Updated the vendor details. Kindly confirm if the shelf life dates in the survey are correct.",
    timestamp: "13 Jan 2025, 02:00 PM",
  },
]

export default function AuditDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [company, setCompany] = useState<AuditCompany | null>(null)
  const [extinguisherSurveys, setExtinguisherSurveys] = useState<ExtinguisherSurvey[]>([])
  const [trainingSurveys, setTrainingSurveys] = useState<TrainingSurvey[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [commentOpen, setCommentOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchAuditDetails()
  }, [params.id, navigate])

  const fetchAuditDetails = () => {
    // Mock company data
    const mockCompany: AuditCompany = {
      id: params.id as string,
      companyName: "Tech Solutions Pvt Ltd",
      industryType: "IT Services",
      branchLocation: "Bangalore - Koramangala",
      headOfficeLocation: "Bangalore",
      state: "Karnataka",
      city: "Bangalore",
      approvalsPending: 3,
      primaryContact: {
        name: "Rajesh Kumar",
        designation: "Safety Manager",
        mobile: "+91 98765 43210",
        email: "rajesh.kumar@techsolutions.com",
      },
    }

    const mockExtinguisherSurveys: ExtinguisherSurvey[] = [
      {
        id: "EXT001",
        companyId: params.id as string,
        auditorName: "John Smith",
        auditorPhone: "+91 98765 43210",
        auditorEmail: "john.smith@safetymatters.com",
        enquiryDateTime: "15-01-2025 10:30 AM",
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
        status: "Pending",
      },
      {
        id: "EXT002",
        companyId: params.id as string,
        auditorName: "Sarah Johnson",
        auditorPhone: "+91 87654 32109",
        auditorEmail: "sarah.johnson@safetymatters.com",
        enquiryDateTime: "14-01-2025 02:15 PM",
        customerLocationNo: "LOC-002",
        floorDetails: "First Floor",
        locationDetails: "Near Server Room",
        extinguisherType: "ABC Powder",
        capacity: "6 kg",
        brand: "SafeGuard",
        refillDueDate: "2025-07-10",
        hptDueDate: "2026-01-10",
        shelfLifeExpiry: "2028-03-15",
        productImage: "/red-fire-extinguisher.png",
        status: "Verified",
      },
      {
        id: "EXT003",
        companyId: params.id as string,
        auditorName: "Michael Brown",
        auditorPhone: "+91 76543 21098",
        auditorEmail: "michael.brown@safetymatters.com",
        enquiryDateTime: "13-01-2025 09:45 AM",
        customerLocationNo: "LOC-003",
        floorDetails: "Second Floor",
        locationDetails: "Conference Room A",
        extinguisherType: "Foam",
        capacity: "9 kg",
        brand: "FireStop",
        refillDueDate: "2025-05-20",
        hptDueDate: "2025-11-20",
        shelfLifeExpiry: "2027-12-10",
        productImage: "/red-fire-extinguisher.png",
        status: "Pending",
      },
      {
        id: "EXT004",
        companyId: params.id as string,
        auditorName: "Emily Davis",
        auditorPhone: "+91 65432 10987",
        auditorEmail: "emily.davis@safetymatters.com",
        enquiryDateTime: "12-01-2025 11:20 AM",
        customerLocationNo: "LOC-004",
        floorDetails: "Third Floor",
        locationDetails: "Cafeteria",
        extinguisherType: "Water",
        capacity: "9 L",
        brand: "SafeGuard",
        refillDueDate: "2025-08-05",
        hptDueDate: "2026-02-05",
        shelfLifeExpiry: "2028-06-30",
        productImage: "/red-fire-extinguisher.png",
        status: "Verified",
      },
      {
        id: "EXT005",
        companyId: params.id as string,
        auditorName: "Robert Wilson",
        auditorPhone: "+91 54321 09876",
        auditorEmail: "robert.wilson@safetymatters.com",
        enquiryDateTime: "11-01-2025 03:00 PM",
        customerLocationNo: "LOC-005",
        floorDetails: "Ground Floor",
        locationDetails: "Parking Area",
        extinguisherType: "ABC Powder",
        capacity: "4 kg",
        brand: "FireStop",
        refillDueDate: "2025-09-12",
        hptDueDate: "2026-03-12",
        shelfLifeExpiry: "2028-09-01",
        productImage: "/red-fire-extinguisher.png",
        status: "Pending",
      },
      {
        id: "EXT006",
        companyId: params.id as string,
        auditorName: "Lisa Anderson",
        auditorPhone: "+91 43210 98765",
        auditorEmail: "lisa.anderson@safetymatters.com",
        enquiryDateTime: "10-01-2025 04:30 PM",
        customerLocationNo: "LOC-006",
        floorDetails: "First Floor",
        locationDetails: "Electrical Room",
        extinguisherType: "CO2",
        capacity: "2 kg",
        brand: "SafeGuard",
        refillDueDate: "2025-04-18",
        hptDueDate: "2025-10-18",
        shelfLifeExpiry: "2027-11-25",
        productImage: "/red-fire-extinguisher.png",
        status: "Verified",
      },
      {
        id: "EXT007",
        companyId: params.id as string,
        auditorName: "David Martinez",
        auditorPhone: "+91 32109 87654",
        auditorEmail: "david.martinez@safetymatters.com",
        enquiryDateTime: "09-01-2025 10:00 AM",
        customerLocationNo: "LOC-007",
        floorDetails: "Second Floor",
        locationDetails: "Reception Area",
        extinguisherType: "Foam",
        capacity: "6 kg",
        brand: "FireStop",
        refillDueDate: "2025-07-25",
        hptDueDate: "2026-01-25",
        shelfLifeExpiry: "2028-04-20",
        productImage: "/red-fire-extinguisher.png",
        status: "Pending",
      },
      {
        id: "EXT008",
        companyId: params.id as string,
        auditorName: "Jennifer Taylor",
        auditorPhone: "+91 21098 76543",
        auditorEmail: "jennifer.taylor@safetymatters.com",
        enquiryDateTime: "08-01-2025 01:45 PM",
        customerLocationNo: "LOC-008",
        floorDetails: "Third Floor",
        locationDetails: "Storage Room",
        extinguisherType: "ABC Powder",
        capacity: "6 kg",
        brand: "SafeGuard",
        refillDueDate: "2025-06-30",
        hptDueDate: "2025-12-30",
        shelfLifeExpiry: "2028-02-15",
        productImage: "/red-fire-extinguisher.png",
        status: "Verified",
      },
    ]

    const mockTrainingSurveys: TrainingSurvey[] = [
      {
        id: "TRN001",
        companyId: params.id as string,
        auditorName: "Michael Chen",
        auditorPhone: "+91 76543 21098",
        auditorEmail: "michael.chen@safetymatters.com",
        trainingDateTime: "15-01-2025 09:00 AM",
        trainingTitle: "Fire Safety Basics",
        trainingDueDate: "2025-03-20",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Pending",
      },
      {
        id: "TRN002",
        companyId: params.id as string,
        auditorName: "Emily Davis",
        auditorPhone: "+91 65432 10987",
        auditorEmail: "emily.davis@safetymatters.com",
        trainingDateTime: "14-01-2025 02:00 PM",
        trainingTitle: "Emergency Evacuation Procedures",
        trainingDueDate: "2025-04-15",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Verified",
      },
      {
        id: "TRN003",
        companyId: params.id as string,
        auditorName: "Thomas Garcia",
        auditorPhone: "+91 54321 09876",
        auditorEmail: "thomas.garcia@safetymatters.com",
        trainingDateTime: "13-01-2025 10:30 AM",
        trainingTitle: "First Aid Training",
        trainingDueDate: "2025-05-10",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Pending",
      },
      {
        id: "TRN004",
        companyId: params.id as string,
        auditorName: "Amanda White",
        auditorPhone: "+91 43210 98765",
        auditorEmail: "amanda.white@safetymatters.com",
        trainingDateTime: "12-01-2025 11:00 AM",
        trainingTitle: "Hazard Communication",
        trainingDueDate: "2025-06-05",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Verified",
      },
      {
        id: "TRN005",
        companyId: params.id as string,
        auditorName: "Christopher Lee",
        auditorPhone: "+91 32109 87654",
        auditorEmail: "christopher.lee@safetymatters.com",
        trainingDateTime: "11-01-2025 03:30 PM",
        trainingTitle: "Personal Protective Equipment",
        trainingDueDate: "2025-07-12",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Pending",
      },
      {
        id: "TRN006",
        companyId: params.id as string,
        auditorName: "Patricia Martinez",
        auditorPhone: "+91 21098 76543",
        auditorEmail: "patricia.martinez@safetymatters.com",
        trainingDateTime: "10-01-2025 09:30 AM",
        trainingTitle: "Electrical Safety",
        trainingDueDate: "2025-08-18",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Verified",
      },
      {
        id: "TRN007",
        companyId: params.id as string,
        auditorName: "Daniel Thompson",
        auditorPhone: "+91 10987 65432",
        auditorEmail: "daniel.thompson@safetymatters.com",
        trainingDateTime: "09-01-2025 04:00 PM",
        trainingTitle: "Workplace Ergonomics",
        trainingDueDate: "2025-09-22",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Pending",
      },
      {
        id: "TRN008",
        companyId: params.id as string,
        auditorName: "Karen Robinson",
        auditorPhone: "+91 09876 54321",
        auditorEmail: "karen.robinson@safetymatters.com",
        trainingDateTime: "08-01-2025 11:15 AM",
        trainingTitle: "Chemical Safety Handling",
        trainingDueDate: "2025-10-08",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Verified",
      },
    ]

    setCompany(mockCompany)
    setExtinguisherSurveys(mockExtinguisherSurveys)
    setTrainingSurveys(mockTrainingSurveys)
  }

  const handleApproveExtinguisher = (id: string) => {
    setExtinguisherSurveys(
      extinguisherSurveys.map((survey) => (survey.id === id ? { ...survey, status: "Verified" } : survey)),
    )
  }

  const handleBulkApproveExtinguisher = (ids: string[]) => {
    setExtinguisherSurveys(
      extinguisherSurveys.map((survey) => (ids.includes(survey.id) ? { ...survey, status: "Verified" } : survey)),
    )
  }

  const handleApproveTraining = (id: string) => {
    setTrainingSurveys(trainingSurveys.map((survey) => (survey.id === id ? { ...survey, status: "Verified" } : survey)))
  }

  const handleBulkApproveTraining = (ids: string[]) => {
    setTrainingSurveys(
      trainingSurveys.map((survey) => (ids.includes(survey.id) ? { ...survey, status: "Verified" } : survey)),
    )
  }

  const handleUpdateExtinguisher = (id: string, updatedData: Partial<ExtinguisherSurvey>) => {
    setExtinguisherSurveys(
      extinguisherSurveys.map((survey) =>
        survey.id === id ? { ...survey, ...updatedData, status: "Pending" } : survey,
      ),
    )
  }

  const handleUpdateTraining = (id: string, updatedData: Partial<TrainingSurvey>) => {
    setTrainingSurveys(
      trainingSurveys.map((survey) => (survey.id === id ? { ...survey, ...updatedData, status: "Pending" } : survey)),
    )
  }

  const handleDeleteExtinguisher = (id: string) => {
    if (confirm("Are you sure you want to delete this survey?")) {
      setExtinguisherSurveys(extinguisherSurveys.filter((survey) => survey.id !== id))
    }
  }

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

  const handleDeleteTraining = (id: string) => {
    if (confirm("Are you sure you want to delete this survey?")) {
      setTrainingSurveys(trainingSurveys.filter((survey) => survey.id !== id))
    }
  }

  const filteredExtinguisherSurveys =
    statusFilter === "All" ? extinguisherSurveys : extinguisherSurveys.filter((s) => s.status === statusFilter)

  const filteredTrainingSurveys =
    statusFilter === "All" ? trainingSurveys : trainingSurveys.filter((s) => s.status === statusFilter)

  if (!company) {
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
            onClick={() => navigate(`/audits`)}
            className="mb-4 -ml-2 hover:bg-[#E63946] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold text-gray-900">Audit Details</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage audit survey forms</p>
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
              {company.primaryContact ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-full bg-[#E63946]/10 flex items-center justify-center shrink-0 text-sm font-bold text-[#E63946]">
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
              ) : (
                <p className="text-xs text-gray-400">No contact assigned.</p>
              )}
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
                  placeholder="Write a reply..."
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
          <Tabs defaultValue="extinguisher" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="bg-gray-100">
                <TabsTrigger
                  value="extinguisher"
                  className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white"
                >
                  Extinguisher Survey Form
                </TabsTrigger>
                <TabsTrigger
                  value="training"
                  className="data-[state=active]:bg-[#E63946] data-[state=active]:text-white"
                >
                  Training Survey Form
                </TabsTrigger>
              </TabsList>

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

            <TabsContent value="extinguisher">
              <ExtinguisherSurveyTable
                surveys={filteredExtinguisherSurveys}
                onApprove={handleApproveExtinguisher}
                onBulkApprove={handleBulkApproveExtinguisher}
                onUpdate={handleUpdateExtinguisher}
                onDelete={handleDeleteExtinguisher}
              />
            </TabsContent>

            <TabsContent value="training">
              <TrainingSurveyTable
                surveys={filteredTrainingSurveys}
                onApprove={handleApproveTraining}
                onBulkApprove={handleBulkApproveTraining}
                onUpdate={handleUpdateTraining}
                onDelete={handleDeleteTraining}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
