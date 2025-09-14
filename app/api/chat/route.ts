import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, question, cards } = await request.json()

    console.log("[v0] Chat API called with:", { message, conversationId, question })

    const difyApiKey = process.env.DIFY_API_KEY;
    const difyApiUrl = process.env.DIFY_API_URL || "https://api.dify.ai/v1";

    if (!difyApiKey) {
      console.log("[v0] Dify API key not configured")
      return NextResponse.json({ error: "Dify API key not configured" }, { status: 500 })
    }

    const context = `Eres Madame Elara, una sabia tarotista. La consulta fue: "${question}". Las cartas: ${cards?.join(", ") || "cartas místicas"}. Responde en español con tono místico pero accesible.`

    const requestBody = {
      inputs: {},
      query: `${context}\n\nPregunta del usuario: ${message}`,
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
          "Disculpa, las energías cósmicas están perturbadas en este momento. Como Madame Elara, puedo decirte que las cartas sugieren paciencia y reflexión. Tu pregunta sobre '" +
          question +
          "' requiere una meditación más profunda. Por favor, reformula tu consulta o intenta de nuevo más tarde.",
        conversationId: conversationId || "fallback-" + Date.now(),
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
      conversationId: "fallback-" + Date.now(),
      fallback: true,
    })
  }
}
