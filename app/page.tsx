"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generarTiradaCruzCelta } from "@/lib/tarot"
import { Moon, Sparkles, Star } from "lucide-react"
import { useState } from "react"

export default function OracleHomePage() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [respuesta, setRespuesta] = useState<string | null>(null)

  const handleConsultOracle = async () => {
    if (!question.trim()) {
      setError("Por favor, escribe tu pregunta para las cartas.")
      return
    }

    setIsLoading(true)
    setError(null)
    setRespuesta(null)

    try {
      // 1. Generar la tirada de cartas
      const cartas = generarTiradaCruzCelta()

      // 2. Llamar a la API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Interpreta esta tirada para mi pregunta.",
          question: question,
          cards: cartas,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.fallback) {
        throw new Error(data.message || "Un misterioso velo impide ver la respuesta.")
      }

      // 3. Mostrar la respuesta
      setRespuesta(data.message)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif text-primary font-bold">Oráculo de Elara</h1>
          <nav className="flex gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Sobre el Oráculo
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Privacidad
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-20">
        <section className="container mx-auto px-4 py-16 text-center min-h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-4xl mx-auto space-y-8 w-full">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                <Star className="w-6 h-6 text-primary absolute -top-2 -right-2 animate-bounce" />
                <Moon className="w-4 h-4 text-primary absolute -bottom-1 -left-2 animate-pulse" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif text-balance leading-tight">
              Desvela los secretos de tu <span className="text-primary">destino</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Consulta al Oráculo de Elara. Recibe una lectura de tarot profunda, personal e interactiva, guiada por la
              sabiduría de la inteligencia artificial.
            </p>

            <div className="max-w-2xl mx-auto space-y-6">
              <Textarea
                placeholder="Escribe aquí tu pregunta para las cartas..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-32 text-lg bg-card border-border focus:border-primary resize-none"
              />

              <Button
                onClick={handleConsultOracle}
                size="lg"
                className="w-full md:w-auto px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                disabled={!question.trim() || isLoading}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {isLoading ? "Consultando el destino..." : "Consultar al Oráculo"}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-center font-medium">{error}</p>
                </div>
              )}

              {respuesta && (
                <div className="mt-8 p-6 bg-card border border-border rounded-lg text-left animate-fade-in">
                  <h3 className="text-2xl font-serif text-primary mb-4">La Visión de Elara</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{respuesta}</p>
                </div>
              )}

              <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  🔒 <strong>Privacidad garantizada:</strong> No recopilamos ni almacenamos ningún dato de tu
                  conversación. Todas las consultas son completamente privadas y confidenciales.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
