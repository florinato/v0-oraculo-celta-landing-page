"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { oracleCharacters } from "@/lib/oracle-characters"
import Image from "next/image"

export default function OracleQuestionPage() {
  const [question, setQuestion] = useState("")
  const router = useRouter()
  const params = useParams()
  const character = params.character as string

  const characterInfo = oracleCharacters[character as keyof typeof oracleCharacters]

  if (!characterInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Oráculo no encontrado</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  const handleConsultOracle = () => {
    if (question.trim()) {
      const encodedQuestion = encodeURIComponent(question)
      router.push(`/lectura?pregunta=${encodedQuestion}&personaje=${character}`)
    }
  }

  // Character-specific full scene pages
  if (character === "morvan" || character === "aislinn" || character === "sybil") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Integrated Background with Character */}
        <div className="absolute inset-0 z-0">
          <Image
            src={`/images/${character}-scene.jpg`}
            alt={`${characterInfo.name} en su ambiente místico`}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="absolute top-4 left-4 z-50 text-white hover:text-amber-200 hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="relative z-10 min-h-screen flex flex-col justify-end px-4 pb-8">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <Textarea
              placeholder="Escribe aquí tu pregunta para las cartas..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-32 text-lg bg-black/20 backdrop-blur-md border-2 border-amber-600/80 text-amber-100 placeholder:text-amber-300/50 focus:border-amber-500 resize-none"
            />

            <Button
              onClick={handleConsultOracle}
              disabled={!question.trim()}
              className="w-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Consultar a {characterInfo.name}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-serif text-primary font-bold">Oráculo de Elara</h1>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section className="container mx-auto px-4 py-16 text-center min-h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-4xl mx-auto space-y-8 w-full">
            {/* Character Portrait */}
            <div className={`flex justify-center mb-8`}>
              <div
                className={`relative w-48 h-48 rounded-full overflow-hidden border-4 ${characterInfo.borderColor} 
              bg-gradient-to-br ${characterInfo.color} shadow-2xl`}
              >
                <Image
                  src={characterInfo.image || "/placeholder.svg"}
                  alt={characterInfo.name}
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>

            {/* Character Info */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-serif text-balance leading-tight">
                Consulta a <span className="text-primary">{characterInfo.name}</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                {characterInfo.intro}
              </p>
            </div>

            {/* Question Input */}
            <div className="max-w-2xl mx-auto space-y-6">
              <Textarea
                placeholder="Escribe aquí tu pregunta para las cartas..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-32 text-lg bg-black/20 backdrop-blur-md border-2 border-amber-600/80 text-amber-100 placeholder:text-amber-300/50 focus:border-amber-500 resize-none"
              />

              <Button
                onClick={handleConsultOracle}
                size="lg"
                className="w-full md:w-auto px-12 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!question.trim()}
              >
                Consultar a {characterInfo.name}
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
