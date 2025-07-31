import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { collection, query, where, addDoc, deleteDoc, getDocs } from "firebase/firestore"
import { firestore } from "@/lib/firebase"
import type { Favorite, CryptoData } from "@/lib/types"

export function useFavorites(user: User | null) {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user) {
      setFavorites([])
      return
    }

    const fetchFavorites = async () => {
      try {
        const favoritesQuery = query(
          collection(firestore, "favoritos"),
          where("userId", "==", user.uid)
        )
        const snapshot = await getDocs(favoritesQuery)
        const favoritesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Favorite[]
        setFavorites(favoritesData)
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }

    fetchFavorites()
  }, [user])

  const toggleFavorite = async (crypto: CryptoData) => {
    if (!user) return

    // Set loading true solo para este símbolo
    setLoadingMap((prev) => ({ ...prev, [crypto.symbol]: true }))

    try {
      const existingFavorite = favorites.find((fav) => fav.symbol === crypto.symbol)

      if (existingFavorite) {
        // Remove from favorites
        const favoriteQuery = query(
          collection(firestore, "favoritos"),
          where("userId", "==", user.uid),
          where("symbol", "==", crypto.symbol),
        )

        const snapshot = await getDocs(favoriteQuery)
        const batchDeletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(batchDeletePromises)

        // Actualizar local state sin re-fetch
        setFavorites((prev) => prev.filter(fav => fav.symbol !== crypto.symbol))
      } else {
        // Add to favorites
        const docRef = await addDoc(collection(firestore, "favoritos"), {
          userId: user.uid,
          symbol: crypto.symbol,
          baseAsset: crypto.baseAsset,
        })

        // Actualizar local state sin re-fetch
        setFavorites((prev) => [...prev, { id: docRef.id, userId: user.uid, symbol: crypto.symbol, baseAsset: crypto.baseAsset }])
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      // Quitar loading solo para este símbolo
      setLoadingMap((prev) => ({ ...prev, [crypto.symbol]: false }))
    }
  }

  // Función para saber si un símbolo está cargando
  const isLoading = (symbol: string) => !!loadingMap[symbol]

  return { favorites, toggleFavorite, isLoading }
}
