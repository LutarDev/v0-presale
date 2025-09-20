import { Header } from "@/components/header"
import { PurchaseInterface } from "@/components/purchase-interface"
import { Footer } from "@/components/footer"

export default function BuyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <main className="py-8">
        <PurchaseInterface />
      </main>
      <Footer />
    </div>
  )
}
