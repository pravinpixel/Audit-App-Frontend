import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface CustomerFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  industryTypeFilter: string[]
  onIndustryTypeChange: (value: string[]) => void
  branchLocationFilter: string[]
  onBranchLocationChange: (value: string[]) => void
  headOfficeLocationFilter: string[]
  onHeadOfficeLocationChange: (value: string[]) => void
  stateFilter: string[]
  onStateChange: (value: string[]) => void
  cityFilter: string[]
  onCityChange: (value: string[]) => void
}

const industryTypes = ["IT Services", "Manufacturing", "Retail", "Healthcare", "Education"]
const branchLocations = [
  "Koramangala, Bangalore",
  "Peenya Industrial Area, Bangalore",
  "MG Road, Mumbai",
  "Jayanagar, Bangalore",
]
const headOfficeLocations = [
  "Electronic City, Bangalore",
  "Whitefield, Bangalore",
  "Andheri, Mumbai",
  "Indiranagar, Bangalore",
  "BTM Layout, Bangalore",
]
const states = ["Karnataka", "Maharashtra"]
const cities = ["Bangalore", "Mumbai"]

export function CustomerFilters({
  searchQuery,
  onSearchChange,
  industryTypeFilter,
  onIndustryTypeChange,
  branchLocationFilter,
  onBranchLocationChange,
  headOfficeLocationFilter,
  onHeadOfficeLocationChange,
  stateFilter,
  onStateChange,
  cityFilter,
  onCityChange,
}: CustomerFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const clearAllFilters = () => {
    onIndustryTypeChange([])
    onBranchLocationChange([])
    onHeadOfficeLocationChange([])
    onStateChange([])
    onCityChange([])
  }

  const hasActiveFilters =
    industryTypeFilter.length > 0 ||
    branchLocationFilter.length > 0 ||
    headOfficeLocationFilter.length > 0 ||
    stateFilter.length > 0 ||
    cityFilter.length > 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Customer Name, Industry Type, Location..."
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
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">
                    {industryTypeFilter.length > 0 ? `Industry Type (${industryTypeFilter.length})` : "Industry Type"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {industryTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={industryTypeFilter.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onIndustryTypeChange([...industryTypeFilter, type])
                          } else {
                            onIndustryTypeChange(industryTypeFilter.filter((t) => t !== type))
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
                <Button variant="outline" className="w-48 justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">
                    {branchLocationFilter.length > 0
                      ? `Branch Location (${branchLocationFilter.length})`
                      : "Branch Location"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-2">
                  {branchLocations.map((location) => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={branchLocationFilter.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onBranchLocationChange([...branchLocationFilter, location])
                          } else {
                            onBranchLocationChange(branchLocationFilter.filter((l) => l !== location))
                          }
                        }}
                      />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">
                    {headOfficeLocationFilter.length > 0
                      ? `Head Office (${headOfficeLocationFilter.length})`
                      : "Head Office Location"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-2">
                  {headOfficeLocations.map((location) => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={headOfficeLocationFilter.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onHeadOfficeLocationChange([...headOfficeLocationFilter, location])
                          } else {
                            onHeadOfficeLocationChange(headOfficeLocationFilter.filter((l) => l !== location))
                          }
                        }}
                      />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">{stateFilter.length > 0 ? `State (${stateFilter.length})` : "State"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {states.map((state) => (
                    <label key={state} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={stateFilter.includes(state)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onStateChange([...stateFilter, state])
                          } else {
                            onStateChange(stateFilter.filter((s) => s !== state))
                          }
                        }}
                      />
                      <span className="text-sm">{state}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">{cityFilter.length > 0 ? `City (${cityFilter.length})` : "City"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {cities.map((city) => (
                    <label key={city} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={cityFilter.includes(city)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onCityChange([...cityFilter, city])
                          } else {
                            onCityChange(cityFilter.filter((c) => c !== city))
                          }
                        }}
                      />
                      <span className="text-sm">{city}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                className="h-9 px-3 text-[#E63946] hover:text-[#E63946] hover:bg-gradient-to-r hover:from-[#E63946]/10 hover:to-[#FF8C00]/10"
                onClick={clearAllFilters}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
