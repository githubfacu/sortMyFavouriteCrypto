"use client"

import { signInWithPopup, GoogleAuthProvider, signOut, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, UserRound } from "lucide-react"
import { useState } from "react"

interface AuthButtonProps {
  user: User | null
}

export function AuthButton({ user }: AuthButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4" />
          <span className="text-sm">{user.displayName}</span>
        </div>
        <Button
          onClick={handleSignOut}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-gray-700 hover:bg-gray-800 bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleSignIn} disabled={loading} className="bg-[#10b981] hover:bg-[#059669] text-white">
      <LogIn className="h-4 w-4 mr-2" />
      Sign in with Google
    </Button>
  )
}
