import { useState } from "react"
import { CheckCircle, XCircle, Eye, History, Send, FileEdit, User, Clock, MessageSquare, ArrowRight } from "lucide-react"
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
import type { TrainingSurvey } from "@/types/audit"

interface ActivityLogEntry {
  id: string
  type: "enquiry_sent" | "field_updated" | "status_changed" | "created"
  title: string
  description: string
  changes?: { field: string; oldValue: string; newValue: string }[]
  user: string
  timestamp: string
}

interface SurveyComment {
  id: string
  author: "customer" | "admin"
  authorName: string
  text: string
  timestamp: string
}

interface ChangeRequestInfo {
  field: string
  from: string
  to: string
  comment: string
  requestedBy: string
  requestedOn: string
}

interface TrainingSurveyTableProps {
  surveys: TrainingSurvey[]
  onApprove: (id: string) => void
  onBulkApprove?: (ids: string[]) => void
  onReject?: (id: string, comment?: string) => void
  onUpdate: (id: string, data: Partial<TrainingSurvey>) => void
  onDelete: (id: string) => void
  showApprove?: boolean
  changeRequestByTitle?: Record<string, ChangeRequestInfo>
  hideStatusColumn?: boolean
  hideCommentColumn?: boolean
  changeRequestMode?: boolean
  editOnly?: boolean
  showReject?: boolean
}

const sampleTrainingActivityLogs: Record<string, ActivityLogEntry[]> = {
  "TRN001": [
    {
      id: "tlog-1",
      type: "enquiry_sent",
      title: "Enquiry Sent",
      description: "Training schedule confirmation sent to trainer",
      user: "Rahul Sharma",
      timestamp: "15-01-2025 10:30 AM"
    },
    {
      id: "tlog-2",
      type: "field_updated",
      title: "Field Updated",
      description: "Training details modified",
      changes: [
        { field: "Training Title", oldValue: "Basic Fire Safety", newValue: "Advanced Fire Safety" },
        { field: "Due Date", oldValue: "Jan 2025", newValue: "Feb-2025" }
      ],
      user: "Priya Patel",
      timestamp: "12-01-2025 03:45 PM"
    },
    {
      id: "tlog-3",
      type: "created",
      title: "Record Created",
      description: "Training survey record created",
      user: "System",
      timestamp: "05-01-2025 09:00 AM"
    }
  ],
  "TRN002": [
    {
      id: "tlog-4",
      type: "status_changed",
      title: "Status Changed",
      description: "Training survey verified",
      changes: [{ field: "Status", oldValue: "Pending", newValue: "Verified" }],
      user: "Admin User",
      timestamp: "14-01-2025 02:15 PM"
    },
    {
      id: "tlog-5",
      type: "created",
      title: "Record Created",
      description: "Training survey record created",
      user: "System",
      timestamp: "10-01-2025 10:00 AM"
    }
  ]
}

const initialSurveyComments: Record<string, SurveyComment[]> = {
  TRN001: [
    { id: "tc1", author: "customer", authorName: "Rajesh Kumar", text: "Can the training be rescheduled to next month?", timestamp: "16 Jan 2025, 09:00 AM" },
    { id: "tc2", author: "admin", authorName: "Admin", text: "Noted, will coordinate with the trainer and update the due date.", timestamp: "16 Jan 2025, 10:15 AM" },
  ],
  TRN003: [
    { id: "tc3", author: "customer", authorName: "Rajesh Kumar", text: "Please confirm the number of participants for this session.", timestamp: "14 Jan 2025, 11:00 AM" },
  ],
}

function getDaysFromNow(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function DueBadge({ days }: { days: number }) {
  if (days < 0) {
    return (
      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 whitespace-nowrap">
        Training overdue {Math.abs(days)}d
      </span>
    )
  }
  return (
    <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600 whitespace-nowrap">
      Training due in {days}d
    </span>
  )
}

function ChangeRequestCard({ field, from, to, comment, requestedBy, requestedOn }: ChangeRequestInfo) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/50 p-3 space-y-2">
      <span className="block text-xs font-semibold text-gray-700">{field}</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-xs font-mono">{from}</span>
        <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
        <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 text-xs font-mono">{to}</span>
      </div>
      <p className="text-sm text-gray-700">Change requested: {comment}</p>
      <p className="text-[10px] text-gray-400">Requested by {requestedBy} · {requestedOn}</p>
    </div>
  )
}

