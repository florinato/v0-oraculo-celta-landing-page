"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import * as tarotCardsModule from "@/lib/tarotCards"
import { ArrowLeft, Moon, Sparkles, Shield } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

const celticCrossPositions = [
  { id: 1, name: "1. La situación actual", position: "col-start-2 row-start-2" },
  { id: 2, name: "2. Lo que lo obstaculiza", position: "col-start-2 row-start-3" },
  { id: 3, name: "3. Su base o raíz", position: "col-start-2 row-start-4" },
  { id: 4, name: "4. Su pasado más reciente", position: "col-start-1 row-start-2" },
  { id: 5, name: "5. Las posibilidades", position: "col-start-2 row-start-1" },
  { id: 6, name: "6. Su futuro inmediato", position: "col-start-3 row-start-2" },
  { id: 7, name: "7. El consultante", position: "col-start-4 row-start-4" },
  { id: 8, name: "8. El entorno", position: "col-start-4 row-start-3" },
  { id: 9, name: "9. Anhelos o temores", position: "col-start-4 row-start-2" },
  { id: 10, name: "10. El desenlace final", position: "col-start-4 row-start-1" },
]

const tarotCards = tarotCardsModule.tarotCards

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const characterBackgrounds: Record<string, string> = {
  aislinn: "/images/aislinn-scene.jpg",
  morvan: "/images/morvan-scene.jpg",
  sybil: "/images/sybil-scene.jpg",
}

