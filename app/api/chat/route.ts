import { type NextRequest } from "next/server"

interface Card {
  position: number
  name: string
  is_reversed: boolean
}

export async function POST(request: NextRequest) {
  try {
    const {
      personality_prompt,
      format_id,
      user_question,
      cards,
    }: {
      personality_prompt: string
      format_id: string
      user_question: string
      cards: Card[]
    } = await request.json()

    if (!user_question || !cards || !cards.length || !personality_prompt || !format_id) {
      return new Response(JSON.stringify({ error: "Faltan parámetros requeridos: personality_prompt, format_id, user_question, cards." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log("[v0] Chat API called with:", {
      personality_prompt,
      format_id,
      user_question,
      cardCount: cards.length
    })

    const apiSecret = process.env.FRONTEND_API_SECRET
    const apiUrl = process.env.URL_GOOGLE || "http://0.0.0.0:8080"

    if (!apiSecret) {
      console.log("[v0] FRONTEND_API_SECRET not configured")
      return new Response(JSON.stringify({ error: "API secret not configured" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const requestBody = {
      personality_prompt,
      format_id,
      knowledge_base_id: "none",
      user_question,
      cards
    }

    console.log("[v0] Sending request to backend:", JSON.stringify(requestBody, null, 2))

    const response = await fetch(`${apiUrl}/api/interpretar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Auth-Token": apiSecret
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] Backend error response:", errorText.substring(0, 200))

      return new Response(JSON.stringify({
        message: "Disculpa, las energías cósmicas están perturbadas en este momento. Las cartas sugieren paciencia y reflexión.",
        fallback: true,
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Configurar streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          controller.close()
          return
        }

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))
                  if (data.text) {
                    controller.enqueue(`data: ${JSON.stringify({ text: data.text })}\n\n`)
                  }
                } catch (e) {
                  // Ignorar líneas que no sean JSON válido
                  console.log("[v0] Ignored non-JSON line:", line)
                }
              }
            }
          }
        } catch (error) {
          console.error("[v0] Error processing stream:", error)
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return new Response(JSON.stringify({
      message: "Las cartas se han nublado momentáneamente. Las energías necesitan realinearse antes de revelar sus secretos.",
      fallback: true,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
