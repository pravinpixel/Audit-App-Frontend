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

interface AdminMessage {
  text: string
  author: string
  date: string
  time: string
}

export interface ChangeRequest {
  id: string
  // Company
  companyName: string
  industryType: string
  branchLocation: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  // Type
  surveyType: "extinguisher" | "training"
  // Product — extinguisher
  locationNo?: string
  floor?: string
  locationDetail?: string
  extType?: string
  capacity?: string
  brand?: string
  refillDue?: string
  shelfLife?: string
  moveToScrap?: boolean
  // Product — training
  programmeTitle?: string
  trainingGivenBy?: string
  // Change
  changeField: string
  changeFrom: string
  changeTo: string
  // Request meta
  requestedBy: string
  requestedOn: string
  postedAt: string
  customerComment: string
  adminMessages: AdminMessage[]
  status: "Pending" | "Approved" | "Rejected"
  nextFollowupDate: string
}

export const initialRequests: ChangeRequest[] = [
  {
    id: "cr1",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-001",
    floor: "Ground Floor",
    locationDetail: "Near Main Entrance",
    extType: "CO2",
    capacity: "5 kg",
    brand: "FireStop",
    refillDue: "15/06/2025",
    shelfLife: "20/01/2028",
    changeField: "Refill & HPT Due Date",
    changeFrom: "15/06/2025",
    changeTo: "15/08/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "18/06/2026",
    postedAt: "10:24 AM",
    customerComment: "The equipment was recently serviced. Please update the refill due date to reflect the actual next service cycle.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-05",
  },
  {
    id: "cr2",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-003",
    floor: "Second Floor",
    locationDetail: "Conference Room A",
    extType: "Foam",
    capacity: "9 L",
    brand: "FireStop",
    refillDue: "10/03/2025",
    shelfLife: "15/06/2027",
    moveToScrap: true,
    changeField: "Move to Scrap",
    changeFrom: "Active",
    changeTo: "Scrapped",
    requestedBy: "Rahul Sharma",
    requestedOn: "20/06/2026",
    postedAt: "02:15 PM",
    customerComment: "This extinguisher is beyond repair after the last inspection. Requesting to mark it as scrapped.",
    adminMessages: [
      { text: "We have reviewed the inspection report. Proceeding with scrap request verification.", author: "Admin", date: "21/06/2026", time: "09:30 AM" },
    ],
    status: "Pending",
    nextFollowupDate: "2026-07-08",
  },
  {
    id: "cr9",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-002",
    floor: "First Floor",
    locationDetail: "Near Server Room",
    extType: "ABC Powder",
    capacity: "6 kg",
    brand: "SafeGuard",
    refillDue: "10/07/2025",
    shelfLife: "15/03/2027",
    changeField: "Refill & HPT Due Date",
    changeFrom: "10/07/2025",
    changeTo: "10/07/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "17/06/2026",
    postedAt: "09:10 AM",
    customerComment: "Servicing was completed early this cycle, please push the due date forward.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-03",
  },
  {
    id: "cr10",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-004",
    floor: "Third Floor",
    locationDetail: "Cafeteria",
    extType: "Water",
    capacity: "9 L",
    brand: "SafeGuard",
    refillDue: "05/08/2025",
    shelfLife: "30/06/2028",
    changeField: "Shelf Life Expiry",
    changeFrom: "30/06/2028",
    changeTo: "30/06/2029",
    requestedBy: "Rahul Sharma",
    requestedOn: "17/06/2026",
    postedAt: "09:20 AM",
    customerComment: "Manufacturer extended the shelf life after a re-certification test.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-04",
  },
  {
    id: "cr11",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-005",
    floor: "Ground Floor",
    locationDetail: "Parking Area",
    extType: "ABC Powder",
    capacity: "4 kg",
    brand: "FireStop",
    refillDue: "12/09/2025",
    shelfLife: "01/09/2028",
    changeField: "Refill & HPT Due Date",
    changeFrom: "12/09/2025",
    changeTo: "12/09/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "18/06/2026",
    postedAt: "09:30 AM",
    customerComment: "Refill completed on site last week.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-05",
  },
  {
    id: "cr12",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-006",
    floor: "First Floor",
    locationDetail: "Electrical Room",
    extType: "CO2",
    capacity: "2 kg",
    brand: "SafeGuard",
    refillDue: "18/04/2025",
    shelfLife: "25/11/2027",
    changeField: "Shelf Life Expiry",
    changeFrom: "25/11/2027",
    changeTo: "25/11/2028",
    requestedBy: "Rahul Sharma",
    requestedOn: "18/06/2026",
    postedAt: "09:40 AM",
    customerComment: "Vendor re-tested this cylinder and extended its shelf life.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-06",
  },
  {
    id: "cr13",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-007",
    floor: "Second Floor",
    locationDetail: "Reception Area",
    extType: "Foam",
    capacity: "6 kg",
    brand: "FireStop",
    refillDue: "25/07/2025",
    shelfLife: "20/04/2028",
    changeField: "Refill & HPT Due Date",
    changeFrom: "25/07/2025",
    changeTo: "25/07/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "19/06/2026",
    postedAt: "09:50 AM",
    customerComment: "Refill service invoice attached, please update the due date.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-07",
  },
  {
    id: "cr14",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-008",
    floor: "Third Floor",
    locationDetail: "Storage Room",
    extType: "ABC Powder",
    capacity: "6 kg",
    brand: "SafeGuard",
    refillDue: "30/06/2025",
    shelfLife: "15/02/2028",
    changeField: "Shelf Life Expiry",
    changeFrom: "15/02/2028",
    changeTo: "15/02/2029",
    requestedBy: "Rahul Sharma",
    requestedOn: "19/06/2026",
    postedAt: "10:00 AM",
    customerComment: "Requesting shelf life extension based on the latest inspection certificate.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-09",
  },
  {
    id: "cr15",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-009",
    floor: "Fourth Floor",
    locationDetail: "IT Server Room",
    extType: "CO2",
    capacity: "5 kg",
    brand: "Ceasefire",
    refillDue: "14/05/2025",
    shelfLife: "10/05/2028",
    changeField: "Refill & HPT Due Date",
    changeFrom: "14/05/2025",
    changeTo: "14/05/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "20/06/2026",
    postedAt: "10:10 AM",
    customerComment: "Server room extinguisher serviced ahead of schedule.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-10",
  },
  {
    id: "cr16",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "extinguisher",
    locationNo: "LOC-010",
    floor: "Ground Floor",
    locationDetail: "Loading Dock",
    extType: "Foam",
    capacity: "9 L",
    brand: "SafeGuard",
    refillDue: "22/08/2025",
    shelfLife: "19/07/2028",
    moveToScrap: true,
    changeField: "Move to Scrap",
    changeFrom: "Active",
    changeTo: "Scrapped",
    requestedBy: "Rahul Sharma",
    requestedOn: "20/06/2026",
    postedAt: "10:20 AM",
    customerComment: "Cylinder failed the hydrostatic pressure test, requesting to scrap it.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-11",
  },
  {
    id: "cr17",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Fire Safety Basics",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "20/03/2025",
    changeTo: "20/09/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "16/06/2026",
    postedAt: "11:00 AM",
    customerComment: "Refresher session rescheduled, please move the due date.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-03",
  },
  {
    id: "cr18",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Emergency Evacuation Procedures",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "15/04/2025",
    changeTo: "15/10/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "16/06/2026",
    postedAt: "11:10 AM",
    customerComment: "Trainer availability pushed the session out by six months.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-04",
  },
  {
    id: "cr19",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "First Aid Training",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "10/05/2025",
    changeTo: "10/11/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "17/06/2026",
    postedAt: "11:20 AM",
    customerComment: "First aid certification renewed early, requesting date update.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-05",
  },
  {
    id: "cr20",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Hazard Communication",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "05/06/2025",
    changeTo: "05/12/2026",
    requestedBy: "Rahul Sharma",
    requestedOn: "17/06/2026",
    postedAt: "11:30 AM",
    customerComment: "Session merged with another department's training slot.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-06",
  },
  {
    id: "cr21",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Personal Protective Equipment",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "12/07/2025",
    changeTo: "12/01/2027",
    requestedBy: "Rahul Sharma",
    requestedOn: "18/06/2026",
    postedAt: "11:40 AM",
    customerComment: "New PPE kits arriving next quarter, requesting the due date shift.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-07",
  },
  {
    id: "cr22",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Electrical Safety",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "18/08/2025",
    changeTo: "18/02/2027",
    requestedBy: "Rahul Sharma",
    requestedOn: "18/06/2026",
    postedAt: "11:50 AM",
    customerComment: "Electrical contractor rescheduled the walkthrough.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-08",
  },
  {
    id: "cr23",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Workplace Ergonomics",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "22/09/2025",
    changeTo: "22/03/2027",
    requestedBy: "Rahul Sharma",
    requestedOn: "19/06/2026",
    postedAt: "12:00 PM",
    customerComment: "Combining this with the new-hire onboarding batch next quarter.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-09",
  },
  {
    id: "cr24",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Chemical Safety Handling",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "08/10/2025",
    changeTo: "08/04/2027",
    requestedBy: "Rahul Sharma",
    requestedOn: "19/06/2026",
    postedAt: "12:10 PM",
    customerComment: "Lab renovation delayed the on-site session.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-10",
  },
  {
    id: "cr25",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Advanced Firefighting Techniques",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "14/11/2025",
    changeTo: "14/05/2027",
    requestedBy: "Rahul Sharma",
    requestedOn: "20/06/2026",
    postedAt: "12:20 PM",
    customerComment: "Requesting a later slot to align with the fire drill calendar.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-11",
  },
  {
    id: "cr26",
    companyName: "Tech Solutions Pvt Ltd",
    industryType: "IT Services",
    branchLocation: "Koramangala, Bangalore",
    contactPerson: "Rahul Sharma",
    contactPhone: "+91 98765 11111",
    contactEmail: "rahul.sharma@techsolutions.com",
    surveyType: "training",
    programmeTitle: "Evacuation Drill Practice",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "02/12/2025",
    changeTo: "02/06/2027",
    requestedBy: "Rahul Sharma",
    requestedOn: "20/06/2026",
    postedAt: "12:30 PM",
    customerComment: "Aligning the drill with the building's fire safety week.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-12",
  },
  {
    id: "cr3",
    companyName: "Manufacturing Industries Ltd",
    industryType: "Manufacturing",
    branchLocation: "Peenya Industrial Area, Bangalore",
    contactPerson: "Priya Menon",
    contactPhone: "+91 98765 22222",
    contactEmail: "priya.menon@manufacturingindustries.com",
    surveyType: "extinguisher",
    locationNo: "LOC-005",
    floor: "Basement",
    locationDetail: "Storage Room",
    extType: "CO2",
    capacity: "5 kg",
    brand: "Ceasefire",
    refillDue: "12/09/2025",
    shelfLife: "10/12/2027",
    changeField: "Refill & HPT Due Date",
    changeFrom: "12/09/2025",
    changeTo: "12/09/2026",
    requestedBy: "Priya Menon",
    requestedOn: "15/06/2026",
    postedAt: "11:45 AM",
    customerComment: "Refill was done on 12 Sep 2025 and the new due date should be one year from service date.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-02",
  },
  {
    id: "cr4",
    companyName: "Metro Logistics",
    industryType: "Logistics",
    branchLocation: "Guindy, Chennai",
    contactPerson: "Sneha Reddy",
    contactPhone: "+91 98765 44444",
    contactEmail: "sneha.reddy@metrologistics.com",
    surveyType: "training",
    programmeTitle: "Fire Safety Basics",
    trainingGivenBy: "Safety Matters Training Dept",
    changeField: "Due Date",
    changeFrom: "20/03/2025",
    changeTo: "20/09/2026",
    requestedBy: "Sneha Reddy",
    requestedOn: "19/06/2026",
    postedAt: "04:10 PM",
    customerComment: "Training was postponed due to office renovation. Please update the due date to September 2026.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-10",
  },
  {
    id: "cr5",
    companyName: "Bharat Steel Works",
    industryType: "Manufacturing",
    branchLocation: "Ring Road, Surat",
    contactPerson: "Rajesh Mehta",
    contactPhone: "+91 98765 66666",
    contactEmail: "rajesh.mehta@bharatsteel.com",
    surveyType: "training",
    programmeTitle: "Fire Extinguisher Handling",
    trainingGivenBy: "FireSkills Academy",
    changeField: "Due Date",
    changeFrom: "10/06/2025",
    changeTo: "10/06/2026",
    requestedBy: "Rajesh Mehta",
    requestedOn: "17/06/2026",
    postedAt: "01:30 PM",
    customerComment: "Training refresher was completed on 10 June 2025. Next session is due in one year.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-15",
  },
  {
    id: "cr6",
    companyName: "Heritage Hotels Group",
    industryType: "Hospitality",
    branchLocation: "MI Road, Jaipur",
    contactPerson: "Suresh Gupta",
    contactPhone: "+91 98765 88888",
    contactEmail: "suresh.gupta@heritagehotels.com",
    surveyType: "extinguisher",
    locationNo: "LOC-007",
    floor: "Ground Floor",
    locationDetail: "Reception Area",
    extType: "Foam",
    capacity: "6 L",
    brand: "FireStop",
    refillDue: "30/05/2026",
    shelfLife: "30/05/2026",
    changeField: "Shelf Life Expiry",
    changeFrom: "30/05/2026",
    changeTo: "30/05/2028",
    requestedBy: "Suresh Gupta",
    requestedOn: "22/06/2026",
    postedAt: "09:05 AM",
    customerComment: "Incorrect shelf life date was entered during survey. Manufacturer label shows expiry as May 2028.",
    adminMessages: [
      { text: "Please share a photo of the manufacturer label for verification.", author: "Admin", date: "22/06/2026", time: "11:00 AM" },
      { text: "Photo uploaded via support portal. Reference: IMG-2026-0622.", author: "Suresh Gupta", date: "22/06/2026", time: "12:45 PM" },
    ],
    status: "Pending",
    nextFollowupDate: "2026-07-06",
  },
  {
    id: "cr7",
    companyName: "Sunrise Industries",
    industryType: "Chemicals",
    branchLocation: "Connaught Place, Delhi",
    contactPerson: "Amit Kumar",
    contactPhone: "+91 98765 33333",
    contactEmail: "amit.kumar@sunriseindustries.com",
    surveyType: "extinguisher",
    locationNo: "LOC-009",
    floor: "Basement 2",
    locationDetail: "Parking Level",
    extType: "CO2",
    capacity: "2 kg",
    brand: "Ceasefire",
    refillDue: "08/11/2025",
    shelfLife: "25/11/2027",
    changeField: "Refill & HPT Due Date",
    changeFrom: "08/11/2025",
    changeTo: "08/11/2026",
    requestedBy: "Amit Kumar",
    requestedOn: "21/06/2026",
    postedAt: "03:40 PM",
    customerComment: "Equipment was refilled on November 8, 2025. Due date should be updated to November 2026.",
    adminMessages: [],
    status: "Approved",
    nextFollowupDate: "2026-07-20",
  },
  {
    id: "cr8",
    companyName: "Northern Power Corp",
    industryType: "Energy",
    branchLocation: "Sector 17, Chandigarh",
    contactPerson: "Deepak Arora",
    contactPhone: "+91 98765 99999",
    contactEmail: "deepak.arora@northernpower.com",
    surveyType: "training",
    programmeTitle: "Hazardous Material Safety",
    trainingGivenBy: "SafeWork Training",
    changeField: "Due Date",
    changeFrom: "25/08/2025",
    changeTo: "25/02/2026",
    requestedBy: "Deepak Arora",
    requestedOn: "16/06/2026",
    postedAt: "10:50 AM",
    customerComment: "Training was completed early. The next cycle due date should be updated accordingly.",
    adminMessages: [],
    status: "Rejected",
    nextFollowupDate: "2026-07-12",
  },
  // New companies
  {
    id: "cr27",
    companyName: "Silverline IT Park",
    industryType: "Real Estate",
    branchLocation: "Whitefield, Bangalore",
    contactPerson: "Karthik Reddy",
    contactPhone: "+91 98111 22334",
    contactEmail: "karthik.reddy@silverlineitpark.com",
    surveyType: "extinguisher",
    locationNo: "LOC-011",
    floor: "Fifth Floor",
    locationDetail: "Data Center",
    extType: "CO2",
    capacity: "9 kg",
    brand: "Ceasefire",
    refillDue: "14/07/2025",
    shelfLife: "20/02/2028",
    changeField: "Refill & HPT Due Date",
    changeFrom: "14/07/2025",
    changeTo: "14/07/2026",
    requestedBy: "Karthik Reddy",
    requestedOn: "23/06/2026",
    postedAt: "10:15 AM",
    customerComment: "Data center extinguisher was serviced ahead of schedule by our facilities vendor.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-13",
  },
  {
    id: "cr28",
    companyName: "Coastal Seafood Exports",
    industryType: "Food Processing",
    branchLocation: "Marine Drive, Kochi",
    contactPerson: "Meenal Kulkarni",
    contactPhone: "+91 98222 33445",
    contactEmail: "meenal.kulkarni@coastalseafood.com",
    surveyType: "extinguisher",
    locationNo: "LOC-012",
    floor: "Ground Floor",
    locationDetail: "Cold Storage Entrance",
    extType: "Foam",
    capacity: "6 L",
    brand: "Minimax",
    refillDue: "02/08/2025",
    shelfLife: "18/09/2027",
    changeField: "Shelf Life Expiry",
    changeFrom: "18/09/2027",
    changeTo: "18/09/2028",
    requestedBy: "Meenal Kulkarni",
    requestedOn: "23/06/2026",
    postedAt: "10:25 AM",
    customerComment: "Manufacturer re-certified the cylinder with an extended shelf life after inspection.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-14",
  },
  {
    id: "cr29",
    companyName: "Apex Automotive Ltd",
    industryType: "Automotive",
    branchLocation: "Chakan Industrial Area, Pune",
    contactPerson: "Ganesh Murthy",
    contactPhone: "+91 98333 44556",
    contactEmail: "ganesh.murthy@apexautomotive.com",
    surveyType: "training",
    programmeTitle: "Assembly Line Fire Safety",
    trainingGivenBy: "Lakshmi Narayanan",
    changeField: "Due Date",
    changeFrom: "30/07/2025",
    changeTo: "30/01/2027",
    requestedBy: "Ganesh Murthy",
    requestedOn: "24/06/2026",
    postedAt: "10:35 AM",
    customerComment: "Plant shutdown for maintenance pushed the training session back six months.",
    adminMessages: [],
    status: "Pending",
    nextFollowupDate: "2026-07-16",
  },
]

