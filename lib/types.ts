export interface CryptoData {
  symbol: string
  lastPrice: string
  priceChangePercent: string
  baseAsset: string
}

export interface Favorite {
  userId: string
  symbol: string
  baseAsset: string
}

export type SortOption = "name-asc" | "name-desc" | "change-asc" | "change-desc"
export type ViewMode = "all" | "favorites"
