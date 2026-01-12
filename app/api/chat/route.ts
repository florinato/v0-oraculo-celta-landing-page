import { type NextRequest, NextResponse } from "next/server"

interface Card {
  carta: string
  posicion: string
  orientacion: string
  description?: string
}

const buildCardsContext = (cards: Card[]): string => {
  return cards
    .map((card) => `Carta: ${card.carta} (${card.posicion}, ${card.orientacion}). ${card.description || ""}`)
    .join(" ")
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

    console.log("[v0] Chat API called with:", { message, conversationId, question, cardCount: cards.length })

    const difyApiKey = process.env.DIFY_API_KEY
    const difyApiUrl = process.env.DIFY_API_URL || "https://api.dify.ai/v1"

    console.log("[v0] Using Dify API URL:", difyApiUrl)
    console.log("[v0] DIFY_API_KEY is set:", !!difyApiKey)

    if (!difyApiKey) {
      console.log("[v0] Dify API key not configured")
      return NextResponse.json({ error: "Dify API key not configured" }, { status: 500 })
    }

    const cardsDescription = buildCardsContext(cards)
    const initialPrompt = `Eres Madame Elara, una sabia tarotista. La consulta fue: "${question}". La tirada de la Cruz Celta es la siguiente: ${cardsDescription}. Responde en español con tono místico pero accesible.`

    const requestBody = {
      inputs: {},
      query: message || initialPrompt,
      response_mode: "blocking",
      user: "tarot-user",
      ...(conversationId && { conversation_id: conversationId }),
    }

    console.log("[v0] Sending request to Dify API")

    const fullUrl = `${difyApiUrl}/chat-messages`
    console.log("[v0] Full API URL:", fullUrl)

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${difyApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] Dify response status:", response.status)
    const contentType = response.headers.get("content-type")
    console.log("[v0] Dify response content-type:", contentType)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Dify error response:", errorText.substring(0, 500))

      return NextResponse.json({
        message:
          "Disculpa, las energías cósmicas están perturbadas en este momento. Como Madame Elara, puedo decirte que las cartas sugieren paciencia y reflexión.",
        fallback: true,
      })
    }

    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text()
      console.log("[v0] Dify returned non-JSON response:", responseText.substring(0, 500))

      return NextResponse.json({
        message:
          "Las energías están alineándose... Madame Elara necesita ajustar su conexión con el cosmos. Verifica que el endpoint de la API de Dify sea correcto y que la clave de API tenga los permisos adecuados.",
        fallback: true,
      })
    }

    const data = await response.json()
    console.log("[v0] Dify response received successfully")

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
