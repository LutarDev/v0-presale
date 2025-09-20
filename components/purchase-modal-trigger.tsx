"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { UnifiedPurchaseInterfaceModal } from "@/components/unified-purchase-interface-modal"
import { Wallet, TrendingUp } from "lucide-react"

export function PurchaseModalTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  const handleComplete = (result: any) => {
    console.log('Purchase completed:', result)
    setIsOpen(false)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button 
        onClick={handleOpen}
        size="lg"
        className="w-full max-w-md mx-auto text-lg py-6 relative overflow-hidden group"
      >
        <div className="flex items-center justify-center">
          <Wallet className="w-5 h-5 mr-2" />
          Buy LUTAR Tokens
          <TrendingUp className="w-4 h-4 ml-2 opacity-70" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </Button>

      <UnifiedPurchaseInterfaceModal
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </>
  )
}