function ReadingContent() {
  const [showReading, setShowReading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string }>>([])
  const [newMessage, setNewMessage] = useState("")
  const [question, setQuestion] = useState("")
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [clickedCard, setClickedCard] = useState<number | null>(null)
  const [cardOrientations, setCardOrientations] = useState<boolean[]>([])
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [shuffledCards, setShuffledCards] = useState<typeof tarotCards>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const hasInitialized = useRef(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const pregunta = searchParams.get("pregunta")
    const personaje = searchParams.get("personaje")
    if (pregunta && !hasInitialized.current) {
      hasInitialized.current = true
      const decodedQuestion = decodeURIComponent(pregunta)
      const newShuffledCards = shuffleArray(tarotCards).slice(0, 10)
      const newOrientations = Array.from({ length: 10 }, () => Math.random() > 0.5)

      setQuestion(decodedQuestion)
      setSelectedCharacter(personaje)
      setCardOrientations(newOrientations)
      setShuffledCards(newShuffledCards)
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)

      setTimeout(() => {
        setShowReading(true)
        setTimeout(() => {
          setShowChat(true)
          initializeChat(decodedQuestion, newShuffledCards, newOrientations)
        }, 2000)
      }, 500)
    }
  }, [searchParams])

  const handleApiError = (error: any, context: "initialization" | "message") => {
    console.error(`[v0] Error during chat ${context}:`, error)

    const errorMessage =
      context === "initialization"
        ? "🌙 Las energías están alineándose. El oráculo necesita un momento para conectar con las fuerzas cósmicas. Por favor, intenta de nuevo en unos instantes."
        : "✨ Siento una interferencia momentánea en las energías. Las cartas necesitan realinearse. Por favor, intenta de nuevo."

    const messageUpdater = (prev: Array<{ sender: string; message: string }>) => [
      ...prev,
      { sender: "Madame Elara", message: errorMessage },
    ]
    setChatMessages(messageUpdater)
  }

  const initializeChat = async (pregunta: string, newShuffledCards: typeof tarotCards, newOrientations: boolean[]) => {
    setIsLoading(true)
    setIsGenerating(true)
    try {
      console.log("[v0] Initializing chat with question:", pregunta)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: pregunta,
          cards: newShuffledCards.map((card, index) => ({
            carta: card.name,
            posicion: celticCrossPositions[index].name,
            orientacion: newOrientations[index] ? "derecha" : "invertida",
            description: newOrientations[index] ? card.description.upright : card.description.reversed,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Chat initialization response:", data)

      if (data.conversationId) {
        setConversationId(data.conversationId)
      }

      setChatMessages([
        {
          sender: "Madame Elara",
          message:
            data.message || "Bienvenido/a al reino de las cartas. Las energías están alineándose para tu consulta.",
        },
      ])
    } catch (error) {
      handleApiError(error, "initialization")
    } finally {
      setIsLoading(false)
      setIsGenerating(false)
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && !isLoading) {
      const userMessage = newMessage
      setNewMessage("")

      setChatMessages((prev) => [...prev, { sender: "Tú", message: userMessage }])

      setIsLoading(true)

      try {
        console.log("[v0] Sending message:", userMessage)

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            conversationId: conversationId,
            question: question,
            cards: shuffledCards.map((card, index) => ({
              carta: card.name,
              posicion: celticCrossPositions[index].name,
              orientacion: cardOrientations[index] ? "derecha" : "invertida",
              description: cardOrientations[index] ? card.description.upright : card.description.reversed,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("[v0] Message response:", data)

        if (data.conversationId) {
          setConversationId(data.conversationId)
        }

        setChatMessages((prev) => [
          ...prev,
          {
            sender: "Madame Elara",
            message:
              data.message ||
              "Las cartas susurran secretos que requieren más claridad. Reformula tu pregunta, querido/a consultante.",
          },
        ])
      } catch (error) {
        handleApiError(error, "message")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCardClick = (index: number) => {
    if (isTouchDevice) {
      setClickedCard(clickedCard === index ? null : index)
    }
  }

  const handleCardHover = (index: number) => {
    if (!isTouchDevice) {
      setHoveredCard(index)
    }
  }

  const handleCardLeave = () => {
    if (!isTouchDevice) {
      setHoveredCard(null)
    }
  }

  const backgroundImage = selectedCharacter ? characterBackgrounds[selectedCharacter] : null

  return (
    <div className="min-h-screen bg-background relative">
      {/* Character Background with low opacity */}
      {backgroundImage && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src={backgroundImage || "/placeholder.svg"}
            alt=""
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      )}

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
        {/* Question Display */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-serif text-primary mb-4">Tu Pregunta</h2>
            <p className="text-lg text-muted-foreground italic">"{question}"</p>
          </div>
        </section>

        {/* Celtic Cross Reading */}
        {showReading && (
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-serif text-center mb-12 text-primary">Tu Tirada de la Cruz Celta</h2>

              <div className="grid grid-cols-4 grid-rows-5 gap-4 md:gap-8 max-w-xl mx-auto relative h-[700px]">
                {celticCrossPositions.map((positionInfo, index) => {
                  const isReversed = cardOrientations[index]
                  const card = shuffledCards[index]
                  const showTooltip = isTouchDevice ? clickedCard === index : hoveredCard === index

                  if (!card) return null

                  return (
                    <div key={positionInfo.id} className={`absolute ${positionInfo.position}`}>
                      <div
                        className="relative cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20 group"
                        onMouseEnter={() => handleCardHover(index)}
                        onMouseLeave={handleCardLeave}
                        onClick={() => handleCardClick(index)}
                      >
                        <div className="transition-transform duration-500">
                          <div className="relative w-22 h-38 rounded-xl overflow-hidden shadow-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-primary/20 backdrop-blur-sm group-hover:border-primary/60 group-hover:shadow-primary/30 group-hover:shadow-2xl transition-all duration-300">
                            {/* Efecto de brillo en hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Marco interior decorativo */}
                            <div className="absolute inset-1 border border-primary/20 rounded-lg pointer-events-none" />

                            {/* Imagen de la carta */}
                            <Image
                              src={card.image || "/placeholder.svg"}
                              alt={card.name}
                              width={88}
                              height={152}
                              className={`w-full h-full object-cover ${isReversed ? "rotate-180" : ""}`}
                            />

                            {/* Overlay sutil con gradiente */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-xs text-center text-muted-foreground font-medium card-position-name drop-shadow-sm">
                            {positionInfo.name}
                          </p>
                        </div>

                        <div
                          className={`absolute z-50 bg-card/95 backdrop-blur-md border-2 border-primary/40 rounded-xl p-4 shadow-2xl w-72 max-w-[90vw]
                          ${positionInfo.id === 2 ? "top-[calc(100%+1rem)] left-1/2 -translate-x-1/2" : index < 5 ? "-top-4 left-full ml-4" : "-bottom-4 right-full mr-4"}
                          transform transition-all duration-200 pointer-events-none
                          ${showTooltip ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                          md:pointer-events-none
                          before:absolute before:w-3 before:h-3 before:bg-card before:border-l-2 before:border-t-2 before:border-primary/40 before:rotate-45
                          ${positionInfo.id === 2 ? "before:-top-1.5 before:left-1/2 before:-translate-x-1/2" : index < 5 ? "before:left-0 before:top-1/2 before:-translate-y-1/2 before:-translate-x-1/2" : "before:right-0 before:top-1/2 before:-translate-y-1/2 before:translate-x-1/2"}
                          `}
                        >
                          <div className="relative z-10">
                            <h3 className="font-serif text-primary font-semibold mb-1 text-sm flex items-center gap-2">
                              <Sparkles className="w-3 h-3" />
                              {positionInfo.name}
                            </h3>
                            <h4 className="font-semibold mb-2 text-sm text-foreground">
                              {card.name} {isReversed ? "(Invertida)" : "(Derecha)"}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {isReversed ? card.description.reversed : card.description.upright}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Chat Section */}
        {showChat && (
          <section className="container mx-auto px-0 md:px-4 py-16">
            <div className="max-w-4xl mx-auto px-2 md:px-0">
              <h2 className="text-3xl font-serif text-center mb-8 text-primary">Interpretación y Consulta</h2>

              <Card className="bg-card/95 backdrop-blur-sm border-primary/30">
                <CardContent className="p-0 md:p-6">
                  <div className="space-y-6 mb-6 px-2 md:px-0">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === "Tú" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-3xl p-4 rounded-lg ${
                            msg.sender === "Tú"
                              ? "bg-primary text-primary-foreground ml-2 md:ml-12"
                              : "bg-muted mr-2 md:mr-12"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {msg.sender === "Madame Elara" && <Moon className="w-4 h-4 text-primary" />}
                            <p className="font-semibold text-sm">{msg.sender}</p>
                          </div>
                          <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-li:my-1">
                            <ReactMarkdown>{msg.message}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-3xl p-4 rounded-lg bg-muted mr-2 md:mr-12">
                          <div className="flex items-center gap-2 mb-2">
                            <Moon className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-sm">Madame Elara</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-spin" />
                            <p className="text-sm text-muted-foreground">Consultando las cartas...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 md:gap-3 px-2 md:px-0">
                    <Input
                      placeholder="Haz una pregunta de seguimiento..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-background border-border focus:border-primary"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isLoading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : "Enviar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 p-5 bg-amber-50/5 rounded-lg border-l-4 border-amber-200/60">
                <div className="flex items-start gap-4">
                  <Shield className="w-5 h-5 text-amber-200/80 mt-0.5 flex-shrink-0" />
                  <div className="text-left space-y-2">
                    <p className="text-base text-amber-200/90 tracking-wide">
                      consulta anónima ◆ lecturas gratis ◆ sin necesidad de registro
                    </p>
                    <p className="text-sm text-stone-300 font-serif italic leading-relaxed">
                      <span className="font-semibold text-amber-200/90">Privacidad garantizada:</span> No recopilamos ni
                      almacenamos ningún dato de tu conversación. Todas las consultas son completamente privadas y
                      confidenciales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <ReadingContent />
    </Suspense>
  )
}
