"use client"

import { Header } from "@/components/header"
import { UnifiedPurchaseInterfaceEmbed } from "@/components/unified-purchase-interface-embed"
import { Footer } from "@/components/footer"

export default function Embed() {
  const handleComplete = (result: any) => {
    console.log('Purchase completed:', result)
    // Handle completion logic - redirect to dashboard, show success message, etc.
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <main className="py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Purchase LUTAR Tokens</h1>
            <p className="text-muted-foreground">
              Join the presale and secure your LUTAR tokens at the best price
            </p>
          </div>
          
          <UnifiedPurchaseInterfaceEmbed 
            onComplete={handleComplete}
            className="max-w-3xl mx-auto"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}