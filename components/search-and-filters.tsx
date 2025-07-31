"use client"

import type { User } from "firebase/auth"
import type { SortOption, ViewMode } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, List } from "lucide-react"

interface SearchAndFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  user: User | null
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  user,
}: SearchAndFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
        <Input
          placeholder="Search crypto assets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-[#6b7280] focus:border-[#10b981]"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            onClick={() => onViewModeChange("all")}
            size="sm"
            className={viewMode === "all" ? "bg-[#10b981] hover:bg-[#059669]" : "border-gray-700 hover:bg-gray-800"}
          >
            <List className="h-4 w-4 mr-2" />
            All Cryptos
          </Button>
          <Button
            variant={viewMode === "favorites" ? "default" : "outline"}
            onClick={() => onViewModeChange("favorites")}
            size="sm"
            disabled={!user}
            className={
              viewMode === "favorites"
                ? "bg-[#10b981] hover:bg-[#059669]"
                : "border-gray-700 hover:bg-gray-800 disabled:opacity-50"
            }
          >
            <Star className="h-4 w-4 mr-2" />
            Favorites
          </Button>
        </div>

        <Select value={sortOption} onValueChange={(value: SortOption) => onSortChange(value)}>
          <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="name-asc" className="text-white hover:bg-gray-800">
              Name (A-Z)
            </SelectItem>
            <SelectItem value="name-desc" className="text-white hover:bg-gray-800">
              Name (Z-A)
            </SelectItem>
            <SelectItem value="change-asc" className="text-white hover:bg-gray-800">
              Change (Low to High)
            </SelectItem>
            <SelectItem value="change-desc" className="text-white hover:bg-gray-800">
              Change (High to Low)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
