import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search, Building2, MapPin, Users, Flame, BookOpen, Edit,
} from "lucide-react"

export type ProductType = "Extinguisher" | "Training"

export interface ModuleAccess {
  enabled: boolean
  productTypes: ProductType[]
}

export interface UserAccess {
  dueDateFollowup: ModuleAccess
  changeRequest: ModuleAccess
}

export interface AssignedUser {
  userId: string
  userName: string
  access: UserAccess
}

export interface CustomerAssignment {
  id: string
  companyName: string
  industryType: string
  branchLocation: string
  assignedUsers: AssignedUser[]
}

export interface CompanyOption {
  companyName: string
  industryType: string
  branchLocation: string
}

export const AVAILABLE_COMPANIES: CompanyOption[] = [
  { companyName: "Tech Solutions Pvt Ltd", industryType: "IT Services", branchLocation: "Koramangala, Bangalore" },
  { companyName: "Manufacturing Industries Ltd", industryType: "Manufacturing", branchLocation: "Peenya Industrial Area, Bangalore" },
  { companyName: "Metro Logistics", industryType: "Logistics", branchLocation: "Guindy, Chennai" },
  { companyName: "Bharat Steel Works", industryType: "Manufacturing", branchLocation: "Ring Road, Surat" },
  { companyName: "Heritage Hotels Group", industryType: "Hospitality", branchLocation: "MI Road, Jaipur" },
  { companyName: "Sunrise Industries", industryType: "Chemicals", branchLocation: "Connaught Place, Delhi" },
  { companyName: "Northern Power Corp", industryType: "Energy", branchLocation: "Sector 17, Chandigarh" },
  { companyName: "Silverline IT Park", industryType: "Real Estate", branchLocation: "Whitefield, Bangalore" },
  { companyName: "Coastal Seafood Exports", industryType: "Food Processing", branchLocation: "Marine Drive, Kochi" },
  { companyName: "Apex Automotive Ltd", industryType: "Automotive", branchLocation: "Chakan Industrial Area, Pune" },
  { companyName: "Prime Retail Group", industryType: "Retail", branchLocation: "Banjara Hills, Hyderabad" },
  { companyName: "Coastal Pharma Ltd", industryType: "Pharma", branchLocation: "MG Road, Kochi" },
  { companyName: "Eastern Cement Co", industryType: "Construction", branchLocation: "Bhubaneswar Branch" },
  { companyName: "Skyline Aviation Services", industryType: "Aviation", branchLocation: "Airport Road, Bangalore" },
  { companyName: "Greenfield Agro Exports", industryType: "Agriculture", branchLocation: "MIDC, Nashik" },
  { companyName: "Horizon Textiles Ltd", industryType: "Textiles", branchLocation: "Tirupur Road, Coimbatore" },
  { companyName: "Global Manufacturing Co", industryType: "Manufacturing", branchLocation: "Pune Branch" },
]

export interface UserOption {
  id: string
  name: string
}

export const AVAILABLE_USERS: UserOption[] = [
  { id: "u1", name: "Rahul Sharma" },
  { id: "u2", name: "Priya Iyer" },
  { id: "u3", name: "Amit Verma" },
  { id: "u4", name: "Sneha Kapoor" },
  { id: "u5", name: "Vikram Rao" },
  { id: "u6", name: "Ananya Nair" },
  { id: "u7", name: "Karthik Menon" },
  { id: "u8", name: "Divya Pillai" },
]

const STORAGE_KEY = "assignedCustomers"

function fullAccess(): UserAccess {
  return {
    dueDateFollowup: { enabled: true, productTypes: ["Extinguisher", "Training"] },
    changeRequest: { enabled: true, productTypes: ["Extinguisher", "Training"] },
  }
}

const initialAssignments: CustomerAssignment[] = [
  {
    id: "asn1",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    assignedUsers: [
      {
        userId: "u1",
        userName: "Rahul Sharma",
        access: {
          dueDateFollowup: { enabled: true, productTypes: ["Extinguisher"] },
          changeRequest: { enabled: true, productTypes: ["Extinguisher", "Training"] },
        },
      },
      {
        userId: "u2",
        userName: "Priya Iyer",
        access: {
          dueDateFollowup: { enabled: true, productTypes: ["Training"] },
          changeRequest: { enabled: false, productTypes: [] },
        },
      },
    ],
  },
  {
    id: "asn2",
    companyName: "Sunrise Industries",
    industryType: "Chemicals",
    branchLocation: "Connaught Place, Delhi",
    assignedUsers: [
      { userId: "u3", userName: "Amit Verma", access: fullAccess() },
    ],
  },
  {
    id: "asn3",
    companyName: "Bharat Steel Works",
    industryType: "Manufacturing",
    branchLocation: "Ring Road, Surat",
    assignedUsers: [],
  },
]

function hasProductType(user: AssignedUser, type: ProductType): boolean {
  return (
    (user.access.dueDateFollowup.enabled && user.access.dueDateFollowup.productTypes.includes(type)) ||
    (user.access.changeRequest.enabled && user.access.changeRequest.productTypes.includes(type))
  )
}

export default function AssignCustomerPage() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState<CustomerAssignment[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: CustomerAssignment[] = JSON.parse(stored)
      // Normalize records saved under the older company-level module shape
      // (no assignedUsers array) so they render instead of crashing.
      const normalized = parsed.map((a) => ({ ...a, assignedUsers: a.assignedUsers ?? [] }))
      setAssignments(normalized)
    } else {
      setAssignments(initialAssignments)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAssignments))
    }
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return assignments
    return assignments.filter((a) =>
      a.companyName.toLowerCase().includes(q) ||
      a.branchLocation.toLowerCase().includes(q) ||
      a.industryType.toLowerCase().includes(q)
    )
  }, [assignments, searchQuery])

  const handleEdit = (id: string) => {
    navigate(`/assign-customer/new?id=${id}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign Customer</h1>
          <p className="text-sm text-gray-600 mt-1">Manage which users are assigned to each customer's Due Date Followup and Change Request modules</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by company, branch or industry…"
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
                  <TableHead className="font-semibold text-white">No of User Assigned</TableHead>
                  <TableHead className="font-semibold text-white">No of User - Extinguisher</TableHead>
                  <TableHead className="font-semibold text-white">No of User - Training</TableHead>
                  <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No assigned customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((assignment) => {
                    const extinguisherCount = assignment.assignedUsers.filter((u) => hasProductType(u, "Extinguisher")).length
                    const trainingCount = assignment.assignedUsers.filter((u) => hasProductType(u, "Training")).length
                    return (
                      <TableRow key={assignment.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-[#E63946]/10 flex items-center justify-center shrink-0">
                              <Building2 className="h-3.5 w-3.5 text-[#E63946]" />
                            </div>
                            <div>
                              <p className="text-sm">{assignment.companyName}</p>
                              <p className="text-xs text-gray-400">{assignment.industryType}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                            {assignment.branchLocation}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                            <Users className="h-3 w-3" />
                            {assignment.assignedUsers.length}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold">
                            <Flame className="h-3 w-3" />
                            {extinguisherCount}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 text-xs font-semibold">
                            <BookOpen className="h-3 w-3" />
                            {trainingCount}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(assignment.id)}
                            className="text-[#E63946] hover:text-[#E63946] hover:bg-[#E63946]/10"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
