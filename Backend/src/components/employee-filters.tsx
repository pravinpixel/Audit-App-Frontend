import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface EmployeeFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  profileStatusFilter: string[]
  onProfileStatusChange: (value: string[]) => void
  appStatusFilter: string[]
  onAppStatusChange: (value: string[]) => void
  departmentFilter: string[]
  onDepartmentChange: (value: string[]) => void
}

export function EmployeeFilters({
  searchQuery,
  onSearchChange,
  profileStatusFilter,
  onProfileStatusChange,
  appStatusFilter,
  onAppStatusChange,
  departmentFilter,
  onDepartmentChange,
}: EmployeeFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleClearAll = () => {
    onSearchChange("")
    onProfileStatusChange([])
    onAppStatusChange([])
    onDepartmentChange([])
  }

  const hasActiveFilters = profileStatusFilter.length > 0 || appStatusFilter.length > 0 || departmentFilter.length > 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Employee ID, Name, Email, Phone, or Department..."
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
            {/* Profile Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">
                    {profileStatusFilter.length > 0 ? `Status (${profileStatusFilter.length})` : "Profile Status"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {["Pending", "Verified"].map((status) => (
                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={profileStatusFilter.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onProfileStatusChange([...profileStatusFilter, status])
                          } else {
                            onProfileStatusChange(profileStatusFilter.filter((s) => s !== status))
                          }
                        }}
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* App Status Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">
                    {appStatusFilter.length > 0 ? `App Status (${appStatusFilter.length})` : "App Status"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {["Active", "Inactive"].map((status) => (
                    <label key={status} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={appStatusFilter.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onAppStatusChange([...appStatusFilter, status])
                          } else {
                            onAppStatusChange(appStatusFilter.filter((s) => s !== status))
                          }
                        }}
                      />
                      <span className="text-sm">{status}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Department Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9 border-gray-300 bg-transparent">
                  <span className="text-sm">
                    {departmentFilter.length > 0 ? `Department (${departmentFilter.length})` : "All Departments"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  {["Fire Safety", "Emergency Response", "Training & Development", "Compliance"].map((dept) => (
                    <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={departmentFilter.includes(dept)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onDepartmentChange([...departmentFilter, dept])
                          } else {
                            onDepartmentChange(departmentFilter.filter((d) => d !== dept))
                          }
                        }}
                      />
                      <span className="text-sm">{dept}</span>
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
              className="h-8 text-xs text-[#E63946] hover:text-[#E63946] hover:bg-[#E63946]/10"
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
