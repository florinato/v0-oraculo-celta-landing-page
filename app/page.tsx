"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OracleHomePage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/oracle/aislinn")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center text-muted-foreground">Cargando...</div>
    </div>
  )
}
