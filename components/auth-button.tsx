"use client"

import { useState } from "react"
import { signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sparkles, LogOut, AlertCircle } from "lucide-react"

export function AuthButton() {
  const { user, error } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      console.error("[v0] Firebase not configured")
      return
    }

    try {
      setLoading(true)
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al iniciar sesión"
      console.error("[v0] Sign-in error:", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    if (!isFirebaseConfigured || !auth) {
      console.error("[v0] Firebase not configured")
      return
    }

    try {
      setLoading(true)
      await signOut(auth)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cerrar sesión"
      console.error("[v0] Sign-out error:", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (error && !isFirebaseConfigured) {
    return (
      <Button
        disabled
        variant="outline"
        size="sm"
        className="text-destructive bg-transparent"
        title="Firebase configuration required"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Configurar Firebase
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{user.displayName}</span>
        <Button
          onClick={handleSignOut}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="text-foreground hover:text-primary"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={loading || !isFirebaseConfigured}
      className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
      size="sm"
    >
      <Sparkles className="w-4 h-4 mr-2" />
      {loading ? "Iniciando..." : "Iniciar con Google"}
    </Button>
  )
}
