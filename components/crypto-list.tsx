"use client"

import type { User } from "firebase/auth"
import type { CryptoData, Favorite } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink, Loader2 } from "lucide-react"

interface CryptoListProps {
  cryptoData: CryptoData[]
  favorites: Favorite[]
  onToggleFavorite: (crypto: CryptoData) => Promise<void>
  user: User | null
  isLoading: (symbol: string) => boolean
}

export function CryptoList({ cryptoData, favorites, onToggleFavorite, user, isLoading }: CryptoListProps) {
  const isFavorite = (symbol: string) => {
    return favorites.some((fav) => fav.symbol === symbol)
  }

  const formatPrice = (price: string) => {
    const num = Number.parseFloat(price)
    if (num < 0.00001) {
      return num.toFixed(8)
    } else if (num < 0.01) {
      return num.toFixed(6)
    } else {
      return num.toFixed(4)
    }
  }

  const formatChange = (change: string) => {
    const num = Number.parseFloat(change)
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-[#6b7280] border-b border-gray-800">
        <div className="col-span-3">Asset</div>
        <div className="col-span-3">Price (BTC)</div>
        <div className="col-span-2">24h Change</div>
        <div className="col-span-2">Chart</div>
        <div className="col-span-2">Favorite</div>
      </div>

      {cryptoData.map((crypto) => (
        <div
          key={crypto.symbol}
          className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <div className="col-span-3 flex items-center">
            <div>
              <div className="font-medium text-white">{crypto.baseAsset}</div>
              <div className="text-sm text-[#6b7280]">{crypto.symbol}</div>
            </div>
          </div>

          <div className="col-span-3 flex items-center">
            <span className="font-mono text-white">{formatPrice(crypto.lastPrice)}</span>
          </div>

          <div className="col-span-2 flex items-center">
            <span
              className={`font-medium ${
                Number.parseFloat(crypto.priceChangePercent) >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
              }`}
            >
              {formatChange(crypto.priceChangePercent)}
            </span>
          </div>

          <div className="col-span-2 flex items-center">
            <Button variant="outline" size="sm" asChild className="border-none hover:bg-gray-700 bg-transparent">
              <a
                href={`https://www.binance.com/en/trade/${crypto.baseAsset}_BTC`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Chart
              </a>
            </Button>
          </div>

          <div className="col-span-2 flex items-center">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(crypto)}
                disabled={isLoading(crypto.symbol)}
                className="p-2 hover:opacity-80 transition-opacity"
              >
                {isLoading(crypto.symbol) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Star
                    className={`h-4 w-4 ${
                      isFavorite(crypto.symbol)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-[#6b7280] fill-[#6b7280]"
                    }`}
                  />
                )}
              </Button>
            ) : (
              <Star className="h-4 w-4 text-[#6b7280] fill-[#6b7280] opacity-50" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
