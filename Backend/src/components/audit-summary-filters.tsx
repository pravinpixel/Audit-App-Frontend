import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AuditSummaryFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  industryTypeFilter: string[]
  onIndustryTypeChange: (value: string[]) => void
  stateFilter: string[]
  onStateChange: (value: string[]) => void
  cityFilter: string[]
  onCityChange: (value: string[]) => void
}

export function AuditSummaryFilters({
  searchQuery,
  onSearchChange,
  industryTypeFilter,
  onIndustryTypeChange,
  stateFilter,
  onStateChange,
  cityFilter,
  onCityChange,
}: AuditSummaryFiltersProps) {
  const industryTypes = ["IT Services", "Manufacturing", "Retail", "Healthcare", "Education"]
  const states = ["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu"]
  const cities = ["Bangalore", "Mumbai", "New Delhi", "Chennai", "Pune"]

  const hasActiveFilters = industryTypeFilter.length > 0 || stateFilter.length > 0 || cityFilter.length > 0

  const clearAllFilters = () => {
    onIndustryTypeChange([])
    onStateChange([])
    onCityChange([])
  }

  const handleCheckboxChange = (value: string, currentValues: string[], onChange: (values: string[]) => void) => {
    if (currentValues.includes(value)) {
      onChange(currentValues.filter((v) => v !== value))
    } else {
      onChange([...currentValues, value])
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by company name, industry, location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Industry Type
                {industryTypeFilter.length > 0 && (
                  <span className="bg-[#E63946] text-white rounded-full px-2 py-0.5 text-xs">
                    {industryTypeFilter.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <Label className="font-semibold">Select Industry Type</Label>
                {industryTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${type}`}
                      checked={industryTypeFilter.includes(type)}
                      onCheckedChange={() => handleCheckboxChange(type, industryTypeFilter, onIndustryTypeChange)}
                    />
                    <label htmlFor={`industry-${type}`} className="text-sm cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                State
                {stateFilter.length > 0 && (
                  <span className="bg-[#E63946] text-white rounded-full px-2 py-0.5 text-xs">{stateFilter.length}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <Label className="font-semibold">Select State</Label>
                {states.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={`state-${state}`}
                      checked={stateFilter.includes(state)}
                      onCheckedChange={() => handleCheckboxChange(state, stateFilter, onStateChange)}
                    />
                    <label htmlFor={`state-${state}`} className="text-sm cursor-pointer">
                      {state}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                City
                {cityFilter.length > 0 && (
                  <span className="bg-[#E63946] text-white rounded-full px-2 py-0.5 text-xs">{cityFilter.length}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-3">
                <Label className="font-semibold">Select City</Label>
                {cities.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={cityFilter.includes(city)}
                      onCheckedChange={() => handleCheckboxChange(city, cityFilter, onCityChange)}
                    />
                    <label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
                      {city}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAllFilters} className="text-[#E63946] hover:text-[#E63946]/80">
              <X className="h-4 w-4 mr-1" />
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
