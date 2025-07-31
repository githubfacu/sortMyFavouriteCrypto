"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { AuthButton } from "@/components/auth-button"
import { CryptoDashboard } from "@/components/crypto-dashboard"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#10b981]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#10b981]">Sort my Favourite Crypto</h1>
          <AuthButton user={user} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <CryptoDashboard user={user} />
      </main>
    </div>
  )
}
