"use client"

import { Card } from "@/lib/tarot"
import { Loader2, Sparkles } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

function ReadingContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [respuesta, setRespuesta] = useState<string | null>(null)
  const [cartas, setCartas] = useState<Card[]>([])

  useEffect(() => {
    // Asegurarse de que este código solo se ejecute en el cliente
    if (typeof window === "undefined") {
      return
    }

    const fetchReading = async () => {
      const question = searchParams.get("pregunta")
      const storedCards = localStorage.getItem("tirada_cartas")

      if (!question || !storedCards) {
        setError("No se encontró una consulta válida. Por favor, vuelve a empezar.")
        setIsLoading(false)
        return
      }

      const parsedCards: Card[] = JSON.parse(storedCards)
      setCartas(parsedCards)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Interpreta esta tirada para mi pregunta.",
            question: question,
            cards: parsedCards,
          }),
        })

        const data = await response.json()

        if (!response.ok || data.fallback) {
          throw new Error(data.message || "Un misterioso velo impide ver la respuesta.")
        }

        setRespuesta(data.message)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
        localStorage.removeItem("tirada_cartas") // Limpiar para la próxima consulta
      }
    }

    fetchReading()
  }, [searchParams]) // La dependencia es correcta, el efecto se ejecutará en el cliente

  if (isLoading) {
    return (
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
        <p className="text-xl text-muted-foreground">Las cartas se están alineando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Aquí podrías mostrar las cartas si quisieras */}
      <div className="p-6 bg-card border border-border rounded-lg text-left animate-fade-in">
        <h3 className="text-2xl font-serif text-primary mb-4 flex items-center">
          <Sparkles className="w-6 h-6 mr-3" />
          La Visión de Elara
        </h3>
        <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{respuesta}</p>
      </div>
    </div>
  )
}

export default function LecturaPage() {
  return (
    <main className="min-h-screen bg-background pt-24">
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div>Cargando...</div>}>
            <ReadingContent />
          </Suspense>
        </div>
      </section>
    </main>
  )
}