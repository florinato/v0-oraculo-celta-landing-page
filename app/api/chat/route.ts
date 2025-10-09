import { type NextRequest, NextResponse } from "next/server"

interface Card {
  carta: string
  posicion: string
  orientacion: string
}

const buildCardsContext = (cards: Card[]): string => {
  return cards.map((card) => `Carta: ${card.carta} (${card.posicion}, ${card.orientacion}).`).join(" ")
}

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      conversationId,
      question,
      cards,
    }: { message: string; conversationId?: string; question: string; cards: Card[] } = await request.json()

    if (!message && !conversationId && (!question || !cards || !cards.length)) {
      return NextResponse.json({ error: "Faltan parámetros requeridos: message, question, o cards." }, { status: 400 })
    }

    console.log("[v0] Chat API called with:", { message, conversationId, question: question, cardCount: cards.length })

    const difyApiKey = process.env.DIFY_API_KEY
    const difyApiUrl = process.env.DIFY_API_URL || "https://api.dify.ai/v1"

    if (!difyApiKey) {
      console.log("[v0] Dify API key not configured")
      return NextResponse.json({ error: "Dify API key not configured" }, { status: 500 })
    }

    console.log("[v0] Dify API key configured")

    const cardsDescription = buildCardsContext(cards)
    const initialPrompt = `Eres Madame Elara, una sabia tarotista. La consulta fue: "${question}". La tirada de la Cruz Celta es la siguiente: ${cardsDescription}. Responde en español con tono místico pero accesible.`

    const requestBody = {
      inputs: {},
      query: message || initialPrompt,
      response_mode: "blocking",
      user: "tarot-user",
      ...(conversationId && { conversation_id: conversationId }),
    }

    console.log("[v0] Sending request to Dify:", JSON.stringify(requestBody, null, 2))

    const response = await fetch(`${difyApiUrl}/chat-messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${difyApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] Dify response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Dify error response:", errorText)

      return NextResponse.json({
        message:
          "Disculpa, las energías cósmicas están perturbadas en este momento. Como Madame Elara, puedo decirte que las cartas sugieren paciencia y reflexión.",
        fallback: true,
      })
    }

    const data = await response.json()
    console.log("[v0] Dify success response:", data)

    return NextResponse.json({
      message: data.answer,
      conversationId: data.conversation_id,
    })
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return NextResponse.json({
      message:
        "Las cartas se han nublado momentáneamente. Como Madame Elara, siento que las energías necesitan realinearse. Tu consulta es importante, pero las fuerzas cósmicas requieren un momento de pausa antes de revelar sus secretos.",
      fallback: true,
    })
  }
}
