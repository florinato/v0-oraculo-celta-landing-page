"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth, isFirebaseConfigured } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false, error: null, isConfigured: false })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      console.log("[v0] Firebase not configured, auth disabled")
      setIsConfigured(false)
      setLoading(false)
      return
    }

    setIsConfigured(true)

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser)
          setLoading(false)
        },
        (err) => {
          console.error("[v0] Auth state change error:", err)
          setError(err instanceof Error ? err.message : "Authentication error")
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Authentication error"
      console.error("[v0] Auth setup error:", errorMessage)
      setError(errorMessage)
      setLoading(false)
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading, error, isConfigured }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
