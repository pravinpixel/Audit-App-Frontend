import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Upload, X, ImageIcon, Check, ChevronsUpDown } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { cn } from "@/lib/utils"

const positionDimensions: Record<string, { width: number; height: number }> = {
  Top: { width: 1200, height: 150 },
  Bottom: { width: 1200, height: 150 },
  Left: { width: 300, height: 600 },
  Right: { width: 300, height: 600 },
}

// Mock location data
const statesData = [
  { id: "MH", name: "Maharashtra" },
  { id: "KA", name: "Karnataka" },
  { id: "TN", name: "Tamil Nadu" },
  { id: "DL", name: "Delhi" },
  { id: "GJ", name: "Gujarat" },
]

const citiesData: Record<string, { id: string; name: string }[]> = {
  MH: [
    { id: "MUM", name: "Mumbai" },
    { id: "PUN", name: "Pune" },
    { id: "NAG", name: "Nagpur" },
    { id: "NAS", name: "Nashik" },
  ],
  KA: [
    { id: "BLR", name: "Bangalore" },
    { id: "MYS", name: "Mysore" },
    { id: "HUB", name: "Hubli" },
  ],
  TN: [
    { id: "CHE", name: "Chennai" },
    { id: "CBE", name: "Coimbatore" },
    { id: "MDU", name: "Madurai" },
  ],
  DL: [
    { id: "NDL", name: "New Delhi" },
    { id: "SDL", name: "South Delhi" },
    { id: "EDL", name: "East Delhi" },
  ],
  GJ: [
    { id: "AMD", name: "Ahmedabad" },
    { id: "SRT", name: "Surat" },
    { id: "VAD", name: "Vadodara" },
  ],
}

const pincodesData: Record<string, { id: string; name: string }[]> = {
  MUM: [
    { id: "400001", name: "400001" },
    { id: "400002", name: "400002" },
    { id: "400003", name: "400003" },
  ],
  PUN: [
    { id: "411001", name: "411001" },
    { id: "411002", name: "411002" },
    { id: "411003", name: "411003" },
  ],
  NAG: [
    { id: "440001", name: "440001" },
    { id: "440002", name: "440002" },
  ],
  NAS: [
    { id: "422001", name: "422001" },
    { id: "422002", name: "422002" },
  ],
  BLR: [
    { id: "560001", name: "560001" },
    { id: "560002", name: "560002" },
    { id: "560003", name: "560003" },
  ],
  MYS: [
    { id: "570001", name: "570001" },
    { id: "570002", name: "570002" },
  ],
  HUB: [
    { id: "580001", name: "580001" },
    { id: "580002", name: "580002" },
  ],
  CHE: [
    { id: "600001", name: "600001" },
    { id: "600002", name: "600002" },
    { id: "600003", name: "600003" },
  ],
  CBE: [
    { id: "641001", name: "641001" },
    { id: "641002", name: "641002" },
  ],
  MDU: [
    { id: "625001", name: "625001" },
    { id: "625002", name: "625002" },
  ],
  NDL: [
    { id: "110001", name: "110001" },
    { id: "110002", name: "110002" },
  ],
  SDL: [
    { id: "110017", name: "110017" },
    { id: "110019", name: "110019" },
  ],
  EDL: [
    { id: "110091", name: "110091" },
    { id: "110092", name: "110092" },
  ],
  AMD: [
    { id: "380001", name: "380001" },
    { id: "380002", name: "380002" },
  ],
  SRT: [
    { id: "395001", name: "395001" },
    { id: "395002", name: "395002" },
  ],
  VAD: [
    { id: "390001", name: "390001" },
    { id: "390002", name: "390002" },
  ],
}

type PositionType = "Top" | "Bottom" | "Left" | "Right"

interface BannerUpload {
  position: PositionType
  imagePreview: string | null
  fileName: string
}

