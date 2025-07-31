"use client"

import { useMemo, useState } from "react"
import type { User } from "firebase/auth"
import type { SortOption, ViewMode } from "@/lib/types"
import { useCryptoData } from "@/hooks/use-crypto-data"
import { useFavorites } from "@/hooks/use-favorites"
import { CryptoList } from "@/components/crypto-list"
import { SearchAndFilters } from "@/components/search-and-filters"
import { Loader2 } from "lucide-react"

interface CryptoDashboardProps {
  user: User | null
}

export function CryptoDashboard({ user }: CryptoDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("name-asc")
  const [viewMode, setViewMode] = useState<ViewMode>("all")

  const { cryptoData, loading: cryptoLoading, error: cryptoError } = useCryptoData()
  const { favorites, isLoading, toggleFavorite } = useFavorites(user) // <-- Cambio aquí

  const filteredAndSortedData = useMemo(() => {
    let data = cryptoData

    if (searchTerm.trim() !== "") {
      data = data.filter((crypto) =>
        crypto.baseAsset.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (viewMode === "favorites" && user) {
      data = data.filter((crypto) =>
        favorites.some((fav) => fav.symbol === crypto.symbol)
      )
    }

    data = [...data] // Clon para no mutar

    data.sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.baseAsset.localeCompare(b.baseAsset)
        case "name-desc":
          return b.baseAsset.localeCompare(a.baseAsset)
        case "change-asc":
          return parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent)
        case "change-desc":
          return parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)
        default:
          return 0
      }
    })

    return data
  }, [cryptoData, searchTerm, sortOption, viewMode, favorites, user])

  if (cryptoError) {
    return (
      <div className="text-center py-12">
        <p className="text-[#ef4444] text-lg">Failed to load crypto data</p>
        <p className="text-[#6b7280] mt-2">Please try again later</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        user={user}
      />

      {viewMode === "favorites" && !user && (
        <div className="text-center py-12">
          <p className="text-[#6b7280] text-lg">Sign in to view your favourites.</p>
        </div>
      )}

      {viewMode === "favorites" && user && filteredAndSortedData.length === 0 && !cryptoLoading && (
        <div className="text-center py-12">
          <p className="text-[#6b7280] text-lg">You haven't selected any favourite crypto yet.</p>
        </div>
      )}

      {cryptoLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-20">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#10b981]" />
            <span className="ml-2 text-[#6b7280]">Loading crypto data...</span>
          </div>
        </div>
      )}

      {filteredAndSortedData.length > 0 && (
        <CryptoList
          cryptoData={filteredAndSortedData}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          user={user}
          isLoading={isLoading} // <-- Cambio aquí
        />
      )}
    </div>
  )
}