function RequestTypeCell({ field, from, to }: ChangeRequestInfo) {
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

export function TrainingSurveyTable({ surveys, onApprove, onBulkApprove, onReject, onUpdate, onDelete, showApprove = false, changeRequestByTitle, hideStatusColumn = false, hideCommentColumn = false, changeRequestMode = false, editOnly = false, showReject = false }: TrainingSurveyTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingSurvey, setEditingSurvey] = useState<TrainingSurvey | null>(null)
  const [formData, setFormData] = useState<Partial<TrainingSurvey>>({})
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)
  const [surveyToApprove, setSurveyToApprove] = useState<string | null>(null)
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false)
  const [surveyToReject, setSurveyToReject] = useState<string | null>(null)
  const [rejectComment, setRejectComment] = useState("")
  const [activityLogOpen, setActivityLogOpen] = useState(false)
  const [selectedSurveyForLog, setSelectedSurveyForLog] = useState<string | null>(null)
  const [surveyComments, setSurveyComments] = useState<Record<string, SurveyComment[]>>(initialSurveyComments)
  const [commentDialogSurveyId, setCommentDialogSurveyId] = useState<string | null>(null)
  const [newSurveyComment, setNewSurveyComment] = useState("")

  const handleViewActivityLog = (surveyId: string) => {
    setSelectedSurveyForLog(surveyId)
    setActivityLogOpen(true)
  }

  const getActivityLogs = (surveyId: string): ActivityLogEntry[] => {
    return sampleTrainingActivityLogs[surveyId] || [
      {
        id: "default-log",
        type: "created",
        title: "Record Created",
        description: "Training survey record created",
        user: "System",
        timestamp: "01-01-2025 09:00 AM"
      }
    ]
  }

  const getActivityIcon = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "enquiry_sent":   return <Send className="h-4 w-4 text-orange-500" />
      case "field_updated":  return <FileEdit className="h-4 w-4 text-blue-500" />
      case "status_changed": return <History className="h-4 w-4 text-green-500" />
      case "created":        return <History className="h-4 w-4 text-gray-500" />
      default:               return <History className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: ActivityLogEntry["type"]) => {
    switch (type) {
      case "enquiry_sent":   return <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">Enquiry Sent</Badge>
      case "field_updated":  return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Field Updated</Badge>
      case "status_changed": return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">Status Changed</Badge>
      case "created":        return <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">Created</Badge>
      default:               return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleEdit = (survey: TrainingSurvey) => {
    setEditingSurvey(survey)
    setFormData({
      trainingTitle: survey.trainingTitle,
      trainingDueDate: survey.trainingDueDate,
      trainingGivenBy: survey.trainingGivenBy,
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

  const handleOpenComment = (surveyId: string) => {
    setCommentDialogSurveyId(surveyId)
    setNewSurveyComment("")
  }

  const handleSendSurveyComment = () => {
    const trimmed = newSurveyComment.trim()
    if (!trimmed || !commentDialogSurveyId) return
    const comment: SurveyComment = {
      id: `tc${Date.now()}`,
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

  const activeCommentSurvey = surveys.find((s) => s.id === commentDialogSurveyId)
  const activeChangeRequest = activeCommentSurvey ? changeRequestByTitle?.[activeCommentSurvey.trainingTitle] : undefined

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946] hover:to-[#FF8C00]">
                <TableHead className="font-semibold text-white">Training Date & Time</TableHead>
                <TableHead className="font-semibold text-white">Training Programme Title</TableHead>
                <TableHead className="font-semibold text-white">Due Date</TableHead>
                <TableHead className="font-semibold text-white">Training Given By</TableHead>
                <TableHead className="font-semibold text-white">Activity Log</TableHead>
                {changeRequestByTitle && <TableHead className="font-semibold text-white">Request Type</TableHead>}
                {!showApprove && !hideStatusColumn && <TableHead className="font-semibold text-white">Status</TableHead>}
                {!hideCommentColumn && <TableHead className="font-semibold text-white">Comment</TableHead>}
                <TableHead className="font-semibold text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8 - (showApprove || hideStatusColumn ? 1 : 0) - (hideCommentColumn ? 1 : 0) + (changeRequestByTitle ? 1 : 0)}
                    className="text-center py-8 text-gray-500"
                  >
                    No surveys found
                  </TableCell>
                </TableRow>
              ) : (
                surveys.map((survey) => (
                  <TableRow key={survey.id} className="hover:bg-gray-50">
                    <TableCell>{survey.trainingDateTime}</TableCell>
                    <TableCell>{survey.trainingTitle}</TableCell>
                    <TableCell>{survey.trainingDueDate}</TableCell>
                    <TableCell>{survey.trainingGivenBy}</TableCell>
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
                    {changeRequestByTitle && (
                      <TableCell>
                        {changeRequestByTitle[survey.trainingTitle] ? (
                          <RequestTypeCell {...changeRequestByTitle[survey.trainingTitle]} />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </TableCell>
                    )}
                    {!showApprove && !hideStatusColumn && (
                      <TableCell>
                        <DueBadge days={getDaysFromNow(survey.trainingDueDate)} />
                      </TableCell>
                    )}
                    {!hideCommentColumn && (
                      <TableCell>
                        <button
                          onClick={() => handleOpenComment(survey.id)}
                          className="relative inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-gray-400 hover:text-[#E63946]" />
                          {((surveyComments[survey.id]?.length ?? 0) > 0 || changeRequestByTitle?.[survey.trainingTitle]) && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E63946] text-white text-[9px] font-bold flex items-center justify-center">
                              {(surveyComments[survey.id]?.length ?? 0) + (changeRequestByTitle?.[survey.trainingTitle] ? 1 : 0)}
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

      {/* Approve Confirmation Dialog */}
      <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{changeRequestMode ? "Confirm Update" : "Confirm Approval"}</DialogTitle>
            <DialogDescription>
              {changeRequestMode
                ? "Are you sure you want to apply this requested change to the training survey?"
                : "Are you sure you want to approve this training survey? This action will mark the survey as verified."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApproveConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApprove}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {changeRequestMode ? "Confirm Update" : "Confirm Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Training Survey</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trainingTitle">Training Programme Title</Label>
              <Input
                id="trainingTitle"
                value={formData.trainingTitle || ""}
                onChange={(e) => setFormData({ ...formData, trainingTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingDueDate">Training Programme Due On</Label>
              <Input
                id="trainingDueDate"
                type="date"
                value={formData.trainingDueDate || ""}
                onChange={(e) => setFormData({ ...formData, trainingDueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainingGivenBy">Training Given By</Label>
              <Input
                id="trainingGivenBy"
                value={formData.trainingGivenBy || ""}
                onChange={(e) => setFormData({ ...formData, trainingGivenBy: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button
              onClick={handleUpdateChanges}
              className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#d32f3c] hover:to-[#f57c00] text-white"
            >
              Save
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
                : "Are you sure you want to reject this training survey? This action will mark the survey as rejected."}
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

      {/* Comment Dialog */}
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

      {/* Activity Log Drawer */}
      <Sheet open={activityLogOpen} onOpenChange={setActivityLogOpen}>
        <SheetContent side="right" className="w-[450px] sm:max-w-[450px] overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-[#E63946]" />
              Activity Log
            </SheetTitle>
          </SheetHeader>

          {selectedSurveyForLog && (() => {
            const survey = surveys.find(s => s.id === selectedSurveyForLog)
            if (!survey) return null
            return (
              <div className="py-4 border-b">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Survey Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Training Title</p>
                    <p className="text-sm font-medium text-gray-900">{survey.trainingTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="text-sm font-medium text-gray-900">{survey.trainingDueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Training Given By</p>
                    <p className="text-sm font-medium text-gray-900">{survey.trainingGivenBy}</p>
                  </div>
                </div>
              </div>
            )
          })()}

          <div className="py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Timeline</h3>
            <ScrollArea className="h-[calc(100vh-320px)] pr-2">
              <div className="space-y-4">
                {selectedSurveyForLog && getActivityLogs(selectedSurveyForLog).map((log) => (
                  <div key={log.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getActivityIcon(log.type)}</div>
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
                          <span className="flex items-center gap-1"><User className="h-3 w-3" />{log.user}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{log.timestamp}</span>
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
