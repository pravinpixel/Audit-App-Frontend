import { useState } from "react"
import { CheckCircle, XCircle, Download, Eye, History, Send, FileEdit, User, Clock, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import type { ExtinguisherSurvey } from "@/types/audit"

interface ActivityLogEntry {
  id: string
  type: "enquiry_sent" | "field_updated" | "status_changed" | "created"
  title: string
  description: string
  changes?: { field: string; oldValue: string; newValue: string }[]
  user: string
  timestamp: string
}

interface ChangeRequestInfo {
  field: string
  from: string
  to: string
  moveToScrap?: boolean
  comment: string
  requestedBy: string
  requestedOn: string
}

interface ExtinguisherSurveyTableProps {
  surveys: ExtinguisherSurvey[]
  onApprove: (id: string) => void
  onBulkApprove?: (ids: string[]) => void
  onReject?: (id: string, comment?: string) => void
  onUpdate: (id: string, data: Partial<ExtinguisherSurvey>) => void
  onDelete: (id: string) => void
  showApprove?: boolean
  changeRequestByLocation?: Record<string, ChangeRequestInfo>
  hideStatusColumn?: boolean
  hideCommentColumn?: boolean
  changeRequestMode?: boolean
  editOnly?: boolean
  showReject?: boolean
  showBulkDetails?: boolean
}

// Sample activity log data for demonstration
const sampleActivityLogs: Record<string, ActivityLogEntry[]> = {
  "EXT001": [
    {
      id: "log-1",
      type: "enquiry_sent",
      title: "Enquiry Sent",
      description: "Service enquiry submitted for refill and HPT due",
      user: "Rahul Sharma",
      timestamp: "15-01-2025 10:30 AM"
    },
    {
      id: "log-2",
      type: "field_updated",
      title: "Field Updated",
      description: "Extinguisher details modified",
      changes: [
        { field: "Brand", oldValue: "Minimax", newValue: "Ceasefire" },
        { field: "Refill & HPT Due On", oldValue: "Oct 2025", newValue: "Nov-2025" }
      ],
      user: "Priya Patel",
      timestamp: "12-01-2025 03:45 PM"
    },
    {
      id: "log-3",
      type: "field_updated",
      title: "Field Updated",
      description: "Location details updated",
      changes: [
        { field: "Floor Details", oldValue: "First Floor", newValue: "Ground Floor" }
      ],
      user: "Amit Kumar",
      timestamp: "09-01-2025 11:20 AM"
    },
    {
      id: "log-4",
      type: "created",
      title: "Record Created",
      description: "Extinguisher survey record created",
      user: "System",
      timestamp: "05-01-2025 09:00 AM"
    }
  ],
  "EXT002": [
    {
      id: "log-5",
      type: "status_changed",
      title: "Status Changed",
      description: "Survey status updated",
      changes: [
        { field: "Status", oldValue: "Pending", newValue: "Verified" }
      ],
      user: "Admin User",
      timestamp: "14-01-2025 02:15 PM"
    },
    {
      id: "log-6",
      type: "created",
      title: "Record Created",
      description: "Extinguisher survey record created",
      user: "System",
      timestamp: "10-01-2025 10:00 AM"
    }
  ],
  "EXT003": [
    {
      id: "log-7",
      type: "field_updated",
      title: "Field Updated",
      description: "Capacity details modified",
      changes: [
        { field: "Capacity", oldValue: "6 kg", newValue: "9 kg" },
        { field: "Extinguisher Type", oldValue: "ABC Powder", newValue: "Foam" }
      ],
      user: "Sarah Johnson",
      timestamp: "10-01-2025 02:30 PM"
    },
    {
      id: "log-8",
      type: "created",
      title: "Record Created",
      description: "Extinguisher survey record created",
      user: "System",
      timestamp: "08-01-2025 11:00 AM"
    }
  ],
  "EXT004": [
    {
      id: "log-9",
      type: "status_changed",
      title: "Status Changed",
      description: "Survey verified and approved",
      changes: [
        { field: "Status", oldValue: "Pending", newValue: "Verified" }
      ],
      user: "Admin User",
      timestamp: "12-01-2025 04:00 PM"
    },
    {
      id: "log-10",
      type: "enquiry_sent",
      title: "Enquiry Sent",
      description: "Maintenance enquiry sent to vendor",
      user: "Emily Davis",
      timestamp: "11-01-2025 10:15 AM"
    },
    {
      id: "log-11",
      type: "created",
      title: "Record Created",
      description: "Extinguisher survey record created",
      user: "System",
      timestamp: "09-01-2025 09:30 AM"
    }
  ],
  "EXT005": [
    {
      id: "log-12",
      type: "field_updated",
      title: "Field Updated",
      description: "Location details updated",
      changes: [
        { field: "Location Details", oldValue: "Storage Room", newValue: "Warehouse Section B" }
      ],
      user: "Robert Wilson",
      timestamp: "13-01-2025 11:45 AM"
    },
    {
      id: "log-13",
      type: "created",
      title: "Record Created",
      description: "Extinguisher survey record created",
      user: "System",
      timestamp: "07-01-2025 10:00 AM"
    }
  ]
}

interface SurveyComment {
  id: string
  author: "customer" | "admin"
  authorName: string
  text: string
  timestamp: string
}

const initialSurveyComments: Record<string, SurveyComment[]> = {
  EXT001: [
    { id: "sc1", author: "customer", authorName: "Rajesh Kumar", text: "This extinguisher was serviced last week by our vendor.", timestamp: "20 Jan 2025, 10:00 AM" },
    { id: "sc2", author: "admin", authorName: "Admin", text: "Noted, will verify and update the refill date.", timestamp: "20 Jan 2025, 11:30 AM" },
  ],
  EXT003: [
    { id: "sc3", author: "customer", authorName: "Rajesh Kumar", text: "Please check capacity — it may be 6 kg, not 9 kg.", timestamp: "14 Jan 2025, 02:00 PM" },
  ],
}

function getDaysFromNow(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function DueBadge({ label, days }: { label: string; days: number }) {
  if (days < 0) {
    return (
      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 whitespace-nowrap">
        {label} overdue {Math.abs(days)}d
      </span>
    )
  }
  return (
    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600 whitespace-nowrap">
      {label} in {days}d
    </span>
  )
}

function ChangeRequestCard({ field, from, to, moveToScrap, comment, requestedBy, requestedOn }: ChangeRequestInfo) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 space-y-2">
      <span className="block text-xs font-semibold text-gray-700">{field}</span>
      {moveToScrap ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
          Move to Scrap
        </span>
      ) : (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-xs font-mono">{from}</span>
          <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
          <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 text-xs font-mono">{to}</span>
        </div>
      )}
      <p className="text-sm text-gray-700">Change requested: {comment}</p>
      <p className="text-[10px] text-gray-400">Requested by {requestedBy} · {requestedOn}</p>
    </div>
  )
}

