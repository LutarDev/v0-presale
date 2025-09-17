"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Shield, X, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

export function AntiPhishingBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    setCurrentUrl(window.location.hostname)
    // Show banner if not on official domain
    if (!window.location.hostname.includes("lutar.io") && !window.location.hostname.includes("localhost")) {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  return (
    <Alert className="border-red-500 bg-red-500/10 mb-4">
      <Shield className="h-4 w-4 text-red-500" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong className="text-red-950">Security Warning:</strong> You are not on the official LUTAR website
          (lutar.io). This could be a phishing attempt. Always verify the URL before connecting your wallet or making
          transactions.
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="destructive" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Go to Official Site
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsVisible(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
