"use client"

import { useState, useEffect } from "react"
import type { CryptoData } from "@/lib/types"

export function useCryptoData() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("https://api.binance.com/api/v3/ticker/24hr")

        if (!response.ok) {
          throw new Error("Failed to fetch crypto data")
        }

        const data = await response.json()

        // Filter for BTC pairs only
        const btcPairs = data
          .filter((item: any) => item.symbol.endsWith("BTC"))
          .map((item: any) => ({
            symbol: item.symbol,
            lastPrice: item.lastPrice,
            priceChangePercent: item.priceChangePercent,
            baseAsset: item.symbol.replace("BTC", ""),
          }))
          .filter((item: CryptoData) => item.baseAsset !== "") // Remove pure BTC

        setCryptoData(btcPairs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchCryptoData()

    // Refresh data every 60 seconds
    const interval = setInterval(fetchCryptoData, 60000)

    return () => clearInterval(interval)
  }, [])

  return { cryptoData, loading, error }
}
