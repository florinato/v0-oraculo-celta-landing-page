"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, Star, Moon, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const celticCrossPositions = [
  { id: 1, name: "La situación actual", position: "col-start-2 row-start-2" },
  { id: 2, name: "El desafío", position: "col-start-2 row-start-2 rotate-90" },
  { id: 3, name: "El pasado distante", position: "col-start-1 row-start-2" },
  { id: 4, name: "El futuro posible", position: "col-start-3 row-start-2" },
  { id: 5, name: "La corona", position: "col-start-2 row-start-1" },
  { id: 6, name: "La base", position: "col-start-2 row-start-3" },
  { id: 7, name: "Tu enfoque", position: "col-start-4 row-start-4" },
  { id: 8, name: "Influencias externas", position: "col-start-4 row-start-3" },
  { id: 9, name: "Esperanzas y miedos", position: "col-start-4 row-start-2" },
  { id: 10, name: "El resultado", position: "col-start-4 row-start-1" },
]

const sampleCards = [
  "El Mago",
  "La Sacerdotisa",
  "La Emperatriz",
  "El Emperador",
  "El Hierofante",
  "Los Enamorados",
  "El Carro",
  "La Fuerza",
  "El Ermitaño",
  "La Rueda de la Fortuna",
]

function ReadingContent() {
  const [showReading, setShowReading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string }>>([])
  const [newMessage, setNewMessage] = useState("")
  const [question, setQuestion] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const pregunta = searchParams.get("pregunta")
    if (pregunta) {
      setQuestion(decodeURIComponent(pregunta))
      setTimeout(() => {
        setShowReading(true)
        setTimeout(() => {
          setShowChat(true)
          setChatMessages([
            {
              sender: "Madame Elara",
              message: `Las cartas han hablado sobre tu pregunta: "${decodeURIComponent(pregunta)}". Veo una situación compleja que requiere de tu sabiduría interior. El Mago en tu posición actual indica que tienes todos los recursos necesarios para manifestar tus deseos, pero debes actuar con determinación y claridad de propósito.\n\nLa presencia de La Sacerdotisa sugiere que la intuición será tu mejor guía en este momento. Confía en esa voz interior que te susurra las respuestas que buscas. El camino hacia la resolución no será inmediato, pero cada paso que des con consciencia te acercará a tu objetivo.\n\nRecuerda que las cartas no predicen un destino fijo, sino que te muestran las energías presentes y las posibilidades que se abren ante ti. ¿Hay algún aspecto específico de esta lectura sobre el que te gustaría profundizar?`,
            },
          ])
        }, 2000)
      }, 500)
    }
  }, [searchParams])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { sender: "Tú", message: newMessage },
        {
          sender: "Madame Elara",
          message:
            "Las cartas revelan más detalles sobre tu consulta. Permíteme meditar un momento sobre las energías que percibo...",
        },
      ])
      setNewMessage("")
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

              <div className="grid grid-cols-4 grid-rows-4 gap-4 max-w-4xl mx-auto">
                {celticCrossPositions.map((position, index) => (
                  <Card
                    key={position.id}
                    className={`${position.position} bg-card border-primary/30 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20`}
                  >
                    <CardContent className="p-4 text-center space-y-3">
                      <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center border border-primary/20">
                        <Star className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-primary">
                          {position.id}. {position.name}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {sampleCards[index]} {Math.random() > 0.5 ? "(derecha)" : "(invertida)"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                  </div>

                  <div className="flex gap-3">
                    <Input
                      placeholder="Haz una pregunta de seguimiento..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 bg-background border-border focus:border-primary"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Enviar
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
