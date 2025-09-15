"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as tarotCardsModule from "@/lib/tarotCards";
import { ArrowLeft, Moon, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const celticCrossPositions = [
  { id: 1, name: "1. La situación actual", position: "col-start-2 row-start-2" },
  { id: 2, name: "2. Lo que lo obstaculiza", position: "col-start-2 row-start-2" },
  { id: 3, name: "3. Su base o raíz", position: "col-start-2 row-start-3" },
  { id: 4, name: "4. Su pasado más reciente", position: "col-start-1 row-start-2" },
  { id: 5, name: "5. Las posibilidades", position: "col-start-2 row-start-1" },
  { id: 6, name: "6. Su futuro inmediato", position: "col-start-3 row-start-2" },
  { id: 7, name: "7. El consultante", position: "col-start-4 row-start-4" },
  { id: 8, name: "8. El entorno", position: "col-start-4 row-start-3" },
  { id: 9, name: "9. Anhelos o temores", position: "col-start-4 row-start-2" },
  { id: 10, name: "10. El desenlace final", position: "col-start-4 row-start-1" },
]

const tarotCards = tarotCardsModule.tarotCards;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
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
  const hasInitialized = useRef(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const pregunta = searchParams.get("pregunta")
    if (pregunta && !hasInitialized.current) {
      hasInitialized.current = true
      const decodedQuestion = decodeURIComponent(pregunta)
      const newShuffledCards = shuffleArray(tarotCards).slice(0, 10);
      // Creamos las orientaciones y las guardamos en una variable local
      const newOrientations = Array.from({ length: 10 }, () => Math.random() > 0.5);

      setQuestion(decodedQuestion);
      setCardOrientations(newOrientations); // Las guardamos en el estado para la UI
      setShuffledCards(newShuffledCards);
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

      setTimeout(() => {
        setShowReading(true);
        setTimeout(() => {
          setShowChat(true);
          initializeChat(decodedQuestion, newShuffledCards, newOrientations);
        }, 2000);
      }, 500);
    }
  }, [searchParams])

  const initializeChat = async (pregunta: string, newShuffledCards: (typeof tarotCards), newOrientations: boolean[]) => {
    setIsLoading(true);
    try {
      console.log("[v0] Initializing chat with question:", pregunta);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Hola Madame Elara, mi pregunta es: "${pregunta}". Por favor, interpreta mi tirada de la Cruz Celta.`,
          question: pregunta,
          cards: newShuffledCards.map((card, index) => ({
            carta: card.name,
            posicion: celticCrossPositions[index].name,
            orientacion: newOrientations[index] ? "derecha" : "invertida",
            description: newOrientations[index] ? card.description.upright : card.description.reversed,
          })),
        }),
      });

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
      console.error("[v0] Error initializing chat:", error)
      setChatMessages([
        {
          sender: "Madame Elara",
          message:
            "Las energías están perturbadas en este momento. Como Madame Elara, te invito a respirar profundamente y reconectar con tu intuición. Las cartas esperan pacientemente tu consulta.",
        },
      ])
    } finally {
      setIsLoading(false)
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
            })),
          }),
        })

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
        console.error("[v0] Error sending message:", error)
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "Madame Elara",
            message:
              "Siento una interferencia en las energías cósmicas. Las cartas necesitan un momento para realinearse. Por favor, intenta de nuevo.",
          },
        ])
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

              <div className="grid grid-cols-4 grid-rows-4 gap-4 md:gap-8 max-w-xl mx-auto relative h-[700px]">
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
                        <div
                          className={`transition-transform duration-500 ${positionInfo.id === 2 ? "rotate-90" : ""}`}
                        >
                          <div className="w-22 h-38 rounded-lg overflow-hidden shadow-lg border-2 border-primary/20" >
                            <Image
                              src={card.image || "/placeholder.svg"}
                              alt={card.name}
                              width={88}
                              height={152}
                              className={`w-full h-full object-cover ${isReversed ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>

                        <div className="mt-2">
                          <p className="text-xs text-center text-muted-foreground font-medium">{positionInfo.name}</p>
                        </div>

                        <div
                          className={`absolute z-50 bg-card border border-primary/30 rounded-lg p-4 shadow-xl w-72 max-w-[90vw] 
                          ${index < 5 ? "-top-4 left-full ml-4" : "-bottom-4 right-full mr-4"} 
                          transform transition-opacity duration-200 pointer-events-none
                          ${showTooltip ? "opacity-100" : "opacity-0"}
                          md:pointer-events-none
                          `}
                        >
                          <h3 className="font-serif text-primary font-semibold mb-1 text-sm">{positionInfo.name}</h3>
                          <h4 className="font-semibold mb-2 text-sm">
                            {card.name} {isReversed ? "(Invertida)" : "(Derecha)"}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isReversed ? card.description.reversed : card.description.upright}
                          </p>
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
          <section className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-serif text-center mb-8 text-primary">Interpretación y Consulta</h2>

              <Card className="bg-card border-primary/30">
                <CardContent className="p-6">
                  <div className="space-y-6 mb-6 max-h-96 overflow-y-auto">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === "Tú" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-3xl p-4 rounded-lg ${
                            msg.sender === "Tú" ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {msg.sender === "Madame Elara" && <Moon className="w-4 h-4 text-primary" />}
                            <p className="font-semibold text-sm">{msg.sender}</p>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-3xl p-4 rounded-lg bg-muted mr-12">
                          <div className="flex items-center gap-2 mb-2">
                            <Moon className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-sm">Madame Elara</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary animate-spin" />
                            <p className="text-sm text-muted-foreground">Consultando las cartas...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
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
