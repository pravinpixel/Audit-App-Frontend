import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

interface VendorFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  profileStatusFilter: string[]
  onProfileStatusChange: (values: string[]) => void
}

export function VendorFilters({
  searchQuery,
  onSearchChange,
  profileStatusFilter,
  onProfileStatusChange,
}: VendorFiltersProps) {
  const profileStatusOptions = ["Pending", "Verified", "Rejected"]

  const handleProfileStatusChange = (value: string) => {
    if (profileStatusFilter.includes(value)) {
      onProfileStatusChange(profileStatusFilter.filter((s) => s !== value))
    } else {
      onProfileStatusChange([...profileStatusFilter, value])
    }
  }

  const clearFilters = () => {
    onProfileStatusChange([])
  }

  const hasActiveFilters = profileStatusFilter.length > 0

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
      <div className="relative flex-1 w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 items-center w-full sm:w-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto justify-between bg-transparent">
              Profile Status
              {profileStatusFilter.length > 0 && <span className="ml-2 text-xs">({profileStatusFilter.length})</span>}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {profileStatusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={profileStatusFilter.includes(status)}
                onCheckedChange={() => handleProfileStatusChange(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-[#E63946] hover:text-[#E63946] hover:bg-[#E63946]/10"
          >
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  )
}