type BulkChangeType = "refillHpt" | "shelfLife" | "scrap"

function getRequestType(info: ChangeRequestInfo): BulkChangeType | "other" {
  if (info.moveToScrap) return "scrap"
  if (info.field === "Refill & HPT Due Date") return "refillHpt"
  if (info.field === "Shelf Life Expiry") return "shelfLife"
  return "other"
}

function RequestTypeCell({ field, from, to, moveToScrap }: ChangeRequestInfo) {
  if (moveToScrap) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold whitespace-nowrap">
        Move to Scrap
      </span>
    )
  }
  return (
    <div className="rounded-md border border-red-200 bg-red-50/50 px-1.5 py-1 space-y-0.5 min-w-[110px] w-fit">
      <span className="block text-[10px] font-semibold text-gray-700 leading-tight whitespace-nowrap">{field}</span>
      <div className="flex items-center gap-0.5 whitespace-nowrap">
        <span className="text-[9px] font-mono font-semibold text-red-600 leading-tight">{from}</span>
        <ArrowRight className="h-2 w-2 text-gray-400 flex-shrink-0" />
        <span className="text-[9px] font-mono font-semibold text-green-600 leading-tight">{to}</span>
      </div>
    </div>
  )
}


export function ExtinguisherSurveyTable({ surveys, onApprove, onBulkApprove, onReject, onUpdate, onDelete, showApprove = false, changeRequestByLocation, hideStatusColumn = false, hideCommentColumn = false, changeRequestMode = false, editOnly = false, showReject = false, showBulkDetails = false }: ExtinguisherSurveyTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState<ExtinguisherSurvey | null>(null)
  const [formData, setFormData] = useState<Partial<ExtinguisherSurvey>>({})
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)
  const [surveyToApprove, setSurveyToApprove] = useState<string | null>(null)
  const [bulkApproveConfirmOpen, setBulkApproveConfirmOpen] = useState(false)
  const [bulkFieldSelection, setBulkFieldSelection] = useState<("refillHpt" | "shelfLife")[]>([])
  const [bulkRefillDueDate, setBulkRefillDueDate] = useState("")
  const [bulkShelfLifeExpiry, setBulkShelfLifeExpiry] = useState("")
  const [bulkChangeTypeSelection, setBulkChangeTypeSelection] = useState<BulkChangeType[]>([])
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false)
  const [surveyToReject, setSurveyToReject] = useState<string | null>(null)
  const [rejectComment, setRejectComment] = useState("")
  const [activityLogOpen, setActivityLogOpen] = useState(false)
  const [selectedSurveyForLog, setSelectedSurveyForLog] = useState<string | null>(null)
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<{ url: string; surveyId: string } | null>(null)
  const [surveyComments, setSurveyComments] = useState<Record<string, SurveyComment[]>>(initialSurveyComments)
  const [commentDialogSurveyId, setCommentDialogSurveyId] = useState<string | null>(null)
  const [newSurveyComment, setNewSurveyComment] = useState("")

  const handleOpenComment = (surveyId: string) => {
    setCommentDialogSurveyId(surveyId)
    setNewSurveyComment("")
  }

  const handleSendSurveyComment = () => {
    const trimmed = newSurveyComment.trim()
    if (!trimmed || !commentDialogSurveyId) return
    const comment: SurveyComment = {
      id: `sc${Date.now()}`,
      author: "admin",
      authorName: "Admin",
      text: trimmed,
      timestamp: new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      }),
    }
    setSurveyComments((prev) => ({
      ...prev,
      [commentDialogSurveyId]: [...(prev[commentDialogSurveyId] || []), comment],
    }))
    setNewSurveyComment("")
  }

  const handleViewActivityLog = (surveyId: string) => {
    setSelectedSurveyForLog(surveyId)
    setActivityLogOpen(true)
  }

  const getActivityLogs = (surveyId: string): ActivityLogEntry[] => {
    return sampleActivityLogs[surveyId] || [
      {
        id: "default-log",
        type: "created",
        title: "Record Created",
        description: "Extinguisher survey record created",
        user: "System",
        timestamp: "01-01-2025 09:00 AM"
      }
    ]
  }

  const getActivityIcon = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "enquiry_sent":
        return <Send className="h-4 w-4 text-orange-500" />
      case "field_updated":
        return <FileEdit className="h-4 w-4 text-blue-500" />
      case "status_changed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "created":
        return <History className="h-4 w-4 text-gray-500" />
      default:
        return <History className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "enquiry_sent":
        return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">Enquiry Sent</Badge>
      case "field_updated":
        return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Field Updated</Badge>
      case "status_changed":
        return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">Status Changed</Badge>
      case "created":
        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">Created</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const pendingSurveys = surveys.filter(s => s.status === "Pending")
  const allPendingSelected = pendingSurveys.length > 0 && pendingSurveys.every(s => selectedIds.includes(s.id))
  const allSelected = pendingSurveys.length > 0 && pendingSurveys.every(s => selectedIds.includes(s.id))

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(pendingSurveys.map(s => s.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    }
  }

  const handleBulkApproveClick = () => {
    if (selectedIds.length > 0) {
      setBulkFieldSelection([])
      setBulkRefillDueDate("")
      setBulkShelfLifeExpiry("")
      setBulkChangeTypeSelection([])
      setBulkApproveConfirmOpen(true)
    }
  }

  const toggleBulkField = (field: "refillHpt" | "shelfLife", checked: boolean) => {
    setBulkFieldSelection((prev) => (checked ? [...prev, field] : prev.filter((f) => f !== field)))
    if (field === "refillHpt" && !checked) setBulkRefillDueDate("")
    if (field === "shelfLife" && !checked) setBulkShelfLifeExpiry("")
  }

  const toggleBulkChangeType = (type: BulkChangeType, checked: boolean) => {
    setBulkChangeTypeSelection((prev) => (checked ? [...prev, type] : prev.filter((t) => t !== type)))
  }

  const getMatchingChangeRequestIds = () => {
    if (!changeRequestByLocation) return []
    return selectedIds.filter((id) => {
      const survey = surveys.find((s) => s.id === id)
      const info = survey ? changeRequestByLocation[survey.customerLocationNo] : undefined
      return info && bulkChangeTypeSelection.includes(getRequestType(info) as BulkChangeType)
    })
  }

  const handleConfirmBulkApprove = () => {
    if (!onBulkApprove) return

    if (changeRequestMode) {
      const matchingIds = getMatchingChangeRequestIds()
      if (matchingIds.length === 0) return
      onBulkApprove(matchingIds)
      setSelectedIds((prev) => prev.filter((id) => !matchingIds.includes(id)))
      setBulkApproveConfirmOpen(false)
      return
    }

    if (selectedIds.length > 0) {
      if (showBulkDetails) {
        selectedIds.forEach((id) => {
          const updates: Partial<ExtinguisherSurvey> = {}
          if (bulkFieldSelection.includes("refillHpt") && bulkRefillDueDate) updates.refillDueDate = bulkRefillDueDate
          if (bulkFieldSelection.includes("shelfLife") && bulkShelfLifeExpiry) updates.shelfLifeExpiry = bulkShelfLifeExpiry
          if (Object.keys(updates).length > 0) onUpdate(id, updates)
        })
      }
      onBulkApprove(selectedIds)
      setSelectedIds([])
      setBulkApproveConfirmOpen(false)
    }
  }

  const handleApproveClick = (id: string) => {
    setSurveyToApprove(id)
    setApproveConfirmOpen(true)
  }

  const handleConfirmApprove = () => {
    if (surveyToApprove) {
      onApprove(surveyToApprove)
      setSurveyToApprove(null)
      setApproveConfirmOpen(false)
    }
  }

  const handleRejectClick = (id: string) => {
    setSurveyToReject(id)
    setRejectComment("")
    setRejectConfirmOpen(true)
  }

  const handleConfirmReject = () => {
    if (surveyToReject && onReject) {
      onReject(surveyToReject, changeRequestMode ? rejectComment : undefined)
      setSurveyToReject(null)
      setRejectComment("")
      setRejectConfirmOpen(false)
    }
  }

  const handleEdit = (survey: ExtinguisherSurvey) => {
    setEditingSurvey(survey)
    setFormData({
      customerLocationNo: survey.customerLocationNo,
      floorDetails: survey.floorDetails,
      locationDetails: survey.locationDetails,
      extinguisherType: survey.extinguisherType,
      capacity: survey.capacity,
      brand: survey.brand,
      refillDueDate: survey.refillDueDate,
      hptDueDate: survey.hptDueDate,
      shelfLifeExpiry: survey.shelfLifeExpiry,
    })
    setEditModalOpen(true)
  }

  const handleUpdateChanges = () => {
    if (editingSurvey) {
      onUpdate(editingSurvey.id, formData)
      setEditModalOpen(false)
      setEditingSurvey(null)
      setFormData({})
    }
  }

  const activeCommentSurvey = surveys.find((s) => s.id === commentDialogSurveyId)
  const activeChangeRequest = activeCommentSurvey ? changeRequestByLocation?.[activeCommentSurvey.customerLocationNo] : undefined

  return (
    <>
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-[#E63946]/10 to-[#FF8C00]/10 border border-[#E63946]/20 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d32f3c] hover:to-[#f57c00] text-white"
            onClick={handleBulkApproveClick}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Bulk Approve ({selectedIds.length})
          </Button>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946] hover:to-[#FF8C00]">
                <TableHead className="font-semibold text-white w-12">
                  <Checkbox
                    checked={allPendingSelected}
                    onCheckedChange={handleSelectAll}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#E63946]"
                    disabled={pendingSurveys.length === 0}
                  />
                </TableHead>
                <TableHead className="font-semibold text-white">Created Date</TableHead>
                <TableHead className="font-semibold text-white">Location No</TableHead>
                <TableHead className="font-semibold text-white">Floor</TableHead>
                <TableHead className="font-semibold text-white">Location</TableHead>
                <TableHead className="font-semibold text-white">Type & Capacity</TableHead>
                <TableHead className="font-semibold text-white">Brand</TableHead>
                <TableHead className="font-semibold text-white">Refill & HPT Due</TableHead>
                <TableHead className="font-semibold text-white">Shelf Life</TableHead>
                <TableHead className="font-semibold text-white">Image</TableHead>
                <TableHead className="font-semibold text-white">Activity Log</TableHead>
                {changeRequestByLocation && <TableHead className="font-semibold text-white">Request Type</TableHead>}
                {!showApprove && !hideStatusColumn && <TableHead className="font-semibold text-white">Status</TableHead>}
                {!hideCommentColumn && <TableHead className="font-semibold text-white">Comment</TableHead>}
                <TableHead className="font-semibold text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={14 - (showApprove || hideStatusColumn ? 1 : 0) - (hideCommentColumn ? 1 : 0) + (changeRequestByLocation ? 1 : 0)}
                    className="text-center py-8 text-gray-500"
                  >
                    No surveys found
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow key={survey.id} className={`hover:bg-gray-50 ${selectedIds.includes(survey.id) ? 'bg-[#E63946]/5' : ''}`}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(survey.id)}
                        onCheckedChange={(checked) => handleSelectOne(survey.id, checked as boolean)}
                        className="border-gray-300 data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                        disabled={survey.status !== "Pending"}
                      />
                    </TableCell>
                    <TableCell>{survey.enquiryDateTime.split(" ")[0]}</TableCell>
                    <TableCell>{survey.customerLocationNo}</TableCell>
                    <TableCell>{survey.floorDetails}</TableCell>
                    <TableCell>{survey.locationDetails}</TableCell>
                    <TableCell>
                      {survey.extinguisherType} - {survey.capacity}
                    </TableCell>
                    <TableCell>{survey.brand}</TableCell>
                    <TableCell>{survey.refillDueDate}</TableCell>
                    <TableCell>{survey.shelfLifeExpiry}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-[#E63946] hover:text-[#E63946]/80"
                        onClick={() => {
                          setPreviewImage({ url: survey.productImage || "", surveyId: survey.id })
                          setImagePreviewOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-[#E63946]"
                        onClick={() => handleViewActivityLog(survey.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    {changeRequestByLocation && (
                      <TableCell>
                        {changeRequestByLocation[survey.customerLocationNo] ? (
                          <RequestTypeCell {...changeRequestByLocation[survey.customerLocationNo]} />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                    )}
                    {!showApprove && !hideStatusColumn && (
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <DueBadge label="Refill & HPT" days={getDaysFromNow(survey.refillDueDate)} />
                          <DueBadge label="Shelf life" days={getDaysFromNow(survey.shelfLifeExpiry)} />
                        </div>
                      </TableCell>
                    )}
                    {!hideCommentColumn && (
                      <TableCell>
                        <button
                          onClick={() => handleOpenComment(survey.id)}
                          className="relative inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-gray-400 hover:text-[#E63946]" />
                          {((surveyComments[survey.id]?.length ?? 0) > 0 || changeRequestByLocation?.[survey.customerLocationNo]) && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E63946] text-white text-[9px] font-bold flex items-center justify-center">
                              {(surveyComments[survey.id]?.length ?? 0) + (changeRequestByLocation?.[survey.customerLocationNo] ? 1 : 0)}
                            </span>
                          )}
                        </button>
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      {showApprove ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs border-gray-300"
                            onClick={() => handleEdit(survey)}
                          >
                            Edit
                          </Button>
                          {survey.status === "Pending" && (
                            changeRequestMode ? (
                              <>
                                <Button
                                  size="sm"
                                  className="h-6 px-2 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                                  onClick={() => handleApproveClick(survey.id)}
                                >
                                  Update Changes
                                </Button>
                                {showReject && (
                                  <Button
                                    size="sm"
                                    className="h-6 px-2 text-xs bg-red-600 hover:bg-red-700 text-white"
                                    onClick={() => handleRejectClick(survey.id)}
                                  >
                                    Reject
                                  </Button>
                                )}
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="h-6 px-2 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                                  onClick={() => handleApproveClick(survey.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-6 px-2 text-xs bg-red-600 hover:bg-red-700 text-white"
                                  onClick={() => handleRejectClick(survey.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs border-gray-300"
                            onClick={() => handleEdit(survey)}
                          >
                            Edit
                          </Button>
                          {!editOnly && (changeRequestMode ? (
                            survey.status === "Pending" && (
                              <Button
                                size="sm"
                                className="h-6 px-2 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                                onClick={() => handleApproveClick(survey.id)}
                              >
                                Update Changes
                              </Button>
                            )
                          ) : (
                            <Button
                              size="sm"
                              className="h-6 px-2 text-xs bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => onDelete(survey.id)}
                            >
                              Delete
                            </Button>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Extinguisher Survey</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerLocationNo">Customer Location No</Label>
              <Input
                id="customerLocationNo"
                value={formData.customerLocationNo || ""}
                onChange={(e) => setFormData({ ...formData, customerLocationNo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floorDetails">Floor Details</Label>
              <Input
                id="floorDetails"
                value={formData.floorDetails || ""}
                onChange={(e) => setFormData({ ...formData, floorDetails: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="locationDetails">Location Details</Label>
              <Input
                id="locationDetails"
                value={formData.locationDetails || ""}
                onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extinguisherType">Type of Extinguisher</Label>
              <Input
                id="extinguisherType"
                value={formData.extinguisherType || ""}
                onChange={(e) => setFormData({ ...formData, extinguisherType: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                value={formData.capacity || ""}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand || ""}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refillDueDate">Refill & HPT Due On</Label>
              <Input
                id="refillDueDate"
                type="date"
                value={formData.refillDueDate || ""}
                onChange={(e) => setFormData({ ...formData, refillDueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hptDueDate">HPT Due Date</Label>
              <Input
                id="hptDueDate"
                type="date"
                value={formData.hptDueDate || ""}
                onChange={(e) => setFormData({ ...formData, hptDueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shelfLifeExpiry">Shelf Life Expiry On</Label>
              <Input
                id="shelfLifeExpiry"
                type="date"
                value={formData.shelfLifeExpiry || ""}
                onChange={(e) => setFormData({ ...formData, shelfLifeExpiry: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateChanges}
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d32f3c] hover:to-[#f57c00] text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{changeRequestMode ? "Confirm Update" : "Confirm Approval"}</DialogTitle>
            <DialogDescription>
              {changeRequestMode
                ? "Are you sure you want to apply this requested change to the extinguisher survey?"
                : "Are you sure you want to approve this extinguisher survey? This action will mark the survey as verified."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApproveConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApprove}
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d32f3c] hover:to-[#f57c00] text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {changeRequestMode ? "Confirm Update" : "Confirm Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={rejectConfirmOpen} onOpenChange={setRejectConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{changeRequestMode ? "Reject Change Request" : "Confirm Rejection"}</DialogTitle>
            <DialogDescription>
              {changeRequestMode
                ? "Let the customer know why this change request is being rejected."
                : "Are you sure you want to reject this extinguisher survey? This action will mark the survey as rejected."}
            </DialogDescription>
          </DialogHeader>
          {changeRequestMode && (
            <Textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="e.g. Insufficient documentation provided…"
              className="resize-none text-sm min-h-[90px]"
            />
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700 text-white">
              <XCircle className="h-4 w-4 mr-2" />
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Approve Confirmation Dialog */}
      <Dialog open={bulkApproveConfirmOpen} onOpenChange={setBulkApproveConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{changeRequestMode ? "Confirm Bulk Update" : "Confirm Bulk Approval"}</DialogTitle>
            {changeRequestMode && (
              <DialogDescription>
                Choose which change type{"("}s{")"} to apply from the {selectedIds.length} selected extinguisher
                survey{selectedIds.length > 1 ? 's' : ''}:
              </DialogDescription>
            )}
            {!showBulkDetails && !changeRequestMode && (
              <DialogDescription>
                Are you sure you want to approve {selectedIds.length} selected extinguisher survey
                {selectedIds.length > 1 ? 's' : ''}? This action will mark all selected surveys as verified.
              </DialogDescription>
            )}
            {showBulkDetails && !changeRequestMode && (
              <DialogDescription>
                Choose which due date{"("}s{")"} to update for all {selectedIds.length} selected extinguisher survey
                {selectedIds.length > 1 ? 's' : ''}:
              </DialogDescription>
            )}
          </DialogHeader>
          {changeRequestMode && changeRequestByLocation && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={bulkChangeTypeSelection.includes("refillHpt")}
                    onCheckedChange={(checked) => toggleBulkChangeType("refillHpt", checked as boolean)}
                    className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                  />
                  <span className="text-sm font-medium text-gray-700">Refill</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={bulkChangeTypeSelection.includes("shelfLife")}
                    onCheckedChange={(checked) => toggleBulkChangeType("shelfLife", checked as boolean)}
                    className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                  />
                  <span className="text-sm font-medium text-gray-700">Shelf Life</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={bulkChangeTypeSelection.includes("scrap")}
                    onCheckedChange={(checked) => toggleBulkChangeType("scrap", checked as boolean)}
                    className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                  />
                  <span className="text-sm font-medium text-gray-700">Scrap</span>
                </label>
              </div>

              {bulkChangeTypeSelection.length > 0 && (
                <div className="max-h-56 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
                  {selectedIds.map((id) => {
                    const survey = surveys.find((s) => s.id === id)
                    const info = survey ? changeRequestByLocation[survey.customerLocationNo] : undefined
                    if (!survey || !info || !bulkChangeTypeSelection.includes(getRequestType(info) as BulkChangeType)) return null
                    return (
                      <div key={id} className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-gray-600">{survey.customerLocationNo}</span>
                        <RequestTypeCell {...info} />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
          {!changeRequestMode && showBulkDetails && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={bulkFieldSelection.includes("refillHpt")}
                    onCheckedChange={(checked) => toggleBulkField("refillHpt", checked as boolean)}
                    className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                  />
                  <span className="text-sm font-medium text-gray-700">Refill & HPT</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={bulkFieldSelection.includes("shelfLife")}
                    onCheckedChange={(checked) => toggleBulkField("shelfLife", checked as boolean)}
                    className="data-[state=checked]:bg-[#E63946] data-[state=checked]:border-[#E63946]"
                  />
                  <span className="text-sm font-medium text-gray-700">Shelf Life</span>
                </label>
              </div>

              {bulkFieldSelection.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {bulkFieldSelection.includes("refillHpt") && (
                    <div className="space-y-2">
                      <Label htmlFor="bulkRefillDueDate">Refill & HPT Due</Label>
                      <Input
                        id="bulkRefillDueDate"
                        type="date"
                        value={bulkRefillDueDate}
                        onChange={(e) => setBulkRefillDueDate(e.target.value)}
                      />
                    </div>
                  )}
                  {bulkFieldSelection.includes("shelfLife") && (
                    <div className="space-y-2">
                      <Label htmlFor="bulkShelfLifeExpiry">Shelf Life</Label>
                      <Input
                        id="bulkShelfLifeExpiry"
                        type="date"
                        value={bulkShelfLifeExpiry}
                        onChange={(e) => setBulkShelfLifeExpiry(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBulkApproveConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBulkApprove}
              disabled={
                changeRequestMode
                  ? getMatchingChangeRequestIds().length === 0
                  : showBulkDetails &&
                    (bulkFieldSelection.length === 0 ||
                      (bulkFieldSelection.includes("refillHpt") && !bulkRefillDueDate) ||
                      (bulkFieldSelection.includes("shelfLife") && !bulkShelfLifeExpiry))
              }
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d32f3c] hover:to-[#f57c00] text-white disabled:opacity-50 disabled:pointer-events-none"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {changeRequestMode
                ? `Update ${getMatchingChangeRequestIds().length} Item${getMatchingChangeRequestIds().length > 1 ? 's' : ''}`
                : `Approve ${selectedIds.length} Item${selectedIds.length > 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Survey Comment Dialog */}
      <Dialog open={!!commentDialogSurveyId} onOpenChange={(open) => { if (!open) setCommentDialogSurveyId(null) }}>
        <DialogContent className="max-w-md flex flex-col p-0 gap-0" style={{ maxHeight: "80vh" }}>
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
            <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-[#E63946]" />
              Comments
              {commentDialogSurveyId && (
                <span className="text-xs font-normal text-gray-400 ml-1">· {commentDialogSurveyId}</span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {activeChangeRequest && <ChangeRequestCard {...activeChangeRequest} />}

            {(commentDialogSurveyId ? (surveyComments[commentDialogSurveyId] || []) : []).length === 0 ? (
              !activeChangeRequest && (
                <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first to add one.</p>
              )
            ) : (
              (surveyComments[commentDialogSurveyId!] || []).map((comment) => (
                <div key={comment.id} className={`flex gap-2.5 ${comment.author === "admin" ? "flex-row-reverse" : ""}`}>
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
                    <p className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
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
                placeholder="Write a comment..."
                value={newSurveyComment}
                onChange={(e) => setNewSurveyComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendSurveyComment() } }}
                className="resize-none text-sm bg-white border-gray-200"
                rows={2}
              />
              <Button
                onClick={handleSendSurveyComment}
                disabled={!newSurveyComment.trim()}
                className="h-10 w-10 p-0 shrink-0 bg-[#E63946] hover:bg-[#E63946]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">Enter to send · Shift+Enter for new line</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Product Image Preview Dialog */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Product Image</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2">
            {previewImage?.url ? (
              <img
                src={previewImage.url}
                alt="Product"
                className="w-full max-h-80 object-contain rounded-md border border-gray-200 bg-gray-50"
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
                No image available
              </div>
            )}
            {previewImage?.url && (
              <a
                href={previewImage.url}
                download={`product-image-${previewImage.surveyId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-medium transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Image
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Log Drawer */}
      <Sheet open={activityLogOpen} onOpenChange={setActivityLogOpen}>
        <SheetContent side="right" className="w-[450px] sm:max-w-[450px] overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#E63946]" />
              Activity Log
            </SheetTitle>
          </SheetHeader>
          
          {/* Survey Details Section */}
          {selectedSurveyForLog && (() => {
            const survey = surveys.find(s => s.id === selectedSurveyForLog)
            if (!survey) return null
            return (
              <div className="py-4 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Survey Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Location No</p>
                    <p className="text-sm font-medium text-gray-900">{survey.customerLocationNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Floor</p>
                    <p className="text-sm font-medium text-gray-900">{survey.floorDetails}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{survey.locationDetails}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type & Capacity</p>
                    <p className="text-sm font-medium text-gray-900">{survey.extinguisherType} - {survey.capacity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Brand</p>
                    <p className="text-sm font-medium text-gray-900">{survey.brand}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Refill Due</p>
                    <p className="text-sm font-medium text-gray-900">{survey.refillDueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">HPT Due</p>
                    <p className="text-sm font-medium text-gray-900">{survey.hptDueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shelf Life</p>
                    <p className="text-sm font-medium text-gray-900">{survey.shelfLifeExpiry}</p>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Activity Log Section */}
          <div className="py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Timeline</h3>
            <ScrollArea className="h-[calc(100vh-380px)] pr-2">
              <div className="space-y-4">
                {selectedSurveyForLog && getActivityLogs(selectedSurveyForLog).map((log) => (
                  <div key={log.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActivityIcon(log.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getActivityBadge(log.type)}
                          <span className="text-sm text-gray-700">{log.description}</span>
                        </div>
                        
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-2 bg-gray-50 rounded-md p-3">
                            <p className="text-xs text-gray-500 mb-2">Changes Made:</p>
                            {log.changes.map((change, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium text-gray-700">{change.field}:</span>{" "}
                                <span className="text-red-500 line-through">{change.oldValue}</span>
                                <span className="mx-2 text-gray-400">→</span>
                                <span className="text-green-600">{change.newValue}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {log.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