// Mock banner data for editing
const mockBannerData: Record<string, {
  bannerTitle: string
  customer: string
  description: string
  status: string
  positions: PositionType[]
  redirectType: string
  redirectLink: string
  openInNewTab: boolean
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  states: string[]
  cities: string[]
  pincodes: string[]
}> = {
  BNR001: {
    bannerTitle: "Summer Safety Campaign",
    customer: "ABC Industries",
    description: "Promotional banner for summer safety awareness campaign",
    status: "Active",
    positions: ["Top"],
    redirectType: "external",
    redirectLink: "https://example.com/summer-campaign",
    openInNewTab: true,
    startDate: "2025-01-01",
    startTime: "09:00",
    endDate: "2025-03-31",
    endTime: "18:00",
    states: ["MH"],
    cities: ["MUM", "PUN"],
    pincodes: ["400001", "411001"],
  },
  BNR002: {
    bannerTitle: "Fire Safety Awareness",
    customer: "XYZ Corporation",
    description: "Fire safety awareness campaign banner",
    status: "Active",
    positions: ["Right"],
    redirectType: "internal",
    redirectLink: "/fire-safety",
    openInNewTab: false,
    startDate: "2025-01-15",
    startTime: "00:00",
    endDate: "2025-04-15",
    endTime: "23:59",
    states: ["KA"],
    cities: ["BLR"],
    pincodes: ["560001"],
  },
  BNR003: {
    bannerTitle: "Emergency Evacuation Guide",
    customer: "Tech Solutions Ltd",
    description: "Emergency evacuation guidelines banner",
    status: "Scheduled",
    positions: ["Left"],
    redirectType: "internal",
    redirectLink: "/evacuation-guide",
    openInNewTab: false,
    startDate: "2025-02-01",
    startTime: "00:00",
    endDate: "2025-04-30",
    endTime: "23:59",
    states: ["TN"],
    cities: ["CHE"],
    pincodes: ["600001"],
  },
  BNR004: {
    bannerTitle: "Annual Safety Training",
    customer: "Global Manufacturing",
    description: "Annual safety training program banner",
    status: "Draft",
    positions: ["Bottom"],
    redirectType: "external",
    redirectLink: "https://example.com/training",
    openInNewTab: true,
    startDate: "2024-12-01",
    startTime: "09:00",
    endDate: "2024-12-31",
    endTime: "18:00",
    states: ["DL"],
    cities: ["NDL"],
    pincodes: ["110001"],
  },
  BNR005: {
    bannerTitle: "New Safety Equipment Launch",
    customer: "Safety First Inc",
    description: "New safety equipment product launch banner",
    status: "Draft",
    positions: ["Top", "Right"],
    redirectType: "external",
    redirectLink: "https://example.com/new-equipment",
    openInNewTab: true,
    startDate: "2025-03-01",
    startTime: "00:00",
    endDate: "2025-06-30",
    endTime: "23:59",
    states: ["GJ"],
    cities: ["AMD", "SRT"],
    pincodes: ["380001", "395001"],
  },
  BNR006: {
    bannerTitle: "Workplace Hazard Awareness",
    customer: "Industrial Corp",
    description: "Workplace hazard awareness campaign",
    status: "Active",
    positions: ["Right"],
    redirectType: "internal",
    redirectLink: "/hazard-awareness",
    openInNewTab: false,
    startDate: "2025-01-10",
    startTime: "00:00",
    endDate: "2025-02-10",
    endTime: "23:59",
    states: ["MH", "KA"],
    cities: ["MUM", "BLR"],
    pincodes: ["400001", "560001"],
  },
}

