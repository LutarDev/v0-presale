"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { UnifiedPurchaseInterfaceModal } from "@/components/unified-purchase-interface-modal"
import { Wallet } from "lucide-react"

export function PurchaseModalTrigger() {
  const [isOpen, setIsOpen] = useState(false)

  const handleComplete = (result: any) => {
    console.log('Purchase completed:', result)
    setIsOpen(false)
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        size="lg"
        className="w-full max-w-md mx-auto text-lg py-6"
      >
        <Wallet className="w-5 h-5 mr-2" />
        Buy LUTAR Tokens
      </Button>

      <UnifiedPurchaseInterfaceModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComplete={handleComplete}
      />
    </>
  )
}