// Seed each request's comment thread from its customer comment + any admin replies
const initialCommentsByRequest: Record<string, Comment[]> = {}
initialRequests.forEach((req) => {
  const thread: Comment[] = []
  if (req.customerComment) {
    thread.push({
      id: `${req.id}-customer`,
      author: "customer",
      authorName: req.contactPerson,
      text: req.customerComment,
      timestamp: `${req.requestedOn}, ${req.postedAt}`,
    })
  }
  req.adminMessages.forEach((msg, index) => {
    thread.push({
      id: `${req.id}-admin-${index}`,
      author: "admin",
      authorName: msg.author,
      text: msg.text,
      timestamp: `${msg.date}, ${msg.time}`,
    })
  })
  initialCommentsByRequest[req.id] = thread
})

function getDaysFromNow(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr)
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

export default function CustomerChangeRequestPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<ChangeRequest[]>(initialRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [commentsByRequest, setCommentsByRequest] = useState<Record<string, Comment[]>>(initialCommentsByRequest)
  const [commentDialogRequestId, setCommentDialogRequestId] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return requests
    return requests.filter((r) =>
      r.companyName.toLowerCase().includes(q) ||
      r.branchLocation.toLowerCase().includes(q) ||
      r.contactPerson.toLowerCase().includes(q) ||
      r.contactPhone.toLowerCase().includes(q) ||
      r.contactEmail.toLowerCase().includes(q)
    )
  }, [requests, searchQuery])

  const countsByCompany = useMemo(() => {
    const counts: Record<string, { pending: number; completed: number }> = {}
    requests.forEach((r) => {
      if (!counts[r.companyName]) counts[r.companyName] = { pending: 0, completed: 0 }
      if (r.status === "Pending") counts[r.companyName].pending += 1
      else counts[r.companyName].completed += 1
    })
    return counts
  }, [requests])

  const handleView = (id: string) => {
    navigate(`/customer-success/change-request/${id}`)
  }

  const handleFollowupDateChange = (id: string, value: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, nextFollowupDate: value } : r)))
  }

  const handleSendComment = () => {
    const trimmed = newComment.trim()
    if (!trimmed || !commentDialogRequestId) return
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
    setCommentsByRequest((prev) => ({
      ...prev,
      [commentDialogRequestId]: [...(prev[commentDialogRequestId] || []), comment],
    }))
    setNewComment("")
  }

  const activeCommentCompanyName = requests.find((r) => r.id === commentDialogRequestId)?.companyName

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Change Requests</h1>
            <p className="text-sm text-gray-600 mt-1">Review and action change requests submitted by customers</p>
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
                  <TableHead className="font-semibold text-white">Pending Requests</TableHead>
                  <TableHead className="font-semibold text-white">Next followup Date</TableHead>
                  <TableHead className="font-semibold text-white">Comment</TableHead>
                  <TableHead className="font-semibold text-white">Status</TableHead>
                  <TableHead className="font-semibold text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No change requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((req) => (
                    <TableRow key={req.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{req.companyName}</TableCell>
                      <TableCell>{req.branchLocation}</TableCell>
                      <TableCell>
                        {req.surveyType === "extinguisher" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold">
                            <Flame className="h-3 w-3" /> Extinguisher
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold">
                            <BookOpen className="h-3 w-3" /> Training
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                            {req.contactPhone}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
                            <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                            {req.contactEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                          {countsByCompany[req.companyName]?.pending ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <input
                          type="date"
                          value={req.nextFollowupDate}
                          onChange={(e) => handleFollowupDateChange(req.id, e.target.value)}
                          className="px-2 py-1.5 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#E63946] focus:border-[#E63946]"
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => { setCommentDialogRequestId(req.id); setNewComment("") }}
                          className="relative inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4 text-gray-400 hover:text-[#E63946]" />
                          {(commentsByRequest[req.id]?.length ?? 0) > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E63946] text-white text-[9px] font-bold flex items-center justify-center">
                              {commentsByRequest[req.id]?.length ?? 0}
                            </span>
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <FollowupStatusBadge date={req.nextFollowupDate} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(req.id)}
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

      <Dialog open={commentDialogRequestId !== null} onOpenChange={(open) => !open && setCommentDialogRequestId(null)}>
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
            {(commentDialogRequestId ? commentsByRequest[commentDialogRequestId] || [] : []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No comments yet. Be the first to add one.</p>
            ) : (
              (commentsByRequest[commentDialogRequestId!] || []).map((comment) => (
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
