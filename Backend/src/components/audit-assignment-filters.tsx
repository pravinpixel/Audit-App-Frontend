import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface AuditAssignmentFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string[]
  onStatusChange: (value: string[]) => void
  buildingTypeFilter: string[]
  onBuildingTypeChange: (value: string[]) => void
  locationFilter: string[]
  onLocationChange: (value: string[]) => void
}

export function AuditAssignmentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  buildingTypeFilter,
  onBuildingTypeChange,
  locationFilter,
  onLocationChange,
}: AuditAssignmentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleClearAll = () => {
    onSearchChange("")
    onStatusChange([])
    onBuildingTypeChange([])
    onLocationChange([])
  }

  const hasActiveFilters = statusFilter.length > 0 || buildingTypeFilter.length > 0 || locationFilter.length > 0

  const statuses = ["Assigned", "Not Assigned"]
  const buildingTypes = [
    "Office Complex",
    "Hospital",
    "Shopping Mall",
    "Hotel",
    "Tech Park",
    "Educational Institute",
    "Industrial Complex",
    "Residential Complex",
  ]
  const locations = ["Gurgaon", "Bangalore", "Mumbai", "Jaipur", "Hyderabad", "Pune", "Chennai", "Kolkata"]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Company ID, Company, Contact, or Location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 border-gray-300"
          />
        </div>

        <Button
          variant="outline"
          className="h-10 px-4 border-gray-300 bg-transparent whitespace-nowrap"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {showFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {statusFilter.length > 0 ? `Status (${statusFilter.length})` : "Assignment Status"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {statuses.map((status) => (
                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={statusFilter.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onStatusChange([...statusFilter, status])
                          } else {
                            onStatusChange(statusFilter.filter((s) => s !== status))
                          }
                        }}
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {buildingTypeFilter.length > 0 ? `Building (${buildingTypeFilter.length})` : "Building Type"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {buildingTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={buildingTypeFilter.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onBuildingTypeChange([...buildingTypeFilter, type])
                          } else {
                            onBuildingTypeChange(buildingTypeFilter.filter((t) => t !== type))
                          }
                        }}
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {locationFilter.length > 0 ? `Location (${locationFilter.length})` : "Location"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {locations.map((location) => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={locationFilter.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onLocationChange([...locationFilter, location])
                          } else {
                            onLocationChange(locationFilter.filter((l) => l !== location))
                          }
                        }}
                      />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-[#E63946] hover:text-[#E63946] hover:bg-gradient-to-r hover:from-[#E63946]/10 hover:to-[#FF8C00]/10"
              onClick={handleClearAll}
            >
              <X className="h-3 w-3 mr-1" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
