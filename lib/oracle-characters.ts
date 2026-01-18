export const oracleCharacters = {
  aislinn: {
    id: "aislinn",
    name: "Aislinn",
    description: "La Bruja del Bosque",
    intro: "Aislinn es una vidente conectada con la magia natural. Sus lecturas revelan los hilos del destino.",
    color: "from-emerald-600 to-emerald-800",
    borderColor: "border-emerald-500/50",
    image: "/images/aislinn-portrait.jpg",
  },
  morvan: {
    id: "morvan",
    name: "Morvan",
    description: "El Mago Ancestral",
    intro: "Morvan es un sabio de tiempos antiguos. Sus cartas revelan la sabiduría acumulada de generaciones.",
    color: "from-amber-600 to-amber-800",
    borderColor: "border-amber-500/50",
    image: "/images/morvan-portrait.jpg",
  },
  sybil: {
    id: "sybil",
    name: "Sybil",
    description: "La Sacerdotisa de los Misterios",
    intro: "Sybil canaliza la energía de los misterios cósmicos. Sus vaticinios atraviesan los velos entre mundos.",
    color: "from-purple-600 to-purple-800",
    borderColor: "border-purple-500/50",
    image: "/images/sybil-portrait.jpg",
  },
}

export type OracleCharacter = keyof typeof oracleCharacters
