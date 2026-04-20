"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Shield } from "lucide-react"

export default function OracleHomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Integrated Background with Aislinn */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/aislinn-scene.jpg"
          alt="Aislinn en su ambiente místico"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif text-balance leading-tight text-white drop-shadow-lg">
              Aislinn
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto text-pretty leading-relaxed drop-shadow">
              La sabia que lee los secretos del destino en las cartas ancestrales
            </p>
          </div>

          {/* Consultation Button */}
          <Button
            onClick={() => router.push("/oracle/aislinn")}
            className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:via-amber-800 hover:to-amber-900 text-white px-8 py-4 text-lg font-semibold shadow-lg"
          >
            Consultar a Aislinn
          </Button>

          {/* Privacy Notice */}
          <div className="mt-10 p-6 bg-black/40 backdrop-blur-md rounded-lg border-l-4 border-amber-200/60">
            <div className="flex items-start gap-4">
              <Shield className="w-5 h-5 text-amber-200/80 mt-0.5 flex-shrink-0" />
              <div className="text-left space-y-2">
                <p className="text-base text-amber-200/90 tracking-wide">
                  consulta anónima ◆ lecturas gratis ◆ sin necesidad de registro
                </p>
                <p className="text-sm text-amber-100 font-serif italic leading-relaxed">
                  <span className="font-semibold text-amber-200/90">Privacidad garantizada:</span> No recopilamos ni
                  almacenamos ningún dato de tu conversación. Todas las consultas son completamente privadas y
                  confidenciales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
