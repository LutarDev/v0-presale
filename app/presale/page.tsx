import { Header } from "@/components/header"
import { PresaleHero } from "@/components/presale-hero"
import { TokenomicsSection } from "@/components/tokenomics-section"
import { RoadmapSection } from "@/components/roadmap-section"
import { TeamSection } from "@/components/team-section"
import { PresaleMetrics } from "@/components/presale-metrics"
import { SecurityAudit } from "@/components/security-audit"
import { Footer } from "@/components/footer"

export default function PresalePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PresaleHero />
        <PresaleMetrics />
        <TokenomicsSection />
        <RoadmapSection />
        <TeamSection />
        <SecurityAudit />
      </main>
      <Footer />
    </div>
  )
}
