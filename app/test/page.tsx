//import { Header } from "@/components/header"
import { PurchaseInterface } from "@/components/purchase-interface"
import { PurchaseModalTrigger } from "@/components/purchase-modal-trigger"
import { UnifiedPurchaseInterfaceModal } from "@/components/unified-purchase-interface-modal"
import { Footer } from "@/components/footer"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <main className="py-8">
        <div className="container mx-auto max-w-4xl px-4 mt-12">
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Quick Purchase</h2>
              <p className="text-muted-foreground mb-6">
                Use our streamlined purchase flow for a faster buying experience
              </p>
              <PurchaseModalTrigger />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
