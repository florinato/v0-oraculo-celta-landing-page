"use client"

import { useState, useEffect } from "react"

export function AdsBanner() {
  const [showAds, setShowAds] = useState(false)

  useEffect(() => {
    // Load Google Ads script
    const script = document.createElement("script")
    script.async = true
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID
    script.onload = () => setShowAds(true)
    document.head.appendChild(script)
  }, [])

  if (!process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID) {
    return null
  }

  return (
    <div className="w-full my-4 p-4 bg-muted/50 rounded-lg border border-border">
      {showAds && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
          data-ad-slot={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
      {!showAds && <div className="h-20 bg-muted rounded animate-pulse" />}
    </div>
  )
}