export default function EditBannerPage() {
  const resolvedParams = useParams() as { id: string }
  const navigate = useNavigate()
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const [formData, setFormData] = useState({
    bannerTitle: "",
    customer: "",
    description: "",
    status: "Draft",
    redirectType: "external",
    redirectLink: "",
    openInNewTab: false,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  })

  const [selectedPositions, setSelectedPositions] = useState<PositionType[]>([])
  const [bannerUploads, setBannerUploads] = useState<Record<PositionType, BannerUpload>>({
    Top: { position: "Top", imagePreview: null, fileName: "" },
    Bottom: { position: "Bottom", imagePreview: null, fileName: "" },
    Left: { position: "Left", imagePreview: null, fileName: "" },
    Right: { position: "Right", imagePreview: null, fileName: "" },
  })
  const [dragActive, setDragActive] = useState<string | null>(null)

  // Location filters state
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedPincodes, setSelectedPincodes] = useState<string[]>([])
  const [stateOpen, setStateOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [pincodeOpen, setPincodeOpen] = useState(false)

  // Mock customers list
  const customers = [
    "ABC Industries",
    "XYZ Corporation",
    "Tech Solutions Ltd",
    "Global Manufacturing",
    "Safety First Inc",
    "Industrial Corp",
  ]

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      navigate("/")
      return
    }

    // Load existing banner data
    const bannerData = mockBannerData[resolvedParams.id]
    if (bannerData) {
      setFormData({
        bannerTitle: bannerData.bannerTitle,
        customer: bannerData.customer,
        description: bannerData.description,
        status: bannerData.status,
        redirectType: bannerData.redirectType,
        redirectLink: bannerData.redirectLink,
        openInNewTab: bannerData.openInNewTab,
        startDate: bannerData.startDate,
        startTime: bannerData.startTime,
        endDate: bannerData.endDate,
        endTime: bannerData.endTime,
      })
      setSelectedPositions(bannerData.positions)
      setSelectedStates(bannerData.states)
      setSelectedCities(bannerData.cities)
      setSelectedPincodes(bannerData.pincodes)
    }
  }, [navigate, resolvedParams.id])

  // Get available cities based on selected states
  const availableCities = selectedStates.flatMap((stateId) => citiesData[stateId] || [])

  // Get available pincodes based on selected cities
  const availablePincodes = selectedCities.flatMap((cityId) => pincodesData[cityId] || [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePositionChange = (position: PositionType) => {
    setSelectedPositions([position])
  }

  const handleDrag = (e: React.DragEvent, position: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(position)
    } else if (e.type === "dragleave") {
      setDragActive(null)
    }
  }

  const handleDrop = (e: React.DragEvent, position: PositionType) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(null)

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0], position)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, position: PositionType) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0], position)
    }
  }

  const handleFile = (file: File, position: PositionType) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (jpg, png, webp, or gif)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setBannerUploads((prev) => ({
        ...prev,
        [position]: {
          ...prev[position],
          imagePreview: e.target?.result as string,
          fileName: file.name,
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (position: PositionType) => {
    setBannerUploads((prev) => ({
      ...prev,
      [position]: {
        ...prev[position],
        imagePreview: null,
        fileName: "",
      },
    }))
    const ref = fileInputRefs.current[position]
    if (ref) {
      ref.value = ""
    }
  }

  const handleSelectAllStates = () => {
    if (selectedStates.length === statesData.length) {
      setSelectedStates([])
    } else {
      setSelectedStates(statesData.map((s) => s.id))
    }
  }

  const handleSelectAllCities = () => {
    if (selectedCities.length === availableCities.length) {
      setSelectedCities([])
    } else {
      setSelectedCities(availableCities.map((c) => c.id))
    }
  }

  const handleSelectAllPincodes = () => {
    if (selectedPincodes.length === availablePincodes.length) {
      setSelectedPincodes([])
    } else {
      setSelectedPincodes(availablePincodes.map((p) => p.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Update logic here
    navigate("/banner-management")
  }

  const handlePositionToggle = (position: PositionType) => {
    setSelectedPositions((prev) =>
      prev.includes(position) ? prev.filter((p) => p !== position) : [...prev, position]
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Banner</h1>
          <p className="text-sm text-gray-600 mt-1">Dashboard - Advertisement / Banner Management - Edit Banner</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Banner List
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bannerTitle">
                      Banner Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bannerTitle"
                      placeholder="Enter banner title"
                      value={formData.bannerTitle}
                      onChange={(e) => handleInputChange("bannerTitle", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer">
                      Customer <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.customer} onValueChange={(value) => handleInputChange("customer", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer} value={customer}>
                            {customer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Banner Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter banner description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Location Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* State Multi-Select */}
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Popover open={stateOpen} onOpenChange={setStateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-transparent"
                        >
                          {selectedStates.length === 0
                            ? "Select States"
                            : selectedStates.length === statesData.length
                              ? "All States"
                              : `${selectedStates.length} state(s) selected`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0">
                        <Command>
                          <CommandInput placeholder="Search state..." />
                          <CommandList>
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem onSelect={handleSelectAllStates}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedStates.length === statesData.length ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Select All
                              </CommandItem>
                              <CommandSeparator />
                              {statesData.map((state) => (
                                <CommandItem
                                  key={state.id}
                                  onSelect={() => {
                                    setSelectedStates((prev) =>
                                      prev.includes(state.id)
                                        ? prev.filter((s) => s !== state.id)
                                        : [...prev, state.id]
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedStates.includes(state.id) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {state.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* City Multi-Select */}
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Popover open={cityOpen} onOpenChange={setCityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-transparent"
                          disabled={selectedStates.length === 0}
                        >
                          {selectedCities.length === 0
                            ? "Select Cities"
                            : availableCities.length > 0 && selectedCities.length === availableCities.length
                              ? "All Cities"
                              : `${selectedCities.length} city(ies) selected`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0">
                        <Command>
                          <CommandInput placeholder="Search city..." />
                          <CommandList>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem onSelect={handleSelectAllCities}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    availableCities.length > 0 && selectedCities.length === availableCities.length
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                Select All
                              </CommandItem>
                              <CommandSeparator />
                              {availableCities.map((city) => (
                                <CommandItem
                                  key={city.id}
                                  onSelect={() => {
                                    setSelectedCities((prev) =>
                                      prev.includes(city.id)
                                        ? prev.filter((c) => c !== city.id)
                                        : [...prev, city.id]
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCities.includes(city.id) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {city.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Pincode Multi-Select */}
                  <div className="space-y-2">
                    <Label>Pincode</Label>
                    <Popover open={pincodeOpen} onOpenChange={setPincodeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between bg-transparent"
                          disabled={selectedCities.length === 0}
                        >
                          {selectedPincodes.length === 0
                            ? "Select Pincodes"
                            : availablePincodes.length > 0 && selectedPincodes.length === availablePincodes.length
                              ? "All Pincodes"
                              : `${selectedPincodes.length} pincode(s) selected`}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0">
                        <Command>
                          <CommandInput placeholder="Search pincode..." />
                          <CommandList>
                            <CommandEmpty>No pincode found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem onSelect={handleSelectAllPincodes}>
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    availablePincodes.length > 0 && selectedPincodes.length === availablePincodes.length
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                Select All
                              </CommandItem>
                              <CommandSeparator />
                              {availablePincodes.map((pincode) => (
                                <CommandItem
                                  key={pincode.id}
                                  onSelect={() => {
                                    setSelectedPincodes((prev) =>
                                      prev.includes(pincode.id)
                                        ? prev.filter((p) => p !== pincode.id)
                                        : [...prev, pincode.id]
                                    )
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPincodes.includes(pincode.id) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {pincode.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Placement Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Placement Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>
                    Select Position <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={selectedPositions[0] || ""}
                    onValueChange={(value) => handlePositionChange(value as PositionType)}
                    className="flex flex-wrap gap-4"
                  >
                    {(["Top", "Bottom", "Left", "Right"] as PositionType[]).map((position) => (
                      <div key={position} className="flex items-center space-x-2">
                        <RadioGroupItem value={position} id={`edit-position-${position.toLowerCase()}`} />
                        <Label htmlFor={`edit-position-${position.toLowerCase()}`} className="cursor-pointer">
                          {position} {position === "Left" || position === "Right" ? "Sidebar" : ""}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {selectedPositions.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <p className="text-sm text-yellow-700">Please select at least one position to upload banners.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Banner Upload - Dynamic based on selected positions */}
            {selectedPositions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Banner Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedPositions.map((position) => {
                    const dimensions = positionDimensions[position]
                    const upload = bannerUploads[position]

                    return (
                      <div key={position} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label className="text-base font-medium">{position} Banner</Label>
                          <span className="text-sm text-gray-500">
                            Recommended: {dimensions.width} x {dimensions.height} px
                          </span>
                        </div>

                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            dragActive === position
                              ? "border-[#E63946] bg-[#E63946]/5"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDragEnter={(e) => handleDrag(e, position)}
                          onDragLeave={(e) => handleDrag(e, position)}
                          onDragOver={(e) => handleDrag(e, position)}
                          onDrop={(e) => handleDrop(e, position)}
                        >
                          {upload.imagePreview ? (
                            <div className="space-y-3">
                              <div className="relative inline-block">
                                <img
                                  src={upload.imagePreview || "/placeholder.svg"}
                                  alt={`${position} Preview`}
                                  className="max-w-full max-h-48 rounded-md object-contain"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                                  onClick={() => removeImage(position)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-600">{upload.fileName}</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex justify-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-600 text-sm">Drag and drop your image here, or</p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 bg-transparent"
                                  onClick={() => fileInputRefs.current[position]?.click()}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Browse Files
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">
                                Supported: JPG, PNG, WEBP, GIF. Max: 5MB
                              </p>
                            </div>
                          )}
                          <input
                            ref={(el) => { fileInputRefs.current[position] = el }}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => handleFileInput(e, position)}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Redirect Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Redirect Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label>Redirect Type</Label>
                  <RadioGroup
                    value={formData.redirectType}
                    onValueChange={(value) => handleInputChange("redirectType", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="external" id="edit-external" />
                      <Label htmlFor="edit-external" className="cursor-pointer">External URL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="internal" id="edit-internal" />
                      <Label htmlFor="edit-internal" className="cursor-pointer">Internal Page</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-redirectLink">Redirect Link</Label>
                  <Input
                    id="edit-redirectLink"
                    placeholder={formData.redirectType === "external" ? "https://example.com" : "/page-name"}
                    value={formData.redirectLink}
                    onChange={(e) => handleInputChange("redirectLink", e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-openInNewTab"
                    checked={formData.openInNewTab}
                    onCheckedChange={(checked) => handleInputChange("openInNewTab", checked as boolean)}
                  />
                  <Label htmlFor="edit-openInNewTab" className="cursor-pointer">Open in new tab</Label>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Schedule Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-startTime">Start Time</Label>
                    <Input
                      id="edit-startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endTime">End Time</Label>
                    <Input
                      id="edit-endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#E63946] to-[#FF8C00] hover:from-[#D32F3F] hover:to-[#F57C00] text-white px-8"
              >
                Update Banner
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
