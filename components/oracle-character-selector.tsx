"use client"

import { useRouter } from "next/navigation"
import { useOracle } from "@/lib/oracle-context"
import { Button } from "@/components/ui/button"
import { oracleCharacters, type OracleCharacter } from "@/lib/oracle-characters"
import { Sparkles } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export function OracleCharacterSelector() {
  const router = useRouter()
  const { selectCharacter } = useOracle()

  const handleSelectCharacter = (character: OracleCharacter) => {
    selectCharacter(character)
    router.push(`/oracle/${character}`)
  }

  const getHoverAnimation = (characterKey: string) => {
    switch (characterKey) {
      case "aislinn":
        return {
          scale: 1.05,
          rotate: [0, -3, 3, -3, 0],
          boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)",
          transition: { duration: 0.6 },
        }
      case "morvan":
        return {
          y: -10,
          scale: 1.05,
          boxShadow: "0 0 40px rgba(245, 158, 11, 0.8)",
          transition: { duration: 0.4 },
        }
      case "sybil":
        return {
          scale: [1, 1.05, 1, 1.05, 1],
          boxShadow: "0 0 35px rgba(168, 85, 247, 0.7)",
          filter: "blur(0.5px)",
          transition: { duration: 1.2, repeat: Number.POSITIVE_INFINITY },
        }
      default:
        return {}
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Object.entries(oracleCharacters).map(([key, character]) => (
          <motion.div
            key={key}
            className="flex flex-col items-center space-y-6 cursor-pointer"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`relative w-40 h-40 rounded-full overflow-hidden border-4 ${character.borderColor} 
              bg-gradient-to-br ${character.color} shadow-2xl cursor-pointer`}
              whileHover={getHoverAnimation(key)}
              onClick={() => handleSelectCharacter(key as OracleCharacter)}
            >
              <Image
                src={character.image || "/placeholder.svg"}
                alt={character.name}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {key === "morvan" && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-amber-300 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [-20, -40],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Character Info */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-serif text-primary font-bold">{character.name}</h3>
              <p className="text-sm text-muted-foreground italic">{character.description}</p>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">{character.intro}</p>
            </div>

            <Button
              onClick={() => handleSelectCharacter(key as OracleCharacter)}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 
              text-white font-serif font-semibold gap-2 border-2 border-amber-400/50 shadow-lg shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Lectura Gratis
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
