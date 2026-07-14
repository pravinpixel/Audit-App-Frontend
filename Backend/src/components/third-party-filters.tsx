import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface ThirdPartyFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  profileStatusFilter: string[]
  onProfileStatusChange: (value: string[]) => void
}

export function ThirdPartyFilters({
  searchQuery,
  onSearchChange,
  profileStatusFilter,
  onProfileStatusChange,
}: ThirdPartyFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by Name, Email, Phone, City..."
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-48 justify-between h-9 border-gray-300 bg-transparent">
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
        </div>
      )}
    </div>
  )
}
