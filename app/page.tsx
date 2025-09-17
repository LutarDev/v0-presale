import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PresaleStats } from "@/components/presale-stats"
import { BlockchainSelector } from "@/components/blockchain-selector"
import { PresaleProgress } from "@/components/presale-progress"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PresaleStats />
        <BlockchainSelector />
        <PresaleProgress />
      </main>
      <Footer />
    </div>
  )
}
