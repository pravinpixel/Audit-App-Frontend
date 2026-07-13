import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExtinguisherEnquiryTable } from "@/components/extinguisher-enquiry-table"
import { TrainingEnquiryTable } from "@/components/training-enquiry-table"
import type {
  AuditEnquiryDetail,
  EnquirySurveyItem,
  TrainingEnquirySurveyItem,
  TrainingSurvey,
} from "@/types/audit-enquiry"

export default function AuditEnquiryDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [enquiry, setEnquiry] = useState<AuditEnquiryDetail | null>(null)
  const [extinguisherSurveys, setExtinguisherSurveys] = useState<EnquirySurveyItem[]>([])
  const [trainingSurveys, setTrainingSurveys] = useState<TrainingSurvey[]>([])
  const [trainingEnquirySurveys, setTrainingEnquirySurveys] = useState<TrainingEnquirySurveyItem[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [salesPerson, setSalesPerson] = useState<string>("Rajesh Kumar")

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    fetchEnquiryDetails()
  }, [params.id, navigate])

  const fetchEnquiryDetails = () => {
    // Mock enquiry details data matching the ID from the listing
    const mockEnquiry: AuditEnquiryDetail = {
      id: params.id as string,
      companyName: "Tech Solutions Pvt Ltd",
      customerName: "Tech Solutions Pvt Ltd",
      industryType: "IT Services",
      branchLocation: "Bangalore - Koramangala",
      headOfficeLocation: "Bangalore",
      state: "Karnataka",
      city: "Bangalore",
      approvalsPending: 3,
    }

    const mockExtinguisherSurveys: EnquirySurveyItem[] = [
      {
        id: "EXT001",
        companyId: params.id as string,
        auditorName: "John Smith",
        auditorPhone: "+91 98765 43210",
        auditorEmail: "john.smith@safetymatters.com",
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
        status: "Enquiry Viewed",
        serviceExpectedDate: "2025-03-10",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Urgent service required. Extinguisher showing low pressure.",
        enquiryDate: "2025-02-15",
        enquiryTime: "10:30 AM",
      },
      {
        id: "EXT002",
        companyId: params.id as string,
        auditorName: "Sarah Johnson",
        auditorPhone: "+91 87654 32109",
        auditorEmail: "sarah.johnson@safetymatters.com",
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
        status: "Service Done",
        serviceExpectedDate: "2025-02-20",
        serviceDoneDate: "2025-02-18",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Regular maintenance check completed successfully.",
        enquiryDate: "2025-02-10",
        enquiryTime: "02:15 PM",
      },
      {
        id: "EXT003",
        companyId: params.id as string,
        auditorName: "Michael Brown",
        auditorPhone: "+91 76543 21098",
        auditorEmail: "michael.brown@safetymatters.com",
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
        status: "Assigned to Vendor",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Seal damaged, requires immediate replacement.",
        enquiryDate: "2025-02-18",
        enquiryTime: "11:45 AM",
      },
      {
        id: "EXT004",
        companyId: params.id as string,
        auditorName: "Emily Davis",
        auditorPhone: "+91 65432 10987",
        auditorEmail: "emily.davis@safetymatters.com",
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
        status: "Service Date Marked",
        serviceExpectedDate: "2025-03-15",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Annual inspection completed. All parameters normal.",
        enquiryDate: "2025-02-12",
        enquiryTime: "09:00 AM",
      },
      {
        id: "EXT005",
        companyId: params.id as string,
        auditorName: "Robert Wilson",
        auditorPhone: "+91 54321 09876",
        auditorEmail: "robert.wilson@safetymatters.com",
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
        status: "Enquiry Viewed",
        serviceExpectedDate: "2025-03-25",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Nozzle blocked, cleaning and service needed.",
        enquiryDate: "2025-02-20",
        enquiryTime: "03:30 PM",
      },
      {
        id: "EXT006",
        companyId: params.id as string,
        auditorName: "Lisa Anderson",
        auditorPhone: "+91 43210 98765",
        auditorEmail: "lisa.anderson@safetymatters.com",
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
        status: "Service Done",
        serviceExpectedDate: "2025-02-15",
        serviceDoneDate: "2025-02-14",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Refill completed. Unit tested and certified.",
        enquiryDate: "2025-02-08",
        enquiryTime: "01:00 PM",
      },
      {
        id: "EXT007",
        companyId: params.id as string,
        auditorName: "David Martinez",
        auditorPhone: "+91 32109 87654",
        auditorEmail: "david.martinez@safetymatters.com",
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
        status: "Service Date Marked",
        serviceExpectedDate: "2025-03-05",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Pressure gauge showing red zone. Urgent refill required.",
        enquiryDate: "2025-02-22",
        enquiryTime: "04:15 PM",
      },
      {
        id: "EXT008",
        companyId: params.id as string,
        auditorName: "Jennifer Taylor",
        auditorPhone: "+91 21098 76543",
        auditorEmail: "jennifer.taylor@safetymatters.com",
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
        status: "Service Done",
        serviceExpectedDate: "2025-02-22",
        serviceDoneDate: "2025-02-20",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "HPT test completed successfully. Valid for next 6 months.",
        enquiryDate: "2025-02-14",
        enquiryTime: "10:00 AM",
      },
    ]

    const mockTrainingEnquirySurveys: TrainingEnquirySurveyItem[] = [
      {
        id: "TRN001",
        companyId: params.id as string,
        auditorName: "Michael Chen",
        auditorPhone: "+91 76543 21098",
        auditorEmail: "michael.chen@safetymatters.com",
        trainingTitle: "Fire Safety Basics",
        trainingDueDate: "2025-03-20",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Enquiry Viewed",
        serviceExpectedDate: "2025-03-10",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Basic fire safety training required for 20 employees.",
        enquiryDate: "2025-02-15",
        enquiryTime: "10:30 AM",
      },
      {
        id: "TRN002",
        companyId: params.id as string,
        auditorName: "Emily Davis",
        auditorPhone: "+91 65432 10987",
        auditorEmail: "emily.davis@safetymatters.com",
        trainingTitle: "Emergency Evacuation Procedures",
        trainingDueDate: "2025-04-15",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Service Done",
        serviceExpectedDate: "2025-02-20",
        serviceDoneDate: "2025-02-18",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Emergency evacuation drill completed successfully.",
        enquiryDate: "2025-02-10",
        enquiryTime: "02:15 PM",
      },
      {
        id: "TRN003",
        companyId: params.id as string,
        auditorName: "Thomas Garcia",
        auditorPhone: "+91 54321 09876",
        auditorEmail: "thomas.garcia@safetymatters.com",
        trainingTitle: "First Aid Training",
        trainingDueDate: "2025-05-10",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Assigned to Vendor",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "First aid certification training for 15 employees needed.",
        enquiryDate: "2025-02-18",
        enquiryTime: "11:45 AM",
      },
      {
        id: "TRN004",
        companyId: params.id as string,
        auditorName: "Amanda White",
        auditorPhone: "+91 43210 98765",
        auditorEmail: "amanda.white@safetymatters.com",
        trainingTitle: "Hazard Communication",
        trainingDueDate: "2025-06-05",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Service Date Marked",
        serviceExpectedDate: "2025-03-15",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Hazard communication training with focus on chemical safety.",
        enquiryDate: "2025-02-12",
        enquiryTime: "09:00 AM",
      },
      {
        id: "TRN005",
        companyId: params.id as string,
        auditorName: "Christopher Lee",
        auditorPhone: "+91 32109 87654",
        auditorEmail: "christopher.lee@safetymatters.com",
        trainingTitle: "Personal Protective Equipment",
        trainingDueDate: "2025-07-12",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Enquiry Viewed",
        serviceExpectedDate: "2025-03-25",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "PPE training for warehouse staff - 25 participants expected.",
        enquiryDate: "2025-02-20",
        enquiryTime: "03:30 PM",
      },
      {
        id: "TRN006",
        companyId: params.id as string,
        auditorName: "Patricia Martinez",
        auditorPhone: "+91 21098 76543",
        auditorEmail: "patricia.martinez@safetymatters.com",
        trainingTitle: "Electrical Safety",
        trainingDueDate: "2025-08-18",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Service Done",
        serviceExpectedDate: "2025-02-15",
        serviceDoneDate: "2025-02-14",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Electrical safety training completed for maintenance team.",
        enquiryDate: "2025-02-08",
        enquiryTime: "01:00 PM",
      },
      {
        id: "TRN007",
        companyId: params.id as string,
        auditorName: "Daniel Thompson",
        auditorPhone: "+91 10987 65432",
        auditorEmail: "daniel.thompson@safetymatters.com",
        trainingTitle: "Workplace Ergonomics",
        trainingDueDate: "2025-09-22",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Service Date Marked",
        serviceExpectedDate: "2025-03-05",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Ergonomics training for IT department - desk setup and posture.",
        enquiryDate: "2025-02-22",
        enquiryTime: "04:15 PM",
      },
      {
        id: "TRN008",
        companyId: params.id as string,
        auditorName: "Karen Robinson",
        auditorPhone: "+91 09876 54321",
        auditorEmail: "karen.robinson@safetymatters.com",
        trainingTitle: "Chemical Safety Handling",
        trainingDueDate: "2025-10-08",
        trainingGivenBy: "Safety Matters Training Dept",
        status: "Service Done",
        serviceExpectedDate: "2025-02-22",
        serviceDoneDate: "2025-02-20",
        customerName: "Tech Solutions Pvt Ltd",
        remarks: "Chemical safety handling training completed with certification.",
        enquiryDate: "2025-02-14",
        enquiryTime: "10:00 AM",
      },
    ]

    setEnquiry(mockEnquiry)
    setExtinguisherSurveys(mockExtinguisherSurveys)
    setTrainingEnquirySurveys(mockTrainingEnquirySurveys)
  }

  const handleApproveTraining = (id: string) => {
    setTrainingSurveys(trainingSurveys.map((survey) => (survey.id === id ? { ...survey, status: "Verified" } : survey)))
  }

  const handleUpdateTraining = (id: string, updatedData: Partial<TrainingSurvey>) => {
    setTrainingSurveys(
      trainingSurveys.map((survey) => (survey.id === id ? { ...survey, ...updatedData, status: "Pending" } : survey)),
    )
  }

  const handleDeleteTraining = (id: string) => {
    if (confirm("Are you sure you want to delete this survey?")) {
      setTrainingSurveys(trainingSurveys.filter((survey) => survey.id !== id))
    }
  }

  const filteredExtinguisherSurveys =
    statusFilter === "All"
      ? extinguisherSurveys
      : statusFilter === "Pending"
        ? extinguisherSurveys.filter((s) => s.status === "Assigned to Vendor")
        : extinguisherSurveys.filter((s) => s.status === "Service Done")

  const filteredTrainingEnquirySurveys =
    statusFilter === "All"
      ? trainingEnquirySurveys
      : statusFilter === "Pending"
        ? trainingEnquirySurveys.filter((s) => s.status === "Assigned to Vendor")
        : statusFilter === "Verified"
          ? trainingEnquirySurveys.filter((s) => s.status === "Service Done")
          : trainingEnquirySurveys.filter((s) => s.status === statusFilter)

  if (!enquiry) {
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
            size="sm"
            onClick={() => navigate("/audit-enquiry")}
            className="mb-4 -ml-2 hover:bg-[#E63946] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
            Back to Audit Enquiry
          </Button>

          <h1 className="text-2xl font-bold text-gray-900">Enquiry Details</h1>
          <p className="text-sm text-gray-600 mt-1">View and manage enquiry survey forms</p>
        </div>

        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-3">
              <div>
                <p className="text-xs text-gray-500">Company Name</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Industry Type</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.industryType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Branch Location</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.branchLocation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Head Office</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.headOfficeLocation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">State</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.state}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">City</p>
                <p className="text-sm font-medium text-gray-900">{enquiry.city}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Sales Person</p>
                <Select value={salesPerson} onValueChange={setSalesPerson}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select Sales Person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                    <SelectItem value="Priya Sharma">Priya Sharma</SelectItem>
                    <SelectItem value="Amit Patel">Amit Patel</SelectItem>
                    <SelectItem value="Sunita Reddy">Sunita Reddy</SelectItem>
                    <SelectItem value="Vikram Singh">Vikram Singh</SelectItem>
                    <SelectItem value="Anjali Desai">Anjali Desai</SelectItem>
                    <SelectItem value="Rohit Mehta">Rohit Mehta</SelectItem>
                    <SelectItem value="Neha Gupta">Neha Gupta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

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
                    <SelectItem value="Enquiry Viewed">Enquiry Viewed</SelectItem>
                    <SelectItem value="Service Date Marked">Service Date Marked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="extinguisher">
              <ExtinguisherEnquiryTable surveys={filteredExtinguisherSurveys} companyId={params.id as string} />
            </TabsContent>

            <TabsContent value="training">
              <TrainingEnquiryTable surveys={filteredTrainingEnquirySurveys} companyId={params.id as string} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
