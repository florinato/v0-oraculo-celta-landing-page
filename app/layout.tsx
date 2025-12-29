import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://tarotcelta.es"),
  title: {
    default: "Oráculo de Elara - Tarot Celta Online | Lectura Gratuita",
    template: "%s | Oráculo de Elara",
  },
  description:
    "Consulta al Oráculo de Elara. Recibe una lectura de tarot celta profunda, personal e interactiva, guiada por la sabiduría de la inteligencia artificial. Descubre tu destino.",
  keywords: ["tarot celta", "oráculo", "lectura de tarot", "tarot online", "adivinación", "tarot gratis", "elara"],
  authors: [{ name: "Oráculo de Elara" }],
  creator: "Oráculo de Elara",
  publisher: "Oráculo de Elara",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://tarotcelta.es",
    siteName: "Oráculo de Elara",
    title: "Oráculo de Elara - Tarot Celta Online | Lectura Gratuita",
    description:
      "Consulta al Oráculo de Elara. Recibe una lectura de tarot celta profunda, personal e interactiva, guiada por la sabiduría de la inteligencia artificial.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Oráculo de Elara - Tarot Celta Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oráculo de Elara - Tarot Celta Online",
    description: "Consulta al Oráculo de Elara. Recibe una lectura de tarot celta profunda y personal.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`font-sans ${playfair.variable} ${inter.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
