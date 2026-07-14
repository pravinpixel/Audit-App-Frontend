import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

interface Banner {
  id: string
  bannerName: string
  customerName: string
  position: "Top" | "Bottom" | "Left" | "Right"
  bannerSize: string
  startDate: string
  endDate: string
  priority: number
  status: "Active" | "Scheduled" | "Expired" | "Draft"
  createdBy: string
}

export default function BannerManagementPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [positionFilter, setPositionFilter] = useState<string>("All")
  const [customerFilter, setCustomerFilter] = useState<string>("All")
  const [banners, setBanners] = useState<Banner[]>([])
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    const mockData: Banner[] = [
      {
        id: "BNR001",
        bannerName: "Summer Safety Campaign",
        customerName: "ABC Industries",
        position: "Top",
        bannerSize: "1200 × 150",
        startDate: "01-01-2025",
        endDate: "31-03-2025",
        priority: 1,
        status: "Active",
        createdBy: "Admin User",
      },
      {
        id: "BNR002",
        bannerName: "Fire Safety Awareness",
        customerName: "XYZ Corporation",
        position: "Right",
        bannerSize: "300 × 600",
        startDate: "15-01-2025",
        endDate: "15-04-2025",
        priority: 2,
        status: "Active",
        createdBy: "John Smith",
      },
      {
        id: "BNR003",
        bannerName: "Emergency Evacuation Guide",
        customerName: "Tech Solutions Ltd",
        position: "Left",
        bannerSize: "300 × 600",
        startDate: "01-02-2025",
        endDate: "30-04-2025",
        priority: 3,
        status: "Scheduled",
        createdBy: "Sarah Johnson",
      },
      {
        id: "BNR004",
        bannerName: "Annual Safety Training",
        customerName: "Global Manufacturing",
        position: "Bottom",
        bannerSize: "1200 × 150",
        startDate: "01-12-2024",
        endDate: "31-12-2024",
        priority: 4,
        status: "Expired",
        createdBy: "Michael Brown",
      },
      {
        id: "BNR005",
        bannerName: "New Safety Equipment Launch",
        customerName: "Safety First Inc",
        position: "Top",
        bannerSize: "1200 × 150",
        startDate: "01-03-2025",
        endDate: "30-06-2025",
        priority: 5,
        status: "Draft",
        createdBy: "Emily Davis",
      },
      {
        id: "BNR006",
        bannerName: "Workplace Hazard Awareness",
        customerName: "Industrial Corp",
        position: "Right",
        bannerSize: "300 × 600",
        startDate: "10-01-2025",
        endDate: "10-02-2025",
        priority: 6,
        status: "Active",
        createdBy: "Robert Wilson",
      },
    ]
    setBanners(mockData)
    setFilteredBanners(mockData)
  }, [navigate])

  useEffect(() => {
    let filtered = [...banners]

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.bannerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (positionFilter !== "All") {
      filtered = filtered.filter((item) => item.position === positionFilter)
    }

    if (customerFilter !== "All") {
      filtered = filtered.filter((item) => item.customerName === customerFilter)
    }

    setFilteredBanners(filtered)
  }, [searchQuery, statusFilter, positionFilter, customerFilter, banners])

  const handleDelete = (id: string) => {
    setBannerToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (bannerToDelete) {
      setBanners(banners.filter((item) => item.id !== bannerToDelete))
      setDeleteConfirmOpen(false)
      setBannerToDelete(null)
    }
  }

  const handleToggleStatus = (id: string) => {
    setBanners(
      banners.map((banner) =>
        banner.id === id
          ? { ...banner, status: banner.status === "Active" ? "Draft" : "Active" }
          : banner
      )
    )
  }

  const handleView = (banner: Banner) => {
    setSelectedBanner(banner)
    setViewModalOpen(true)
  }

  const getStatusBadge = (status: Banner["status"]) => {
    const variants: Record<Banner["status"], string> = {
      Active: "bg-green-100 text-green-800",
      Scheduled: "bg-blue-100 text-blue-800",
      Expired: "bg-red-100 text-red-800",
      Draft: "bg-gray-100 text-gray-800",
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

  const getPositionBadge = (position: Banner["position"]) => {
    const variants: Record<Banner["position"], string> = {
      Top: "bg-purple-100 text-purple-800",
      Bottom: "bg-indigo-100 text-indigo-800",
      Left: "bg-cyan-100 text-cyan-800",
      Right: "bg-teal-100 text-teal-800",
    }
    return <Badge className={variants[position]}>{position}</Badge>
  }

  const uniqueCustomers = [...new Set(banners.map((b) => b.customerName))]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advertisement / Banner Management</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Banner List</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by banner name or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Total Records: <span className="text-[#E63946] font-semibold">{filteredBanners.length}</span>
              </span>

              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Customers</SelectItem>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Positions</SelectItem>
                  <SelectItem value="Top">Top</SelectItem>
                  <SelectItem value="Bottom">Bottom</SelectItem>
                  <SelectItem value="Left">Left</SelectItem>
                  <SelectItem value="Right">Right</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => navigate("/banner-management/add")}
                className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#D32F3F] hover:to-[#F57C00] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#E63946] hover:to-[#FF8C00]">
                  <TableHead className="font-semibold text-white">S.No</TableHead>
                  <TableHead className="font-semibold text-white">Banner Name</TableHead>
                  <TableHead className="font-semibold text-white">Customer Name</TableHead>
                  <TableHead className="font-semibold text-white">Position</TableHead>
                  <TableHead className="font-semibold text-white">Banner Size</TableHead>
                  <TableHead className="font-semibold text-white">Start Date</TableHead>
                  <TableHead className="font-semibold text-white">End Date</TableHead>
                  <TableHead className="font-semibold text-white">Status</TableHead>
                  <TableHead className="font-semibold text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No banners found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBanners.map((banner, index) => (
                    <TableRow key={banner.id} className="hover:bg-gray-50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{banner.bannerName}</TableCell>
                      <TableCell>{banner.customerName}</TableCell>
                      <TableCell>{getPositionBadge(banner.position)}</TableCell>
                      <TableCell>{banner.bannerSize}</TableCell>
                      <TableCell>{banner.startDate}</TableCell>
                      <TableCell>{banner.endDate}</TableCell>
                      <TableCell>{getStatusBadge(banner.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(banner)}
                            className="h-8 w-8 p-0 hover:bg-blue-100"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/banner-management/edit/${banner.id}`)}
                            className="h-8 w-8 p-0 hover:bg-green-100"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(banner.id)}
                            className="h-8 w-8 p-0 hover:bg-yellow-100"
                          >
                            {banner.status === "Active" ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(banner.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Banner Dialog */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Banner Details</DialogTitle>
          </DialogHeader>
          {selectedBanner && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Banner Name</p>
                  <p className="text-sm font-medium">{selectedBanner.bannerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer Name</p>
                  <p className="text-sm font-medium">{selectedBanner.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm font-medium">{selectedBanner.position}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Banner Size</p>
                  <p className="text-sm font-medium">{selectedBanner.bannerSize}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium">{selectedBanner.startDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-sm font-medium">{selectedBanner.endDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Priority</p>
                  <p className="text-sm font-medium">{selectedBanner.priority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  {getStatusBadge(selectedBanner.status)}
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Created By</p>
                  <p className="text-sm font-medium">{selectedBanner.createdBy}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
