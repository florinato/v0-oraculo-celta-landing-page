export interface BacklinkKeyword {
  keyword: string
  url: string
  title: string
}

const BACKLINK_KEYWORDS: BacklinkKeyword[] = [
  { keyword: "consulta", url: "/", title: "Consulta gratis al oráculo" },
  { keyword: "lectura de tarot", url: "/", title: "Haz tu lectura de tarot" },
  { keyword: "tirada", url: "/", title: "Realiza tu tirada" },
  { keyword: "oráculo", url: "/", title: "Consulta al oráculo" },
  { keyword: "cartas del tarot", url: "/", title: "Lee las cartas del tarot" },
]

export function addBacklinksToContent(htmlContent: string): string {
  let processedContent = htmlContent
  const linkedKeywords = new Set<string>()

  BACKLINK_KEYWORDS.forEach(({ keyword, url, title }) => {
    if (linkedKeywords.has(keyword)) return

    // Case-insensitive search, but preserve original case
    const regex = new RegExp(`\\b(${keyword})\\b`, "i")
    const match = processedContent.match(regex)

    if (match) {
      const originalText = match[0]
      const link = `<a href="${url}" class="text-primary hover:text-primary/80 underline decoration-primary/50 hover:decoration-primary transition-colors" title="${title}">${originalText}</a>`

      processedContent = processedContent.replace(regex, link)
      linkedKeywords.add(keyword)
    }
  })

  const ctaSection = `
    <div class="mt-12 p-8 bg-primary/5 border-2 border-primary/20 rounded-xl text-center">
      <h3 class="text-2xl font-serif text-primary mb-4">¿Listo para tu consulta personal?</h3>
      <p class="text-muted-foreground mb-6">Descubre lo que el tarot tiene preparado para ti. Consulta gratis, sin registro.</p>
      <a href="/" class="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        Consultar al Oráculo
      </a>
    </div>
  `

  return processedContent + ctaSection
}
