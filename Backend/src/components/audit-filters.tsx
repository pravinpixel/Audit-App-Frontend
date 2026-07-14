import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface AuditFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  industryTypeFilter: string[]
  onIndustryTypeChange: (value: string[]) => void
  branchLocationFilter: string[]
  onBranchLocationChange: (value: string[]) => void
  headOfficeFilter: string[]
  onHeadOfficeChange: (value: string[]) => void
  stateFilter: string[]
  onStateChange: (value: string[]) => void
  cityFilter: string[]
  onCityChange: (value: string[]) => void
}

export function AuditFilters({
  searchQuery,
  onSearchChange,
  industryTypeFilter,
  onIndustryTypeChange,
  branchLocationFilter,
  onBranchLocationChange,
  headOfficeFilter,
  onHeadOfficeChange,
  stateFilter,
  onStateChange,
  cityFilter,
  onCityChange,
}: AuditFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleClearAll = () => {
    onSearchChange("")
    onIndustryTypeChange([])
    onBranchLocationChange([])
    onHeadOfficeChange([])
    onStateChange([])
    onCityChange([])
  }

  const hasActiveFilters =
    industryTypeFilter.length > 0 ||
    branchLocationFilter.length > 0 ||
    headOfficeFilter.length > 0 ||
    stateFilter.length > 0 ||
    cityFilter.length > 0

  const industryTypes = ["IT Services", "Manufacturing", "Retail", "Healthcare", "Education"]
  const branches = [
    "Bangalore - Koramangala",
    "Mumbai - Andheri",
    "Delhi - Connaught Place",
    "Chennai - T Nagar",
    "Pune - Hinjewadi",
  ]
  const headOffices = ["Bangalore", "Mumbai", "New Delhi", "Chennai", "Pune"]
  const states = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu"]
  const cities = ["Bangalore", "Mumbai", "New Delhi", "Chennai", "Pune"]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Company Name, Industry, Location, State, or City..."
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {industryTypeFilter.length > 0 ? `Industry (${industryTypeFilter.length})` : "Industry Type"}
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
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {branchLocationFilter.length > 0 ? `Branch (${branchLocationFilter.length})` : "Branch Location"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-2">
                  {branches.map((branch) => (
                    <label key={branch} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={branchLocationFilter.includes(branch)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onBranchLocationChange([...branchLocationFilter, branch])
                          } else {
                            onBranchLocationChange(branchLocationFilter.filter((b) => b !== branch))
                          }
                        }}
                      />
                      <span className="text-sm">{branch}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {headOfficeFilter.length > 0 ? `Head Office (${headOfficeFilter.length})` : "Head Office"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {headOffices.map((office) => (
                    <label key={office} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={headOfficeFilter.includes(office)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onHeadOfficeChange([...headOfficeFilter, office])
                          } else {
                            onHeadOfficeChange(headOfficeFilter.filter((o) => o !== office))
                          }
                        }}
                      />
                      <span className="text-sm">{office}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {stateFilter.length > 0 ? `State (${stateFilter.length})` : "State"}
                  </span>
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
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm truncate">
                    {cityFilter.length > 0 ? `City (${cityFilter.length})` : "City"}
                  </span>
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
