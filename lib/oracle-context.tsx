"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

export type OracleCharacter = "aislinn" | "morvan" | "sybil"

interface OracleContextType {
  selectedCharacter: OracleCharacter | null
  selectCharacter: (character: OracleCharacter) => void
}

const OracleContext = createContext<OracleContextType | undefined>(undefined)

export function OracleProvider({ children }: { children: React.ReactNode }) {
  const [selectedCharacter, setSelectedCharacter] = useState<OracleCharacter | null>(null)

  const selectCharacter = (character: OracleCharacter) => {
    setSelectedCharacter(character)
  }

  return <OracleContext.Provider value={{ selectedCharacter, selectCharacter }}>{children}</OracleContext.Provider>
}

export function useOracle() {
  const context = useContext(OracleContext)
  if (!context) {
    throw new Error("useOracle must be used within OracleProvider")
  }
  return context
}
